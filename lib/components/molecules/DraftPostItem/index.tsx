'use client';

import { useAppSelector } from '@hooks/common';
import type { Board } from '../../../types/board';
import type { ListPost } from '../../../types/post';
import { timeAgo } from '@util/dateUtil';

interface DraftPostItemProps {
  post: ListPost;
  isExpanded: boolean;
  onToggleExpanded: (postId: number) => void;
  onEdit: (post: ListPost) => void;
  onViewProgress: (postId: number) => void;
  onDelete: (postId: number) => void;
}

export default function DraftPostItem({
  post,
  isExpanded,
  onToggleExpanded,
  onEdit,
  onViewProgress,
  onDelete,
}: DraftPostItemProps) {
  // Redux에서 게시판 목록 가져오기
  const boards = useAppSelector((state) => state.board.boards);
  
  // board_id로 게시판명 찾기
  const getBoardName = (boardId: number): string => {
    const board = boards.find((board: Board) => board.id === boardId);
    return board?.name || `게시판 ${boardId}`;
  };

  // 전체 진행도 계산
  const calculateProgress = (): number => {
    if (!post.attachments || post.attachments.length === 0) return 0;
    const uploadedCount = post.attachments.filter(attachment => attachment.status === 'uploaded').length;
    return Math.round((uploadedCount / post.attachments.length) * 100);
  };
  return (
    <div className="bg-gray-50 border border-gray-300 rounded-lg overflow-hidden transition-all duration-200">
      {/* 기본 정보 표시 영역 */}
      <div className="p-4">
        {/* 첫 번째 row: 게시판명 + 제목 + timeAgo */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="px-3 py-1 bg-gray-600 text-white text-xs font-semibold rounded-full">
              {getBoardName(post.board_id || 0)}
            </span>
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 flex-1">
              {post.title}
            </h3>
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
            {timeAgo(post.created_at || '')}
          </span>
        </div>
        
        {/* 두 번째 row: 파일 상태 표시 + 간략한 내용 + collapse 버튼 */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {/* 파일 업로드 상태 표시 (동적 개수) */}
            {post.attachments && post.attachments.length > 0 ? (
              <div className="mb-3">
                <div className="flex gap-1 mb-2 flex-wrap">
                  {post.attachments.map((attachment, index) => {
                    let bgColor = 'bg-slate-200 border-slate-300'; // 기본 회색 (pending)
                    
                    // status에 따라 색상 결정
                    switch (attachment.status) {
                      case 'uploaded':
                        bgColor = 'bg-green-500 border-green-600'; // 완료 - 초록색
                        break;
                      case 'watermarking':
                      case 'uploading':
                        bgColor = 'bg-yellow-400 border-yellow-500'; // 진행중 - 노란색
                        break;
                      case 'pending':
                      default:
                        bgColor = 'bg-slate-200 border-slate-300'; // 대기중 - 회색
                        break;
                    }

                    return (
                      <div
                        key={`attachment-square-${attachment.uuid || `${post.id}-${index}`}`}
                        className={`w-4 h-4 rounded border transition-all duration-200 ${bgColor}`}
                        title={`${attachment.fileName} - ${attachment.status || 'pending'}`}
                      />
                    );
                  })}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {post.attachments.length}개 파일
                </div>
                

              </div>
            ) : null}
          </div>
          
          {/* collapse 버튼 */}
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => onToggleExpanded(post.id)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
              title={isExpanded ? '접기' : '펼치기'}
            >
              <svg 
                className={`w-5 h-5 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* 세 번째 row: 전체 진행도 progress bar (첨부파일이 있는 경우만) */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="mt-3">
            <div className="relative w-full bg-gray-200 rounded-full h-6">
              <div
                className={`h-6 rounded-full transition-all duration-300 ${
                  calculateProgress() === 100
                    ? 'bg-green-500'
                    : calculateProgress() > 0
                    ? 'bg-yellow-400'
                    : 'bg-gray-300'
                }`}
                style={{ width: `${calculateProgress()}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-800">
                  {calculateProgress()}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 확장 정보 영역 (펼침 상태에서만 표시) */}
      {isExpanded && (
        <div className="border-t border-gray-300 bg-white">
          <div className="p-4">
            {/* 상세 내용 */}
            {post.content && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">내용 미리보기</h4>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 max-h-40 overflow-y-auto">
                  {post.content.replace(/[#*`\[\]]/g, '').substring(0, 500)}
                  {post.content.length > 500 && '...'}
                </div>
              </div>
            )}
            
            {/* 첨부파일 상세 진행 정보 */}
            {post.attachments && post.attachments.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">첨부파일 진행 상황</h4>
                <div className="flex flex-col gap-2">
                  {post.attachments.map((attachment, index) => {
                    // 파일 타입 확인 (이미지/비디오)
                    const isImage = attachment.fileType?.startsWith('image/') || false;
                    const isVideo = attachment.fileType?.startsWith('video/') || false;
                    
                    // 상태별 텍스트
                    const getStatusText = (status?: string) => {
                      switch (status) {
                        case 'uploaded': return '완료';
                        case 'uploading': return '업로드 중';
                        case 'watermarking': return '워터마크 처리 중';
                        case 'pending': return '대기 중';
                        case 'failed': return '실패';
                        default: return '처리 중';
                      }
                    };
                    
                    // 개별 파일 진행률 (DB의 progress 값 우선 사용)
                    const getFileProgress = (): number => {
                      // DB의 progress 값이 있으면 우선 사용
                      if (attachment.progress !== undefined && attachment.progress !== null) {
                        return Math.max(0, Math.min(100, attachment.progress));
                      }
                      
                      // progress 값이 없는 경우 상태 기반 fallback
                      switch (attachment.status) {
                        case 'uploaded': return 100;
                        case 'uploading': return 75;
                        case 'watermarking': return 50;
                        case 'pending': return 0;
                        case 'failed': return 0;
                        default: return 0;
                      }
                    };


                    return (
                      <div key={`attachment-detail-${attachment.uuid || `${post.id}-${index}`}`} className="flex gap-3 p-3 bg-gray-200 rounded-lg">
                        {/* 좌측: 파일 타입 아이콘 */}
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100`}>
                          {isImage ? (
                            <img 
                              src="/icons/image-icon.svg" 
                              alt="이미지" 
                              className="w-8 h-8"
                            />
                          ) : isVideo ? (
                            <img 
                              src="/icons/video-icon.svg" 
                              alt="비디오" 
                              className="w-8 h-8"
                            />
                          ) : (
                            <img 
                              src="/icons/file-icon.svg" 
                              alt="파일" 
                              className="w-8 h-8"
                            />
                          )}
                        </div>
                        
                        {/* 우측: 파일 정보 */}
                        <div className="flex-1 min-w-0">
                          {/* 1행: 파일명 + 상태 배지 + 파일정보 */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-gray-900 text-sm font-medium truncate flex-1">
                              {attachment.fileName}
                            </span>
                            {/* 상태 배지 */}
                            {attachment.status && (
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${

                                attachment.status === 'uploading' 
                                  ? 'bg-blue-100 text-blue-700'
                                  : attachment.status === 'watermarking'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : attachment.status === 'failed'
                                  ? 'bg-red-100 text-red-700'
                                  : attachment.status === 'uploaded'
                                  ? 'bg-green-100 text-green-700'
                                  : attachment.status === 'pending'
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {getStatusText(attachment.status)}
                              </span>
                            )}
                            <span className="text-gray-500 text-xs whitespace-nowrap">
                              {attachment.fileType || 'unknown'}
                            </span>
                            <span className="text-gray-500 text-xs whitespace-nowrap">
                              {attachment.fileSize ? `${(attachment.fileSize / 1024 / 1024).toFixed(1)}MB` : '크기 미상'}
                            </span>
                          </div>
                          
                          {/* 3행: 진행률 바 (두 줄로 표시) */}
                          <div className="space-y-1">
                            {/* 워터마킹 진행률 바 */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-600 w-16">워터마킹:</span>
                              <div className="relative flex-1 bg-gray-300 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    attachment.status === 'uploaded' || attachment.status === 'uploading'
                                      ? 'bg-green-500'
                                      : attachment.status === 'watermarking'
                                      ? 'bg-yellow-500'
                                      : 'bg-gray-400'
                                  }`}
                                  style={{ 
                                    width: `${
                                      attachment.status === 'uploaded' || attachment.status === 'uploading'
                                        ? 100
                                        : attachment.status === 'watermarking'
                                        ? getFileProgress()
                                        : 0
                                    }%` 
                                  }} 
                                />
                              </div>
                              <span className="text-xs text-gray-600 w-8">
                                {attachment.status === 'uploaded' || attachment.status === 'uploading'
                                  ? '완료'
                                  : attachment.status === 'watermarking'
                                  ? `${getFileProgress()}%`
                                  : '대기'}
                              </span>
                            </div>
                            
                            {/* 업로딩 진행률 바 */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-600 w-16">업로딩:</span>
                              <div className="relative flex-1 bg-gray-300 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    attachment.status === 'uploaded'
                                      ? 'bg-green-500'
                                      : attachment.status === 'uploading'
                                      ? 'bg-blue-500'
                                      : 'bg-gray-400'
                                  }`}
                                  style={{ 
                                    width: `${
                                      attachment.status === 'uploaded'
                                        ? 100
                                        : attachment.status === 'uploading'
                                        ? getFileProgress()
                                        : 0
                                    }%` 
                                  }} 
                                />
                              </div>
                              <span className="text-xs text-gray-600 w-8">
                                {attachment.status === 'uploaded'
                                  ? '완료'
                                  : attachment.status === 'uploading'
                                  ? `${getFileProgress()}%`
                                  : '대기'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}