import { useCommentCommand } from '@hooks/commands/useCommentCommand';
import { useReportCommand } from '@hooks/commands/useReportCommand';
import { useAppDispatch } from '@hooks/common';
import { useGlobalPopup } from '@hooks/common/useGlobalPopup';
import { useCommentQuery } from '@hooks/queries/useCommentQuery';
import type { Comment, CommentActions, CommentSectionState } from '@model/comment';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { refreshMyInfo } from '@redux/Features/User/userSlice';
import boardService from '@services/boardService';
import userService from '@services/userService';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

interface UseCommentSectionProps {
  postId: number;
  boardId: number;
  initialComments?: Comment[];
  totalCommentCount?: number;
  forbiddenWords?: string[];
  isLoggedIn: boolean;
}

export function useCommentSection({
  postId,
  boardId,
  initialComments = [],
  totalCommentCount = 0,
  forbiddenWords = [],
  isLoggedIn,
}: UseCommentSectionProps) {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { error } = useGlobalPopup();
  const { createComment } = useCommentCommand();
  const { reportComment } = useReportCommand();

  // 상수 정의
  const COMMENTS_PER_PAGE = 10;

  // 상태 관리
  const [state, setState] = useState<CommentSectionState>({
    commentList: initialComments,
    commentListPage: 1,
    totalCommentPages: Math.ceil(totalCommentCount / COMMENTS_PER_PAGE),
    comment: '',
    isLoading: false,
  });

  // 댓글 ref 저장용
  const commentRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // URL에서 하이라이트할 댓글 ID 가져오기
  const highlightedCommentId = useMemo(() => {
    const commentId = searchParams.get('comment-id');
    return commentId ? parseInt(commentId, 10) : null;
  }, [searchParams]);

  // 댓글 데이터 쿼리 - 서버 데이터 최적화: 첫 페이지에서 초기 댓글이 있으면 쿼리 비활성화
  const {
    data: commentData,
    refetch: refetchComment,
    isError: isCommentError,
    error: commentError,
  } = useCommentQuery(
    {
      postId: postId,
      page: state.commentListPage,
      pageSize: COMMENTS_PER_PAGE,
    },
    { 
      enabled: !!postId && (
        state.commentListPage > 1 || // 2페이지 이상에서는 항상 활성화
        (state.commentListPage === 1 && initialComments.length === 0) // 1페이지에서는 초기 데이터가 없을 때만 활성화
      )
    }
  );

  // 서버에서 받아온 댓글 목록으로 초기 상태 설정 (1페이지일 때만)
  useEffect(() => {
    if (initialComments && initialComments.length > 0 && state.commentListPage === 1) {
      setState(prev => ({
        ...prev,
        commentList: initialComments,
      }));
    }
  }, [initialComments, state.commentListPage]);

  // 댓글 데이터 업데이트
  useEffect(() => {
    // console.log('[useCommentSection] commentData 업데이트:', {
    //   page: state.commentListPage,
    //   hasData: !!commentData?.data?.items,
    //   itemsLength: commentData?.data?.items?.length || 0,
    //   totalCount: commentData?.data?.totalCount || 0,
    // });

    if (commentData?.data?.items) {
      setState(prev => ({
        ...prev,
        commentList: commentData.data.items,
        totalCommentPages: Math.ceil((commentData.data.totalCount || 0) / COMMENTS_PER_PAGE),
      }));
    }
  }, [commentData, state.commentListPage]);

  // 댓글 페이지 변경 처리 - React Query가 자동으로 refetch하므로 별도 refetch 불필요
  // useEffect(() => {
  //   if (state.commentListPage > 1) {
  //     refetchComment();
  //   }
  // }, [state.commentListPage, refetchComment]);

  // 댓글 로딩 중 오류 처리
  useEffect(() => {
    if (isCommentError) {
      dispatch(
        showToast({
          title: '댓글 로딩 중 오류 발생',
          content: (commentError as any).message,
          headerTextColor: 'text-red-500',
          remainTime: '방금',
        })
      );
      console.error('댓글 로딩 중 오류 발생:', commentError);
    }
  }, [isCommentError, commentError, dispatch]);

  // 하이라이트된 댓글로 스크롤 이동
  useEffect(() => {
    if (highlightedCommentId && state.commentList.length > 0) {
      const commentElement = commentRefs.current[highlightedCommentId];
      if (commentElement) {
        setTimeout(() => {
          commentElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }, 100);
      }
    }
  }, [highlightedCommentId, state.commentList]);

  // 댓글 작성 핸들러
  const handleSubmitComment = async () => {
    if (!state.comment.trim()) {
      error('댓글을 작성해주세요.');
      return;
    }

    // 금지 단어 체크
    const forbiddenWordsCheck = forbiddenWords.filter(word =>
      state.comment.includes(word)
    );

    if (forbiddenWordsCheck.length > 0) {
      const forbiddenWordsList = forbiddenWordsCheck
        .map(word => `"${word}"`)
        .join(', ');
      error(
        `댓글에 다음 금지 단어가 포함되어 있습니다:\n\n${forbiddenWordsList}\n\n해당 단어를 제거한 후 다시 시도해주세요.`,
        '금지 단어 감지'
      );
      return;
    }

    // 권한 체크
    const userInfo = await userService.getMyInfo();
    const userLevel =
      typeof userInfo.data === 'object' ? userInfo.data?.level || 0 : 0;
    const boardInfo = await boardService.getBoard(boardId);
    const commentLevel =
      typeof boardInfo?.data === 'object'
        ? (boardInfo?.data?.permissionSettings as any)?.comment_level || 0
        : 0;

    if (userLevel < commentLevel) {
      dispatch(
        showToast({
          show: true,
          title: '댓글 작성 권한이 없습니다.',
          content: '댓글 작성 권한이 없습니다.',
        })
      );
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await createComment(state.comment, postId);
      if (response.successOrNot === 'Y') {
        dispatch(refreshMyInfo());
        setState(prev => ({ ...prev, comment: '' }));
        refetchComment();
      } else {
        dispatch(
          showToast({
            title: '댓글 작성 실패',
            content: response?.message as string,
            headerTextColor: 'text-red-500',
            remainTime: '방금',
          })
        );
        console.error('댓글 작성 오류:', response?.data);
      }
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // 댓글 신고 핸들러
  const handleReport = async (
    targetId: number,
    reasonId: string,
    description: string,
    targetType?: string
  ) => {
    const type = targetType || 'comment';
    const response = await reportComment(targetId, reasonId, description, type);
    
    if (response.successOrNot === 'Y') {
      dispatch(
        showToast({
          show: true,
          title: '신고 성공',
          content: '신고처리 되었습니다.',
          headerTextColor: 'text-green-500',
          remainTime: '방금',
        })
      );
    } else {
      dispatch(
        showToast({
          show: true,
          title: '신고 실패',
          content: response.message as string,
          headerTextColor: 'text-red-500',
          remainTime: '방금',
        })
      );
    }
  };

  // 액션 함수들
  const actions: CommentActions = {
    handleSubmitComment,
    handleReport,
    setComment: (value: string) =>
      setState(prev => ({ ...prev, comment: value })),
    setCommentListPage: (page: number) => {
      setState(prev => ({ ...prev, commentListPage: page }));
    },
    refetchComments: refetchComment,
  };

  return {
    state,
    actions,
    commentRefs,
    highlightedCommentId,
  };
} 