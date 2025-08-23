import { useAuth } from '@hooks/User/useAuth';
import { usePostCommand } from '@hooks/commands/usePostCommand';
import {
  useAppDispatch,
  useAppSelector,
  useRouterWithLoader,
} from '@hooks/common';
import { usePermission } from '@hooks/common/usePermission';
import type { PostDetail } from '../../types/post';
import { setEditMode } from '@redux/Features/Post/postSlice';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { selectUserInfo } from '@redux/Features/User/userSlice';
import { useState } from 'react';

interface UsePostDetailProps {
  post: PostDetail;
}

export function usePostDetail({
  post,
}: UsePostDetailProps) {
  const dispatch = useAppDispatch();
  const router = useRouterWithLoader();
  const { checkPermission } = usePermission();
  const { isLoggedIn, userInfo } = useAppSelector(selectUserInfo);
  const { isAdmin } = useAuth();

  const {
    reactionPost,
    deletePost,
  } = usePostCommand();

  // 게시글 상세 페이지의 핵심 상태 관리 (비즈니스 로직만)
  const [likeCount, setLikeCount] = useState<number>(post.like_count);

  // 게시글의 권한 설정 확인
  const { permission_settings, point_settings } = post;
  const canRead = checkPermission(permission_settings?.readLevel || 0);

  // 내 게시물인지 확인 
  const isMyPost = Number(userInfo?.user_id) === post.writer_id;

  // 반응 핸들러 (좋아요)
  const handleReaction = async (reactionType: 'like' | 'dislike') => {
    const response = await reactionPost(post.id, reactionType);
    if (response.successOrNot === 'Y') {
      if (reactionType === 'like') {
        setLikeCount(prev => prev + 1);
      }

      dispatch(
        showToast({
          title: '추천 성공',
          content: '추천되었습니다.',
          headerTextColor: 'text-green-500',
          remainTime: '방금',
        })
      );
    } else {
      dispatch(
        showToast({
          show: true,
          title: '추천 실패',
          content: response?.message || '추천 처리 중 오류가 발생했습니다.',
          headerTextColor: 'text-red-500',
          remainTime: '방금',
        })
      );
    }
  };

  // 게시글 삭제 핸들러
  const handleDelete = async () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const response = await deletePost(post.id);
      if (response.successOrNot === 'Y') {
        dispatch(
          showToast({
            show: true,
            title: '게시글 삭제 성공',
            content: '게시글이 삭제되었습니다.',
            headerTextColor: 'text-green-500',
            remainTime: '방금',
          })
        );
        router.back();
      } else {
        dispatch(
          showToast({
            show: true,
            title: '게시글 삭제 실패',
            content: (response as any).error,
            headerTextColor: 'text-red-500',
            remainTime: '방금',
          })
        );
      }
    }
  };

  // 게시글 수정 핸들러
  const handleEdit = () => {
    dispatch(setEditMode(post));
    router.push(`/post?boardId=${post.board_id}`);
  };

  // 게시글 저장 핸들러 (텍스트 파일로 저장)
  const handleSave = () => {
    const content = `제목: ${post.title}\n\n내용:\n${post.content}`;

    // Blob 생성
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

    // 다운로드 링크 생성
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${post.title}.txt`;

    // 다운로드 실행
    document.body.appendChild(link);
    link.click();

    // 정리
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // 성공 메시지 표시
    dispatch(
      showToast({
        show: true,
        title: '저장 성공',
        content: '게시글이 텍스트 파일로 저장되었습니다.',
        headerTextColor: 'text-green-500',
        remainTime: '방금',
      })
    );
  };

  // 게시물 권한 설정
  const postPermissions = {
    canEdit: isMyPost || isAdmin(),
    canDelete: isMyPost || isAdmin(),
    canSave: true,
    canReport: !isMyPost,
  };

  // 권한 체크 결과
  const hasEnoughPoints =
    !point_settings?.readPost ||
    (userInfo?.point || 0) >= (point_settings.readPost || 0);

  return {
    // 추천 관련
    likeCount,
    
    // 권한 및 사용자 정보
    canRead,
    hasEnoughPoints,
    isLoggedIn,
    
    // 게시글 관련
    permission_settings: post.permission_settings,
    
    // 핸들러 (비즈니스 로직)
    handleReaction,
    handleDelete,
    handleEdit,
    handleSave,
    
    // 권한 정보
    postPermissions,
  };
} 