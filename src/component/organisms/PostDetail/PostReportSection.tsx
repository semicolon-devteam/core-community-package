import { usePostReport } from '@hooks/PostDetail/usePostReport';
import ReportModal from '@organisms/ReportModal';

interface PostReportSectionProps {
  postId: number;
  writerId: number;
  onReportClick: () => void;
}

export function PostReportSection({ 
  postId, 
  writerId, 
  onReportClick 
}: PostReportSectionProps) {
  const {
    isReportModalOpen,
    closeReportModal,
    handleReportSubmit,
  } = usePostReport({ postId, writerId });

  return (
    <ReportModal
      isOpen={isReportModalOpen}
      onClose={closeReportModal}
      onSubmit={(commentId, reasonId, description, writerId) => {
        handleReportSubmit(commentId, reasonId, description, 'post');
      }}
      commentId={postId}
      writerId={writerId}
    />
  );
} 