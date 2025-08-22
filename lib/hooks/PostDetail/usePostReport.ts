import { useReportCommand } from '@hooks/commands/useReportCommand';
import { useAppDispatch } from '@hooks/common';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { useState } from 'react';

interface UsePostReportProps {
  postId: number;
  writerId: number;
}

export function usePostReport({ postId, writerId }: UsePostReportProps) {
  const dispatch = useAppDispatch();
  const { reportComment } = useReportCommand();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleReport = async (
    targetId: number,
    reasonId: string,
    description: string,
    targetType?: string
  ) => {
    const type = targetType || 'post';
    const response = await reportComment(
      targetId,
      reasonId,
      description,
      type
    );
    
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
          content: (response as any).data,
          headerTextColor: 'text-red-500',
          remainTime: '방금',
        })
      );
    }
  };

  const openReportModal = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);

  const handleReportSubmit = (
    targetId: number,
    reasonId: string,
    description: string,
    targetType?: string
  ) => {
    if (reasonId === '') {
      alert('신고 사유를 선택해주세요.');
      return;
    }
    if (description === '') {
      alert('신고 상세내용을 입력해주세요.');
      return;
    }
    
    handleReport(targetId, reasonId, description, targetType);
    closeReportModal();
  };

  return {
    isReportModalOpen,
    openReportModal,
    closeReportModal,
    handleReportSubmit,
    postId,
    writerId,
  };
} 