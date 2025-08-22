'use client';

import { useUploadProgress } from '@hooks/commands/useUploadProgress';
import { useAppDispatch, useAppSelector, useRouterWithLoader } from '@hooks/common';
import { useDraftPostQuery } from '@hooks/queries/usePostQuery';
import { useAuth } from '@hooks/User/useAuth';
import type { ListPost } from '@model/post';
import DraftPostItem from '@molecules/DraftPostItem';
import { FileProgressItem, OverallProgress } from '@molecules/UploadProgress';
import ErrorHandler from '@organisms/ErrorHandler';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { selectUserInfo } from '@redux/Features/User/userSlice';
import postService from '@services/postService';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function DraftPostPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const routerWithLoader = useRouterWithLoader();
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAuth();
  const [page, setPage] = useState(1);
  const [postId, setPostId] = useState<number | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());
  const pageSize = 10;
  const {userInfo} = useAppSelector(selectUserInfo);

  

  // URL 파라미터에서 postId 가져오기
  useEffect(() => {
    const postIdParam = searchParams.get('postId');
    if (postIdParam) {
      setPostId(parseInt(postIdParam, 10));
    } else {
      setPostId(null);
    }
  }, [searchParams]);

  // draft 게시글 목록 가져오기 (5초마다 폴링)
  const { data, isLoading, error, refetch } = useDraftPostQuery(
    {
      page,
      pageSize,
      sortBy: 'latest',
      writerId: Number(userInfo?.user_id) || -1,
    },
    { 
      enabled: isLoggedIn && !postId,
      enablePolling: isLoggedIn && !postId // 로그인 상태이고 목록 보기 모드일 때만 폴링
    }
  );

  console.log(`draft data`, data);
  
  // 업로드 진행상황 추적 (특정 postId가 있는 경우)
  const {
    files,
    overallProgress,
    isUploading,
    hasCompleted,
    hasErrors,
    startPolling,
  } = useUploadProgress(postId || undefined);
  
  // 컴포너트 마운트시 폴링 시작
  useEffect(() => {
    if (postId) {
      startPolling();
    }
  }, [startPolling, postId]);
  
  // 업로드 완료 시 게시글 발행
  useEffect(() => {
    if (hasCompleted && postId) {
      const publishPost = async () => {
        try {
          await postService.publishPost(postId);
          dispatch(
            showToast({
              title: '게시글 발행 완료',
              content: '모든 파일 업로드가 완료되어 게시글이 발행되었습니다!',
              headerTextColor: 'text-green-500',
            })
          );
          
          // 게시판 목록으로 이동
          setTimeout(() => {
            routerWithLoader.replace('/');
          }, 2000);
        } catch (error) {
          console.error('게시글 발행 실패:', error);
          dispatch(
            showToast({
              title: '게시글 발행 실패',
              content: '파일 업로드는 완료되었지만 게시글 발행에 실패했습니다.',
              headerTextColor: 'text-orange-500',
            })
          );
        }
      };
      
      publishPost();
    }
  }, [hasCompleted, postId, routerWithLoader, dispatch]);
  
  // 에러 발생 시 처리
  useEffect(() => {
    if (hasErrors && postId) {
      dispatch(
        showToast({
          title: '업로드 오류',
          content: '일부 파일 업로드에 실패했습니다. 게시글을 수정해서 다시 시도해주세요.',
          headerTextColor: 'text-red-500',
        })
      );
    }
  }, [hasErrors, dispatch, postId]);

  // 로그인하지 않은 경우
  if (!isLoggedIn) {
    return <ErrorHandler message="로그인이 필요한 서비스입니다." />;
  }

  // 에러 발생 시
  if (error) {
    return <ErrorHandler message="업로드중인 게시글을 불러오는 중 오류가 발생했습니다." />;
  }

  const draftPosts = data?.data?.items || [];
  const totalCount = data?.data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // 게시글 삭제 핸들러
  const handleDeletePost = async (deletePostId: number) => {
    if (!confirm('이 업로드중인 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      // 게시글 삭제 API 호출 (postService에 구현 필요)
      console.log('삭제할 게시글 ID:', deletePostId);
      dispatch(
        showToast({
          title: '게시글 삭제',
          content: '업로드중인 게시글이 삭제되었습니다.',
          headerTextColor: 'text-green-500',
          remainTime: 'now',
        })
      );
      refetch(); // 목록 새로고침
    } catch (error) {
      dispatch(
        showToast({
          title: '삭제 실패',
          content: '게시글 삭제 중 오류가 발생했습니다.',
          headerTextColor: 'text-red-500',
          remainTime: 'now',
        })
      );
    }
  };
  
  // 목록으로 돌아가기
  const handleBackToList = () => {
    router.push('/me/post/draft');
  };
  
  // 게시글 펴침/접힘 토글
  const toggleExpanded = (postId: number) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // 게시글 편집 핸들러
  const handleEditPost = (post: ListPost) => {
    // 게시글 편집 페이지로 이동
    router.push(`/board/${post.board_id}/post/write?edit=${post.id}`);
  };

  // 업로드 진행상황 확인 핸들러
  const handleViewProgress = (viewPostId: number) => {
    router.push(`/me/post/draft?postId=${viewPostId}`);
  };

  // 특정 postId의 업로드 진행상황을 보여주는 경우
  if (postId) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={handleBackToList}
          className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Draft 목록으로 돌아가기
        </button>
        
        {/* 전체 헤더 */}
        <OverallProgress
          title="게시글 업로드"
          progress={overallProgress}
          isUploading={isUploading}
          hasCompleted={hasCompleted}
          hasErrors={hasErrors}
        />

        {/* 구분선 */}
        <div className="border-t border-dashed border-gray-300" />

        {/* 파일 목록 */}
        <div className="space-y-4">
          {files.map((file, index) => (
            <FileProgressItem key={file.uuid || index} file={file} />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container bg-white rounded-2xl shadow-custom border border-border-default p-5">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">업로드중인 게시글</h1>
        <p className="text-gray-600">
          첨부파일 업로드가 진행 중인 게시글 목록입니다. 업로드 완료 후 자동으로 게시됩니다.
        </p>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">업로드중인 게시글을 불러오는 중...</span>
        </div>
      )}

      {/* Draft 게시글 목록 */}
      {!isLoading && (
        <>
          {draftPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 text-lg mb-4">📝</div>
              <p className="text-gray-600 mb-4">업로드중인 게시글이 없습니다.</p>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                게시판으로 이동
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {draftPosts.map((post) => (
                <DraftPostItem
                  key={post.id}
                  post={post}
                  isExpanded={expandedPosts.has(post.id)}
                  onToggleExpanded={toggleExpanded}
                  onEdit={handleEditPost}
                  onViewProgress={handleViewProgress}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                이전
              </button>
              
              <div className="flex gap-1">
                {(() => {
                  // 페이지 번호 배열 생성 (중복 제거)
                  const startPage = Math.max(1, page - 2);
                  const endPage = Math.min(totalPages, startPage + 4);
                  const adjustedStartPage = Math.max(1, endPage - 4);
                  
                  const pageNumbers = [];
                  for (let i = adjustedStartPage; i <= endPage; i++) {
                    pageNumbers.push(i);
                  }
                  
                  return pageNumbers.map((pageNum) => (
                    <button
                      key={`page-${pageNum}`}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 rounded-lg ${
                        page === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ));
                })()}
              </div>
              
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                다음
              </button>
            </div>
          )}

          {/* 총 개수 표시 */}
          <div className="text-center text-sm text-gray-500 mt-4">
            총 {totalCount}개의 업로드중인 게시글
          </div>
        </>
      )}
    </div>
  );
}