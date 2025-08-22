import { SearchType, SortBy } from '@model/board';
import type { CommonResponse } from '@model/common';
import type {
  FileAttachment,
  GalleryListItem,
  Post,
  PostBookmark,
  PostDetail,
} from '@model/post';
import baseService from '@services/baseService';

// 파일 첨부 정보 인터페이스
interface PostService {
  boardId: number;
  page: number;
  pageSize?: number;
  sortBy?: SortBy;
  searchType?: SearchType;
  searchText?: string;
  categoryId?: string | number | null;
}

interface PostDetailService {
  title: string;
  content: string;
  files: File[];
  boardId: number;
  attachments?: FileAttachment[];
  downloadPoint?: number;
  metadata?: {
    thumbnail: string | null;
    [key: string]: string | null;
  };
  categoryId?: number | null;
  isNotice?: boolean;
  hasFiles?: boolean;
}

export interface PostDownloadHistory {
  expires_at: string;
  download_urls: FileAttachment[];
  message: string;
  point_deducted: number;
  success: boolean;
}

const postService = {
  getPost({
    boardId,
    page,
    pageSize = 10,
    sortBy,
    searchType,
    searchText,
    categoryId,
  }: PostService): Promise<CommonResponse<Post>> {
    let url = `/api/post?boardId=${boardId}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&searchType=${searchType}&searchText=${searchText}&needNotice=true`;
    if (categoryId !== undefined && categoryId !== null && categoryId !== '') {
      url += `&categoryId=${categoryId}`;
    }
    return baseService.getMini<Post>(url, '게시글 목록 로딩중...');
  },
  createPost({
    boardId,
    title,
    content,
    files,
    attachments,
    metadata,
    categoryId,
    downloadPoint,
    isNotice,
    hasFiles,
  }: PostDetailService): Promise<CommonResponse<PostDetail>> {
    // FormData를 사용하여 파일과 함께 데이터 전송
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('boardId', boardId.toString());
    formData.append('isNotice', isNotice?.toString() || 'false');
    if (categoryId !== null && categoryId !== undefined) {
      formData.append('categoryId', categoryId.toString());
    }
    if (downloadPoint !== undefined && downloadPoint !== null) {
      formData.append('downloadPoint', downloadPoint.toString());
    }
    // 첨부 파일 정보
    if (attachments && attachments.length > 0) {
      formData.append('attachments', JSON.stringify(attachments));
    }

    // 메타데이터 추가
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    // 원본 파일도 넣을 수 있음 (서버가 직접 처리하는 경우)
    if (files && files.length > 0) {
      files.map(file => {
        formData.append('files', file);
      });
    }

    // 파일 첨부 여부 추가
    formData.append('hasFiles', hasFiles?.toString() || 'false');

    // axios 인스턴스를 직접 사용하여 formData 전송
    return baseService.postMini<PostDetail, FormData>(
      `/api/post/${boardId}`,
      formData,
      '게시글 등록중...'
    );
  },
  reactionPost(
    postId: number,
    reactionType: 'like' | 'dislike'
  ): Promise<CommonResponse<PostDetail>> {
    const reactionText =
      reactionType === 'like' ? '추천 처리중...' : '비추천 처리중...';
    return baseService.postMini<PostDetail, object>(
      `/api/post/${postId}/reaction`,
      { reactionType },
      reactionText
    );
  },
  deletePost(postId: number): Promise<CommonResponse<PostDetail>> {
    return baseService.deleteMini<PostDetail>(
      `/api/post/${postId}`,
      '게시글 삭제중...'
    );
  },
  updatePost(
    postId: number,
    postData: PostDetailService
  ): Promise<CommonResponse<PostDetail>> {
    return baseService.putMini<PostDetail, PostDetailService>(
      `/api/post/${postId}`,
      postData,
      '게시글 수정중...'
    );
  },
  purchaseFiles(postId: number): Promise<CommonResponse<PostDownloadHistory>> {
    return baseService.postMini<PostDownloadHistory, object>(
      `/api/post/${postId}/purchase`,
      {},
      '파일 구매 처리중...'
    );
  },
  bookmarkPost(postId: number): Promise<CommonResponse<PostBookmark>> {
    return baseService.postMini<PostBookmark, object>(
      `/api/post/${postId}/bookmark`,
      {},
      '북마크 처리중...'
    );
  },
  deleteBookmarkPost(postId: number): Promise<CommonResponse<boolean>> {
    return baseService.deleteMini<boolean>(
      `/api/post/${postId}/bookmark`,
      '북마크 삭제중...'
    );
  },
  getBookmarkPosts(): Promise<CommonResponse<GalleryListItem[]>> {
    return baseService.getMini<GalleryListItem[]>(
      `/api/post/bookmarks`,
      '북마크된 게시글 불러오는 중...'
    );
  },
  movePost(
    postId: number,
    boardId: number
  ): Promise<CommonResponse<PostDetail>> {
    return baseService.patchMini<PostDetail, object>(
      `/api/post/${postId}`,
      { board_id: boardId },
      '게시글 이동중...'
    );
  },
};

