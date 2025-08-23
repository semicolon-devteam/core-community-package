import type { FileAttachment } from '../../../types/post';

interface ProgressBarProps {
  progress: number;
  label: string;
  variant?: 'default' | 'success' | 'error';
  className?: string;
}

const ProgressBar = ({ progress, label, variant = 'default', className = '' }: ProgressBarProps) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-400';
      case 'error':
        return 'bg-red-400';
      default:
        return 'bg-yellow-400';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-gray-200 rounded-lg h-7 relative overflow-hidden">
        <div
          className={`${getBackgroundColor()} h-full transition-all duration-300 ease-out`}
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-800">{label}</span>
        </div>
      </div>
    </div>
  );
};

interface FileProgressItemProps {
  file: FileAttachment;
}

export const FileProgressItem = ({ file }: FileProgressItemProps) => {
  const isImage = file.fileType.startsWith('image/');
  const isVideo = file.fileType.startsWith('video/');
  
  const formatFileSize = (bytes: number) => {
    return bytes >= 1024 * 1024 
      ? `${Math.round(bytes / (1024 * 1024))}MB`
      : `${Math.round(bytes / 1024)}KB`;
  };

  const getStatusText = () => {
    switch (file.status) {
      case 'uploaded':
        return `완료: ${file.uploadedAt ? formatTimeAgo(file.uploadedAt) : '방금 전'}`;
      case 'uploading':
        return '업로드 중';
      case 'watermarking':
        return '워터마크 생성 중';
      case 'pending':
        return '대기 중';
      case 'failed':
        return file.error || '실패';
      default:
        return '알 수 없음';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const uploadTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - uploadTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours}시간 전`;
  };

  const getStatusColor = () => {
    switch (file.status) {
      case 'uploaded':
        return 'bg-green-100';
      case 'uploading':
      case 'watermarking':
        return 'bg-yellow-100';
      case 'pending':
        return 'bg-gray-100';
      case 'failed':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getStatusBadgeColor = () => {
    switch (file.status) {
      case 'uploaded':
        return 'bg-green-400 text-green-800';
      case 'uploading':
      case 'watermarking':
        return 'bg-yellow-400 text-yellow-800';
      case 'pending':
        return 'bg-gray-400 text-gray-800';
      case 'failed':
        return 'bg-red-400 text-red-800';
      default:
        return 'bg-gray-400 text-gray-800';
    }
  };

  const getProgressVariant = (): 'default' | 'success' | 'error' => {
    if (file.status === 'uploaded') return 'success';
    if (file.status === 'failed') return 'error';
    return 'default';
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
      <div className="flex items-start space-x-4">
        {/* 파일 썸네일/아이콘 */}
        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-medium text-gray-600">
            {isImage ? '이미지' : isVideo ? '비디오' : '파일'}
          </span>
        </div>

        {/* 파일 정보 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {file.fileName}
          </h3>
          
          <div className="mt-2 space-y-2">
            {/* 진행도 바 */}
            <ProgressBar 
              progress={file.progress || 0} 
              label={`${file.progress || 0}%`}
              variant={getProgressVariant()}
            />
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatFileSize(file.fileSize)}</span>
              <span>{getStatusText()}</span>
            </div>
          </div>
        </div>

        {/* 상태 표시 */}
        <div className="flex-shrink-0">
          <div className={`${getStatusBadgeColor()} px-3 py-1 rounded-lg text-sm font-medium`}>
            {file.status === 'uploaded' ? '완료' : 
             file.status === 'failed' ? '실패' : '진행중'}
          </div>
        </div>
      </div>
    </div>
  );
};

interface OverallProgressProps {
  title: string;
  progress: number;
  isUploading: boolean;
  hasCompleted: boolean;
  hasErrors: boolean;
}

export const OverallProgress = ({ 
  title, 
  progress, 
  isUploading, 
  hasCompleted, 
  hasErrors 
}: OverallProgressProps) => {
  const getStatusText = () => {
    if (hasErrors) return '오류';
    if (hasCompleted) return '완료';
    if (isUploading) return '진행중';
    return '대기중';
  };

  const getStatusColor = () => {
    if (hasErrors) return 'bg-red-400 text-red-800';
    if (hasCompleted) return 'bg-green-400 text-green-800';
    if (isUploading) return 'bg-yellow-400 text-yellow-800';
    return 'bg-gray-400 text-gray-800';
  };

  const getProgressVariant = (): 'default' | 'success' | 'error' => {
    if (hasErrors) return 'error';
    if (hasCompleted) return 'success';
    return 'default';
  };

  return (
    <div className="border rounded-lg p-6 bg-white">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>전체 업로드 진행도</span>
          <span className={`${getStatusColor()} px-2 py-1 rounded text-xs font-medium`}>
            {getStatusText()}
          </span>
        </div>
        <ProgressBar 
          progress={progress} 
          label={`${progress}%`}
          variant={getProgressVariant()}
        />
      </div>
    </div>
  );
};