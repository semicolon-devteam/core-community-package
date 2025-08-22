import { Skeleton } from '@atoms/Skeleton';
import { useAppDispatch, useAppSelector } from '@hooks/common';
import { usePermission } from '@hooks/common/usePermission';
import { useCommentSection } from '@hooks/PostDetail/useCommentSection';
import type { Comment, CommentFormProps } from '@model/comment';
import Board from '@molecules/Board';
import CommentItem from '@organisms/CommentItem';
import ReportModal from '@organisms/ReportModal';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { selectUserInfo } from '@redux/Features/User/userSlice';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

// 메모이제이션된 CommentForm 컴포넌트
const CommentForm = React.memo(
  ({
    isLoggedIn,
    canComment,
    comment,
    setComment,
    onSubmit,
  }: CommentFormProps) => {
    return (
      <div className="w-full h-20 sm:h-24 mt-4 bg-white rounded-2xl shadow-custom outline outline-1 outline-offset-[-1px] outline-zinc-200 overflow-hidden flex justify-center items-center">
        {isLoggedIn ? (
          canComment ? (
            <div className="flex gap-2 flex-row w-full h-full p-2 rounded-lg border border-zinc-200">
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="w-full h-full p-2 rounded-lg border border-zinc-200 text-neutral-900 text-xs sm:text-sm font-normal font-nexon leading-normal"
                placeholder="댓글을 작성해주세요."
              />
              <button
                onClick={onSubmit}
                className="w-40 h-full p-2 rounded-lg border border-zinc-200 text-neutral-900 text-xs sm:text-sm font-normal font-nexon leading-normal"
                disabled={!comment.trim()}
              >
                등록
              </button>
            </div>
          ) : (
            <span className="text-neutral-600 text-sm font-normal font-nexon leading-normal">
              댓글 작성 권한이 없습니다.
            </span>
          )
        ) : (
          <span className="text-neutral-600 text-sm font-normal font-nexon leading-normal">
            로그인 후 댓글을 작성할 수 있습니다.
          </span>
        )}
      </div>
    );
  }
);

CommentForm.displayName = 'CommentForm';

interface CommentSectionProps {
  postId: number;
  boardId: number;
  initialComments?: Comment[];
  totalCommentCount?: number;
  forbiddenWords?: string[];
  permissionSettings?: {
    readLevel?: number;
    writeLevel?: number;
    commentLevel?: number;
  };
  onCommentUpdate?: () => void;
}

export default function CommentSection({
  postId,
  boardId,
  initialComments = [],
  totalCommentCount = 0,
  forbiddenWords = [],
  permissionSettings,
  onCommentUpdate,
}: CommentSectionProps) {
  const searchParams = useSearchParams();
  const highlightedCommentId = searchParams.get('comment-id') ? Number(searchParams.get('comment-id')) : null;
  
  const dispatch = useAppDispatch();
  const { checkPermission } = usePermission();
  const { isLoggedIn } = useAppSelector(selectUserInfo);

  // 권한 체크
  const canComment = checkPermission(permissionSettings?.commentLevel || 0);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetId, setReportTargetId] = useState<number>(0);
  const [reportWriterId, setReportWriterId] = useState<number>(0);

  // 댓글 관련 로직을 커스텀 훅으로 분리
  const { state, actions, commentRefs } = useCommentSection({
    postId,
    boardId,
    initialComments,
    totalCommentCount,
    forbiddenWords,
    isLoggedIn,
  });

  const handleReportSubmit = async (
    targetId: number,
    reasonId: string,
    description: string,
    targetType?: string
  ) => {
    if (reasonId === '') {
      dispatch(showToast({
        title: '신고 실패',
        content: '신고 사유를 선택해주세요.',
        show: true,
        headerTextColor: 'text-red-500',
        remainTime: '방금',
      }));
      return;
    }
    if (description === '') {
      dispatch(showToast({
        title: '신고 실패',
        content: '신고 상세내용을 입력해주세요.',
        show: true,
        headerTextColor: 'text-red-500',
        remainTime: '방금',
      }));
      return;
    }

    await actions.handleReport(targetId, reasonId, description, targetType);
    setIsReportModalOpen(false);
    
    // 댓글 업데이트 콜백 호출
    if (onCommentUpdate) {
      onCommentUpdate();
    }
  };

  const hasData = state.commentList && state.commentList.length > 0;
  const isFetchingComments = (state as any).isCommentFetching ?? (state as any).isFetching ?? false;
  const showSkeleton = isFetchingComments && hasData;
  const pageSize = (state as any).commentPageSize ?? (state as any).pageSize ?? 10;
  const skeletonCount = hasData ? state.commentList.length : pageSize;

  return (
    <>
      {/* 댓글 섹션 */}
      <div className="w-full bg-white rounded-2xl shadow-custom outline outline-1 outline-offset-[-1px] outline-zinc-200 overflow-hidden p-4 sm:p-5">
        {/* 댓글 헤더 */}
        <div className="w-full flex flex-col gap-5 mb-4">
          <h2 className="text-center sm:text-left text-neutral-900 text-base sm:text-lg font-medium font-nexon">
            댓글
          </h2>
          <div className="w-full h-0 outline outline-2 outline-offset-[-1px] outline-neutral-900"></div>
        </div>

        {/* 댓글 목록 */}
        <div className="w-full flex flex-col gap-2">
          {showSkeleton ? (
            Array(skeletonCount)
              .fill(0)
              .map((_, i) => (
                <div key={`comment-skel-${i}`} className="w-full pb-5 border-b border-zinc-200 flex flex-col gap-4">
                  <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-6 h-6 rounded-full" />
                      <Skeleton className="w-6 h-6" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-6 h-6" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-5/6" />
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))
          ) : hasData ? (
            state.commentList.map((comment: Comment) => (
              <CommentItem
                key={comment.id}
                ref={el => {
                  if (el) commentRefs.current[comment.id] = el;
                }}
                comment={comment}
                isHighlighted={highlightedCommentId === comment.id}
                onReport={actions.handleReport}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              등록된 댓글이 없습니다.
            </p>
          )}
        </div>

        {/* 댓글 페이지네이션 */}
        {hasData && (
          <div className="w-full flex justify-center mt-6">
            <Board.Pagination
              currentPage={state.commentListPage}
              totalPages={state.totalCommentPages}
              onPageChange={actions.setCommentListPage}
            />
          </div>
        )}
      </div>

      {/* 댓글 작성 영역 */}
      <CommentForm
        isLoggedIn={isLoggedIn}
        canComment={canComment}
        comment={state.comment}
        setComment={actions.setComment}
        onSubmit={actions.handleSubmitComment}
      />

      {/* 신고 모달 */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={(commentId, reasonId, description) => 
          handleReportSubmit(commentId, reasonId, description, 'comment')
        }
        commentId={reportTargetId}
        writerId={reportWriterId}
      />
    </>
  );
} 