// 새로운 비동기 업로드 관련 인터페이스
interface DraftPostRequest {
  title: string;
  content: string;
  boardId: number;
  categoryId?: number;
}

interface DraftPostResponse {
  id: number;
  title: string;
  content: string;
  status: 'DRAFT';
  createdAt: string;
}

interface AsyncUploadConfig {
  needWatermark?: boolean;
  watermarkPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  watermarkOpacity?: number;
}

interface UploadStartResponse {
  success: boolean;
  data: {
    uploadId: string;
    postId: number;
    totalFiles: number;
    estimatedDuration: number;
  };
  message: string;
}

interface UploadProgressResponse {
  success: boolean;
  data: {
    postId: number;
    overallProgress: number;
    status: 'processing' | 'completed' | 'failed';
    totalFiles: number;
    completedFiles: number;
    files: FileAttachment[];
  };
  message: string;
}

// 새로운 비동기 업로드 메서드들 추가
const asyncUploadMethods = {
  async createDraftPost(
    postData: DraftPostRequest
  ): Promise<DraftPostResponse> {
    const response = await baseService.postMini<
      DraftPostResponse,
      DraftPostRequest
    >('/api/posts/draft', postData, '게시글 초안 생성중...');
    return response.data as DraftPostResponse;
  },

  async publishPost(postId: number): Promise<void> {
    await baseService.putMini<void, object>(
      `/api/posts/${postId}/publish`,
      {},
      '게시글 발행중...'
    );
  },

  async startAsyncFileUpload(
    postId: number,
    files: File[],
    config?: AsyncUploadConfig
  ): Promise<UploadStartResponse['data']> {
    const formData = new FormData();

    // 메타데이터 추가
    formData.append('postId', postId.toString());
    formData.append(
      'needWatermark',
      config?.needWatermark !== false ? 'true' : 'false'
    );
    formData.append(
      'watermarkPosition',
      config?.watermarkPosition || 'bottom-right'
    );
    formData.append(
      'watermarkOpacity',
      (config?.watermarkOpacity || 0.7).toString()
    );

    // 파일들 추가
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await baseService.postMini<UploadStartResponse, FormData>(
      '/api/media/upload-async',
      formData,
      '파일 업로드 시작중...'
    );

    if (!response.data) {
      throw new Error('파일 업로드 시작에 실패했습니다');
    }

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  },

  async getUploadProgress(
    postId: number
  ): Promise<UploadProgressResponse['data']> {
    const response = await baseService.getSilent<UploadProgressResponse>(
      `/api/media/upload-progress/${postId}`
    );

    if (!response.data) {
      throw new Error('진행도 조회에 실패했습니다');
    }

    if (!response.data.success) {
      throw new Error(response.data?.message || '진행도 조회에 실패했습니다');
    }

    return response.data.data;
  },

  async retryFailedFiles(
    postId: number,
    failedFileUuids: string[]
  ): Promise<void> {
    await baseService.postMini<void, object>(
      `/api/media/retry-upload/${postId}`,
      { failedFileUuids },
      '실패한 파일 재업로드 중...'
    );
  },

  async cancelUpload(postId: number): Promise<void> {
    await baseService.deleteMini<void>(
      `/api/media/cancel-upload/${postId}`,
      '업로드 취소중...'
    );
  },

  // 전체 게시글 작성 프로세스 (기존 createPost와 구분)
  async createPostAsync(
    postData: PostDetailService
  ): Promise<DraftPostResponse> {
    // 1. 게시글을 DRAFT 상태로 먼저 생성
    const draftPost = await this.createDraftPost({
      title: postData.title,
      content: postData.content,
      boardId: postData.boardId,
      categoryId: postData.categoryId || undefined,
    });

    // 2. 파일이 있는 경우 비동기 업로드 시작
    if (postData.files && postData.files.length > 0) {
      await this.startAsyncFileUpload(draftPost.id, postData.files);
    } else {
      // 파일이 없는 경우 즉시 발행
      await this.publishPost(draftPost.id);
    }

    return draftPost;
  },
};

// draft 게시글 관리 메서드들
const draftMethods = {
  // 로그인한 사용자의 draft 게시글 목록 가져오기
  getDraftPosts({
    page = 1,
    pageSize = 10,
    sortBy = 'latest',
    writerId,
  }: {
    page?: number;
    pageSize?: number;
    sortBy?: SortBy;
    writerId?: number;
  } = {}): Promise<CommonResponse<Post>> {
    const url = `/api/post?status=draft&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&writerId=${writerId}`;
    return baseService.getSilent<Post>(url);
  },
};

// 기존 postService에 새로운 메서드들 추가
const extendedPostService = {
  ...postService,
  ...asyncUploadMethods,
  ...draftMethods,
};

export default extendedPostService;
