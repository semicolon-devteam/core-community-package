import { getServerSupabaseWithRetry } from '@config/Supabase/server';
import { serverFetch } from '@config/fetch';
import type { Comment } from '@model/comment';
import type { CommonResponse } from '@model/common';
import { CommonStatus } from '@model/common';
import type { ListPost, PostDetail } from '@model/post';
import CommentServiceByServerSide from '@services/commentServiceByServerSide';
import { timeAgo } from '@util/dateUtil';
import { keysToCamelCase } from '@util/stringUtil';
// 파일 첨부 정보 인터페이스
interface PostService {
  boardId: number;
  page: number;
  pageSize?: number;
  sortBy?: string;
  searchType?: string;
  searchText?: string;
  categoryId?: string;
}

const PostServiceByServerSide = {
  getPostByServerSide: async ({
    boardId,
    page,
    pageSize = 15,
    sortBy,
    searchType,
    searchText,
    categoryId,
  }: PostService) => {
    try {
      // URL 파라미터를 명시적으로 숫자로 변환
      const params = new URLSearchParams({
        boardId: String(boardId),
        page: String(page),
        pageSize: String(pageSize),
        sortBy: sortBy || 'latest',
        searchType: searchType || 'title_content',
        searchText: searchText || '',
        categoryId: categoryId || '',
      });

      const url = `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/post?${params.toString()}`;
      const res = await serverFetch(url);

      if (!res.ok) {
        console.error(`API 요청 실패: ${res.status}`);
        return {
          data: { items: [], totalCount: 0 },
          successOrNot: 'Y',
          statusCode: 'SUCCESS',
        };
      }

      const json = await res.json();

      return {
        ...json,
        data: {
          items:
            json.data?.items?.map((item: ListPost) => ({
              ...item,
              created_at: timeAgo(item.created_at || new Date().toISOString()),
              hasImage:
                item.attachments &&
                item.attachments.length > 0 &&
                item.attachments[0].fileType.startsWith('image/'),
            })) || [],
          totalCount: json.data?.totalCount || 0,
        },
      };
    } catch (error) {
      console.error('게시물 조회 오류:', error);
      // 오류 발생 시 기본값 반환
      return {
        data: { items: [], totalCount: 0 },
        successOrNot: 'Y',
        statusCode: 'SUCCESS',
      };
    }
  },

  getPostById: async ({ id }: { id: number }) => {
    try {
      // URL 파라미터를 명시적으로 숫자로 변환
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}`;
      const res = await serverFetch(url);

      const json = await res.json();

      if (json.successOrNot === 'N') {
        return {
          data: json.data,
          successOrNot: 'N',
          statusCode: json.statusCode,
        };
      }

      const post = {
        ...json.data,
        created_at: timeAgo(json.data.created_at),
      };

      // 댓글 가져오기
      const comments = await CommentServiceByServerSide.getCommentsByServerSide(
        {
          postId: id,
          page: 1,
          pageSize: 10,
        }
      );

      // attachments 필드가 문자열인 경우 JSON 배열로 변환
      if (post.attachments && typeof post.attachments === 'string') {
        try {
          post.attachments = JSON.parse(post.attachments);
        } catch (error) {
          console.error('첨부파일 파싱 오류:', error);
          post.attachments = []; // 파싱 실패 시 빈 배열로 설정
        }
      }

      return {
        ...json,
        data: {
          ...post,
          comments: comments.data?.items || [],
          totalComments: comments.data?.totalCount || 0,
        },
      };
    } catch (error) {
      console.error('게시물 조회 오류:', error);
      // 오류 발생 시 기본값 반환
      return {
        data: null,
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
      };
    }
  },

  /**
   * 서버 Supabase 클라이언트로 직접 게시글 데이터를 조회하는 메서드
   * API 라우트를 거치지 않고 데이터베이스에 직접 접근
   */
  getPostByIdDirect: async ({
    id,
  }: {
    id: number;
  }): Promise<
    CommonResponse<
      PostDetail & {
        comments: Comment[];
        totalComments: number;
        postDownloadHistory?: any;
      }
    >
  > => {
    try {
      // 서버 Supabase 클라이언트로 직접 데이터 조회
      const supabase = await getServerSupabaseWithRetry();

      // 클라이언트 IP (서버 환경에서는 고정값 사용)
      const clientIp = '127.0.0.1';

      // posts_read RPC 호출로 게시글 조회 및 조회수 증가
      const { data: postData, error: postError } = await supabase.rpc(
        'posts_read',
        {
          p_post_id: id,
          p_viewer_ip: clientIp,
        }
      );

      if (postError || !postData) {
        const errorMessage = postError?.message || '게시글을 찾을 수 없습니다.';

        // 권한 관련 오류인지 확인
        if (
          postError?.message?.includes('permission') ||
          postError?.message?.includes('access') ||
          postError?.message?.includes('로그인이 필요')
        ) {
          return {
            data: null,
            message: '해당 게시글에 접근할 권한이 없습니다.',
            successOrNot: 'N',
            statusCode: CommonStatus.FORBIDDEN,
          };
        }

        return {
          data: null,
          message: errorMessage,
          successOrNot: 'N',
          statusCode: CommonStatus.NOT_FOUND,
        };
      }

      // 게시글 상세 정보 조회 (JOIN 활용)
      const { data: postDetails, error: detailsError } = await supabase
        .from('posts')
        .select(
          `
          boards!posts_board_id_fkey(
            name,
            permission_settings,
            point_settings,
            feature_settings,
            display_settings
          ),
          users!posts_writer_id_fkey(
            activity_level
          )
        `
        )
        .eq('id', id)
        .single();

      if (detailsError || !postDetails) {
        return {
          data: null,
          message: '게시글 정보를 불러올 수 없습니다.',
          successOrNot: 'N',
          statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
        };
      }

      // 메뉴 링크 조회
      const { data: menuData } = await supabase
        .from('menu')
        .select('link_url')
        .eq('board_id', postData.board_id)
        .eq('type', 'board')
        .maybeSingle();

      // 다운로드 히스토리 조회
      const { data: postDownloadHistory } = await supabase.rpc(
        'post_download_history_get_exist',
        {
          p_post_id: id,
        }
      );

      // 댓글 조회 (기본 10개)
      const { data: commentsData } = await supabase
        .from('comments')
        .select(
          `
          id,
          content,
          writer_id,
          writer_name,
          post_id,
          created_at,
          updated_at,
          users!comments_writer_id_fkey(
            nickname,
            avatar_path,
            activity_level
          )
        `
        )
        .eq('post_id', id)
        .eq('status', 'published')
        .is('deleted_at', null)
        .order('created_at', { ascending: true })
        .limit(10);

      const { count: totalComments } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', id)
        .eq('status', 'published')
        .is('deleted_at', null);

      // 댓글 데이터를 Comment 타입에 맞게 변환
      const comments: Comment[] = (commentsData || []).map((comment: any) => ({
        ...comment,
        writer_avatar: comment.users?.avatar_path || '',
        writer_level: comment.users?.activity_level || 0
      }));

      const { data: categoriesData } = await supabase
        .from('board_categories')
        .select('*')
        .eq('board_id', postData.board_id)
        .order('display_order', { ascending: true });
      

      // 응답 데이터 구성
      const boardInfo = postDetails.boards as any;
      const writerInfo = postDetails.users as any;

      const post: PostDetail = {
        ...postData,
        board: {
          id: postData.board_id,
          name: boardInfo?.name,
          link_url: menuData?.link_url || '/',
        },
        writer_level: writerInfo?.activity_level,
        permission_settings: keysToCamelCase(boardInfo?.permission_settings),
        point_settings: keysToCamelCase(boardInfo?.point_settings),
        feature_settings: keysToCamelCase(boardInfo?.feature_settings),
        display_settings: keysToCamelCase(boardInfo?.display_settings),
        created_at: timeAgo(postData.created_at),
        categories: categoriesData || [],
      };

      return {
        data: {
          ...post,
          comments,
          totalComments: totalComments || 0,
          postDownloadHistory: postDownloadHistory, // 추가 속성으로 포함
        },
        successOrNot: 'Y',
        statusCode: CommonStatus.SUCCESS,
      };
    } catch (error) {
      console.error('게시글 조회 중 오류:', error);
      return {
        data: null,
        message: '게시글을 불러오는 중 오류가 발생했습니다.',
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      };
    }
  },
};

export default PostServiceByServerSide;
