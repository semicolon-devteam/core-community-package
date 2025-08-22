import { useFileDownload } from '@hooks/PostDetail/useFileDownload';
import { usePostCommand } from '@hooks/commands/usePostCommand';
import { useAppDispatch } from '@hooks/common';
import { useGlobalLoader } from '@hooks/common/useGlobalLoader';
import type { FileAttachment } from '@model/post';
import { showToast } from '@redux/Features/Toast/toastSlice';
import fileService from '@services/fileService';
import { useState } from 'react';

interface FileDownloadSectionProps {
  postId: number;
  attachments: FileAttachment[];
  downloadPoint: number;
  fileDownloadExpiredTime?: Date | null;
}

export function FileDownloadSection({
  postId,
  attachments,
  downloadPoint,
  fileDownloadExpiredTime,
}: FileDownloadSectionProps) {
  const dispatch = useAppDispatch();
  const { showLoader, hideLoader } = useGlobalLoader();
  const { downloadFileFromUrl } = usePostCommand();
  
  // 첨부파일 확장 상태를 내부에서 관리
  const [isAttachmentExpanded, setIsAttachmentExpanded] = useState(false);
  
  const {
    isPurchase,
    isFreeDownload,
    timeRemaining,
    handlePurchaseFiles,
  } = useFileDownload({
    postId,
    downloadPoint,
    fileDownloadExpiredTime,
  });

  // 첨부파일 필터링
  const imageAttachments: FileAttachment[] = attachments?.filter(attachment =>
    attachment.fileType.startsWith('image/')
  ) || [];

  const videoAttachments: FileAttachment[] = attachments?.filter(attachment =>
    attachment.fileType.startsWith('video/')
  ) || [];

  // 전체 다운로드 핸들러
  const handleDownloadAll = async () => {
    if (!isPurchase && !isFreeDownload) {
      dispatch(
        showToast({
          show: true,
          title: '구매 필요',
          content: '파일을 다운로드하려면 먼저 구매해주세요.',
          headerTextColor: 'text-orange-500',
          remainTime: '방금',
        })
      );
      return;
    }
    
    showLoader('파일 다운로드 중...');

    let successCount = 0;
    let failCount = 0;

    for (const attachment of attachments) {
      try {
        const response = await downloadFileFromUrl(
          attachment.url,
          attachment.fileName
        );
        if (response.successOrNot === 'Y') {
          successCount++;
        } else {
          failCount++;
        }
        // 각 다운로드 사이에 짧은 딜레이 추가 (브라우저 제한 방지)
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        failCount++;
      }
    }

    hideLoader();
    // 결과 토스트 표시
    if (failCount === 0) {
      dispatch(
        showToast({
          show: true,
          title: '전체 다운로드 완료',
          content: `${successCount}개 파일이 모두 다운로드되었습니다.`,
          headerTextColor: 'text-green-500',
          remainTime: '방금',
        })
      );
    } else if (successCount > 0) {
      dispatch(
        showToast({
          show: true,
          title: '부분 다운로드 완료',
          content: `${successCount}개 성공, ${failCount}개 실패했습니다.`,
          headerTextColor: 'text-orange-500',
          remainTime: '방금',
        })
      );
    } else {
      dispatch(
        showToast({
          show: true,
          title: '전체 다운로드 실패',
          content: '모든 파일 다운로드에 실패했습니다.',
          headerTextColor: 'text-red-500',
          remainTime: '방금',
        })
      );
    }
  };

  // 개별 파일 다운로드 핸들러
  const handleIndividualDownload = async (url: string, fileName: string) => {
    showLoader('파일 다운로드 중...');
    
    // 무료 다운로드가 아니고, 결제이력이 없거나 시간이 만료된 경우 차단
    if (!isFreeDownload && (!isPurchase || !timeRemaining)) {
      dispatch(
        showToast({
          show: true,
          title: '구매 필요',
          content: '파일을 다운로드하려면 먼저 구매해주세요.',
          headerTextColor: 'text-orange-500',
          remainTime: '방금',
        })
      );
      hideLoader();
      return;
    }

    const response = await downloadFileFromUrl(url, fileName);
    hideLoader();
    
    if (response.successOrNot === 'N') {
      dispatch(
        showToast({
          show: true,
          title: '파일 다운로드 실패',
          content: response.message || '파일 다운로드 중 오류가 발생했습니다.',
          headerTextColor: 'text-red-500',
          remainTime: '방금',
        })
      );
    } else {
      dispatch(
        showToast({
          show: true,
          title: '파일 다운로드 성공',
          content: response.message || '파일 다운로드가 완료되었습니다.',
          headerTextColor: 'text-green-500',
          remainTime: '방금',
        })
      );
    }
  };

  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <>
      <div className="w-full h-0 border border-border-default mb-4"></div>

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-neutral-900 text-base sm:text-lg font-medium font-nexon leading-normal">
          첨부파일
        </h2>
      </div>

      {/* 접힌 상태일 때 요약 정보 표시 */}
      <div className="w-full transition-all duration-700 ease-in-out opacity-100 max-h-32 mb-4">
        <div className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between sm:flex-row flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <img
                  src="/icons/file-icon.svg"
                  alt="파일"
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">
                  총 {attachments.length}개 파일
                </span>
              </div>
              {imageAttachments.length > 0 && (
                <div className="flex items-center gap-1">
                  <img
                    src="/icons/image-icon.svg"
                    alt="이미지"
                    className="w-4 h-4"
                  />
                  <span className="text-xs text-gray-600 sm:block hidden">
                    이미지 {imageAttachments.length}개
                  </span>
                </div>
              )}
              {videoAttachments.length > 0 && (
                <div className="flex items-center gap-1">
                  <img
                    src="/icons/video-icon.svg"
                    alt="비디오"
                    className="w-4 h-4"
                  />
                  <span className="text-xs text-gray-600 sm:block hidden">
                    비디오 {videoAttachments.length}개
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600 sm:block hidden">
                  총 용량
                </span>
                <span className="text-xs text-gray-600">
                  {(() => {
                    const totalSize = attachments.reduce(
                      (acc, file) => acc + (file.fileSize || 0),
                      0
                    );
                    if (totalSize >= 1024 * 1024) {
                      return `${(totalSize / (1024 * 1024)).toFixed(1)} MB`;
                    } else if (totalSize >= 1024) {
                      return `${(totalSize / 1024).toFixed(1)} KB`;
                    } else {
                      return `${totalSize} B`;
                    }
                  })()}
                </span>
              </div>
            </div>
          </div>
          {/* 펼치기 버튼 표시: 무료 다운로드이거나, 결제 이력이 있으면서 다운로드 시간이 만료되지 않은 경우 */}
          {(isFreeDownload || (isPurchase && timeRemaining)) ? (
            <div className="flex items-center gap-3">
              {/* 시간 표시는 결제된 경우에만 */}
              {isPurchase && timeRemaining && !isFreeDownload && (
                <div className="w-[110px] flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white justify-between">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">
                    {timeRemaining.hours > 0 ? `${timeRemaining.hours}:` : ''}
                    {String(timeRemaining.minutes).padStart(2, '0')}:
                    {String(timeRemaining.seconds).padStart(2, '0')}
                  </span>
                </div>
              )}
              <button
                onClick={() => setIsAttachmentExpanded(!isAttachmentExpanded)}
                className="flex items-center gap-2 p-1 px-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 group"
                title={isAttachmentExpanded ? '접기' : '펼치기'}
              >
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {isAttachmentExpanded ? '접기' : '펼치기'}
                </span>
                <div
                  className={`w-6 h-6 transition-transform duration-200 ${
                    isAttachmentExpanded ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  <img
                    src="/icons/chevron-down.svg"
                    alt={isAttachmentExpanded ? '위로' : '아래로'}
                    className="w-full h-full object-contain"
                  />
                </div>
              </button>
            </div>
          ) : (
            /* 결제버튼 표시: 무료 다운로드가 아니거나, 결제이력이 없거나, 결제이력은 있으나 남은 다운로드 시간이 만료된 경우 */
            <button
              onClick={handlePurchaseFiles}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary hover:bg-primary-hover transition-all duration-200 group"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-white group-hover:text-gray-100">
                다운로드
                <span className="bg-blue-100 text-primary px-2 py-1 rounded-full text-xs font-semibold ml-2">
                  {downloadPoint.toLocaleString()}P
                </span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 파일다운로드 목록 렌더: 무료 다운로드이거나, 결제 이력이 있으면서 다운로드 시간이 만료되지 않은 경우 */}
      {(isFreeDownload || (isPurchase && timeRemaining)) && (
        <div
          className={`w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6 transition-all duration-700 ease-in-out ${
            isAttachmentExpanded
              ? 'opacity-100 max-h-screen'
              : 'opacity-0 max-h-0 overflow-hidden'
          }`}
        >
          {/* 파일이 2개 이상인 경우 전체 다운로드 버튼 */}
          {attachments.length >= 2 && (
            <div className="w-full border-2 border-dashed border-primary rounded-lg hover:shadow-md transition-shadow bg-primary/5">
              <button
                onClick={handleDownloadAll}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-primary/10 transition-colors"
              >
                <div className="w-12 h-12 flex justify-center items-center bg-primary rounded">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-primary truncate text-ellipsis">
                    전체 다운로드
                  </p>
                  <p className="text-xs text-primary/70">
                    {attachments.length}개 파일 일괄 다운로드
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {attachments.length}
                    </span>
                  </div>
                </div>
              </button>
            </div>
          )}

          {attachments.map((attachment: FileAttachment, index) => {
            const { url, fileName } = attachment;
            return (
              <div
                key={index}
                className="w-full border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer"
                  onClick={async (e) => {
                    e.preventDefault(); // 기본 동작 방지
                    await handleIndividualDownload(url, fileName);
                  }}
                >
                  <div className="w-12 h-12 flex justify-center items-center bg-gray-100 rounded">
                    <img
                      src={fileService.getFileIconByType(
                        'application/octet-stream',
                        fileName
                      )}
                      alt="첨부파일 아이콘"
                      className="w-8 h-8 object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-gray-800 truncate text-ellipsis">
                      {fileName}
                    </p>
                    <p className="text-xs text-gray-500">
                      클릭하여 파일 다운로드
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <img
                      src="/icons/download-icon.svg"
                      alt="다운로드"
                      className="w-5 h-5"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/icons/file-icon.svg';
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
} 