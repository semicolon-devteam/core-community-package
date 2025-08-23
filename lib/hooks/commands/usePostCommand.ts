import type { FileUploadResponse } from '@services/fileService';
import fileService from '@services/fileService';
import postService, { PostDownloadHistory } from '@services/postService';
import { useCallback, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@hooks/common';
import type { CommonResponse } from '../../types/common';
import { CommonStatus } from '../../types/common';
import type { FileAttachment } from '../../types/post';
import { showPopup } from '@redux/Features/Popup/popupSlice';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { refreshMyInfo, selectUserInfo } from '@redux/Features/User/userSlice';

export const usePostCommand = () => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector(selectUserInfo);
  const [files, setFiles] = useState<File[]>([]);
  const [fileAttachments, setFileAttachments] = useState<FileAttachment[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [localFilePreviews, setLocalFilePreviews] = useState<string[]>([]);
  const [downloadExpiredTime, setDownloadExpiredTime] = useState<Date | null>(
    null
  );

  // 파일 용량과 개수 계산 (Computed values)
  const fileStats = useMemo(() => {
    const totalSize = [...fileAttachments, ...files].reduce((acc, item) => {
      const size = 'fileSize' in item ? item.fileSize : item.size;
      return acc + (size || 0);
    }, 0);

    const totalSizeMB = totalSize / (1024 * 1024);
    const totalCount = fileAttachments.length + files.length;

    return {
      totalFileSize: totalSize,
      totalFileSizeMB: totalSizeMB,
      totalFileCount: totalCount,
      isFileSizeOverLimit: totalSizeMB > 200,
      isFileCountOverLimit: totalCount > 15,
      fileSizePercentage: Math.min((totalSizeMB / 200) * 100, 100),
    };
  }, [fileAttachments, files]);

  const reactionPost = async (
    postId: number,
    reactionType: 'like' | 'dislike'
  ) => {
    const response = await postService.reactionPost(postId, reactionType);
    return response;
  };

  const addFile = useCallback(async (customFile?: File) => {
    if (customFile) {
      setFiles(prev => [...prev, customFile]);
      // 파일 타입에 따른 아이콘 URL 생성
      const previewUrl = customFile.type.startsWith('image/')
        ? URL.createObjectURL(customFile)
        : fileService.getFileIconByType(customFile.type, customFile.name);
      setLocalFilePreviews(prev => [...prev, previewUrl]);
      return { file: customFile, previewUrl };
    } else {
      return new Promise<{ file: File; previewUrl: string } | null>(
        (resolve, reject) => {
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.multiple = true;
          // fileInput.accept = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.mp4,.mov,.avi,.wmv,.mkv,.jpeg,.jpg,.png,.gif,.webp";
          fileInput.accept =
            '.mp4,.mov,.avi,.wmv,.mkv,.jpeg,.jpg,.png,.gif,.webp,.txt';

          fileInput.onchange = async (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files.length > 0) {
              const selectedFiles = Array.from(target.files);
              selectedFiles.forEach(file => {
                setFiles(prev => [...prev, file]);
                // 파일 타입에 따른 아이콘 URL 생성
                const previewUrl = file.type.startsWith('image/')
                  ? URL.createObjectURL(file)
                  : fileService.getFileIconByType(file.type, file.name);
                setLocalFilePreviews(prev => [...prev, previewUrl]);
              });
              resolve({
                file: selectedFiles[0],
                previewUrl: URL.createObjectURL(selectedFiles[0]),
              });
            } else {
              resolve(null);
            }
          };

          fileInput.click();
        }
      );
    }
  }, []);

  const downloadFile = async (file: File) => {
    const response = await fileService.downloadFile(file);
    return response;
  };

  const uploadFile = useCallback(
    async (
      customFile?: File,
      options?: {
        skipStateUpdate?: boolean;
        doWaterMark?: boolean;
      }
    ) => {
      if (customFile) {
        // 직접 파일을 전달받은 경우
        
        // 위지윅 에디터용인 경우에만 실제 업로드 수행
        if (options?.skipStateUpdate) {
          try {
            const response = await fileService.uploadFile(customFile, {
              doWaterMark: options?.doWaterMark ?? true,
            });
            if (response.successOrNot === 'Y' && response.data) {
              const fileData = response.data as FileUploadResponse;
              return {
                previewUrl: fileData.url,
                uuid: fileData.uuid,
              };
            }
            return null;
          } catch (error) {
            console.error('위지윅 이미지 업로드 실패:', error);
            throw error;
          }
        }
        
        // 게시글 첨부파일인 경우 로컬에만 저장 (업로드하지 않음)
        setFiles(prev => [...prev, customFile]);
        
        // 파일 타입에 따른 아이콘 URL 생성
        const previewUrl = customFile.type.startsWith('image/')
          ? URL.createObjectURL(customFile)
          : fileService.getFileIconByType(customFile.type, customFile.name);
        
        setLocalFilePreviews(prev => [...prev, previewUrl]);
        
        return { file: customFile, previewUrl };
      } else {
        // 파일 선택 UI를 통한 첨부파일 선택 (업로드하지 않고 로컬에만 저장)
        return new Promise<{ file: File; previewUrl: string } | null>(
          (resolve, reject) => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = false;
            fileInput.accept =
              '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.mp4,.mov,.avi,.wmv,.mkv,.jpeg,.jpg,.png,.gif,.webp,.txt';

            fileInput.onchange = async (e: Event) => {
              const target = e.target as HTMLInputElement;
              if (target.files && target.files.length > 0) {
                const file = target.files[0];
                
                // 파일을 로컬에만 저장 (업로드하지 않음)
                setFiles(prev => [...prev, file]);
                
                // 파일 타입에 따른 아이콘 URL 생성
                const previewUrl = file.type.startsWith('image/')
                  ? URL.createObjectURL(file)
                  : fileService.getFileIconByType(file.type, file.name);
                
                setLocalFilePreviews(prev => [...prev, previewUrl]);
                
                resolve({ file, previewUrl });
              } else {
                resolve(null);
              }
            };

            fileInput.click();
          }
        );
      }
    },
    []
  );

  // UploadOptions 인터페이스 정의
  interface UploadOptions {
    postId: number;
    fileUuids?: string[]; // DB에 저장된 UUID들
    onProgress?: (progress: number) => void;
    maxRetries?: number;
    needWatermark?: boolean;
    watermarkPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    watermarkOpacity?: number;
    needThumbnail?: boolean; // 썸네일 추출 필요 여부
    wysiwygImageExists?: boolean; // 위지윅에 이미지 존재 여부
  }

  // 비동기 파일 업로드 함수 (외부 미디어 프로세서 사용)
  const uploadAllFiles = async (
    options: UploadOptions
  ): Promise<CommonResponse<FileAttachment[]>> => {
    const { postId, fileUuids, onProgress, maxRetries = 3, needWatermark = true, watermarkPosition = 'bottom-right', watermarkOpacity = 0.7, needThumbnail = false, wysiwygImageExists = false } = options;
    // 파일이 없는 경우 즉시 성공 반환
    if (!files.length) {
      return {
        successOrNot: 'Y',
        statusCode: CommonStatus.SUCCESS,
        data: [],
      };
    }

    try {
      // 외부 미디어 프로세서 URL
      const mediaProcessorUrl = process.env.NEXT_PUBLIC_IMAGE_PROCESS_URL;
      
      if (!mediaProcessorUrl) {
        console.error('NEXT_PUBLIC_IMAGE_PROCESS_URL이 설정되지 않았습니다.');
        return {
          successOrNot: 'N',
          statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
          data: null,
          message: '미디어 프로세서 URL이 설정되지 않았습니다.',
        };
      }

      // FormData 준비
      const formData = new FormData();
      formData.append('postId', postId.toString());
      
      

      // Redux에서 사용자 UUID 가져오기
      if (!userInfo?.user_id) {
        return {
          successOrNot: 'N',
          statusCode: CommonStatus.UNAUTHORIZED,
          data: null,
          message: '사용자 인증 정보가 없습니다.',
        };
      }
      formData.append('userId', userInfo.user_id.toString());
      
      formData.append('needWatermark', needWatermark.toString());
      formData.append('watermarkPosition', watermarkPosition);
      formData.append('watermarkOpacity', watermarkOpacity.toString());

      // 파일들 준비 (최대 10개 제한)
      const filesToUpload = files.slice(0, 10);
      
      // 썸네일 추출 로직: 기존 동기 업로드 로직 참고
      // 1. 위지윅에 이미지가 없고
      // 2. 첨부파일에 이미지/gif가 없고 
      // 3. 비디오 파일이 있는 경우 첫 번째 비디오에서 썸네일 추출
      const hasImageOrGif = filesToUpload.some(file => file.type.startsWith('image/'));
      const videoFiles = filesToUpload.filter(file => file.type.startsWith('video/'));
      const shouldExtractThumbnail = !wysiwygImageExists && !hasImageOrGif && videoFiles.length > 0;
      
      formData.append('needThumbnail', (needThumbnail || shouldExtractThumbnail).toString());
      if (shouldExtractThumbnail && videoFiles.length > 0) {
        // 첫 번째 비디오 파일의 인덱스를 전달
        const firstVideoIndex = filesToUpload.findIndex(file => file.type.startsWith('video/'));
        formData.append('thumbnailFileIndex', firstVideoIndex.toString());
      }
      
      // DB에 저장된 UUID가 있으면 사용, 없으면 새로 생성
      const uuidsToUse = fileUuids && fileUuids.length === filesToUpload.length 
        ? fileUuids 
        : filesToUpload.map(() => crypto.randomUUID());
      
      filesToUpload.forEach((file, index) => {
        formData.append('files', file);
        formData.append('fileUuids', uuidsToUse[index]);
      });

      console.log(`📤 외부 미디어 프로세서에 파일 업로드 시작`, {
        postId,
        userId: userInfo.user_id,
        fileCount: filesToUpload.length,
        fileUuids: uuidsToUse,
        fileNames: filesToUpload.map(f => f.name),
        mediaProcessorUrl,
        needWatermark,
        watermarkPosition,
        watermarkOpacity,
        // 썸네일 관련 정보
        needThumbnail: needThumbnail || shouldExtractThumbnail,
        wysiwygImageExists,
        hasImageOrGif,
        videoCount: videoFiles.length,
        shouldExtractThumbnail,
      });
      
      // FormData 내용 확인 로그
      console.log('📋 FormData 내용 확인:');
      for (const [key, value] of formData.entries()) {
        if (key === 'files') {
          console.log(`  ${key}: ${(value as File).name} (${(value as File).size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      // 외부 미디어 프로세서에 요청
      const response = await fetch(`${mediaProcessorUrl}/api/media/upload-async`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`미디어 프로세서 HTTP 오류:`, {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          postId,
          fileCount: filesToUpload.length,
        });
        
        // 사용자 친화적인 오류 메시지
        let userMessage = '파일 업로드 중 오류가 발생했습니다.';
        if (response.status === 413) {
          userMessage = '파일 크기가 너무 큽니다. 파일 크기를 줄여주세요.';
        } else if (response.status === 422) {
          userMessage = '지원하지 않는 파일 형식이거나 손상된 파일입니다.';
        } else if (response.status >= 500) {
          userMessage = '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
        } else if (response.status === 401 || response.status === 403) {
          userMessage = '파일 업로드 권한이 없습니다. 로그인을 확인해주세요.';
        }
        
        throw new Error(userMessage);
      }

      const result = await response.json();
      console.log('미디어 프로세서 응답:', result);

      if (result.successOrNot === 'N') {
        console.error('미디어 프로세서 로직 오류:', result);
        
        // 구체적인 오류 메시지 제공
        const userMessage = result.message || 
          result.error || 
          '파일 처리 중 오류가 발생했습니다. 파일을 다시 확인해주세요.';
        
        throw new Error(userMessage);
      }

      // 비동기 업로드가 시작된 경우
      console.log('✅ 비동기 파일 업로드 시작됨:', result.data);

      // 로컬 파일과 미리보기 초기화 (비동기 처리이므로 즉시 정리)
      setFiles([]);
      setLocalFilePreviews([]);

      // 비동기 처리 성공 - 빈 배열 반환 (실제 파일 정보는 진행도 API에서 조회)
      return {
        successOrNot: 'Y',
        statusCode: CommonStatus.SUCCESS,
        data: [], // 비동기이므로 빈 배열
        message: '파일 업로드가 시작되었습니다.',
      };

    } catch (error) {
      console.error('외부 미디어 프로세서 파일 업로드 실패:', error);
      
      return {
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
        data: null,
        message: error instanceof Error ? error.message : '파일 업로드 중 오류가 발생했습니다.',
      };
    }
  };


  // 파일 제거 핸들러 수정
  const handleRemoveFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setLocalFilePreviews(prev => {
      const newPreviews = [...prev];
      if (newPreviews[index]?.startsWith('blob:')) {
        URL.revokeObjectURL(newPreviews[index]);
      }
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  }, []);

  // 기존 첨부파일만 제거하는 핸들러
  const handleRemoveAttachment = useCallback((index: number) => {
    setFileAttachments(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
    // 기존 첨부파일은 File 객체가 아니므로 setFiles는 건드리지 않음
  }, []);

  // 컴포넌트 언마운트 시 URL 객체 해제
  const cleanupFilePreviews = useCallback(() => {
    filePreviews.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
  }, [filePreviews]);

  // URL을 상대경로로 변환하는 헬퍼 함수
  const convertToRelativePath = useCallback((url: string) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const resourceUrl = process.env.NEXT_PUBLIC_RESOURCE_URL;

    if (!supabaseUrl) return url;

    // 로컬환경이고 NEXT_PUBLIC_RESOURCE_URL이 있으면 치환
    if (
      process.env.NODE_ENV === 'development' &&
      resourceUrl &&
      url.includes(supabaseUrl)
    ) {
      return url.replace(supabaseUrl, resourceUrl);
    }

    // 그 외의 경우 NEXT_PUBLIC_SUPABASE_URL을 제거하여 상대경로로 변환
    if (url.includes(supabaseUrl)) {
      const replacedUrl = url.replace(supabaseUrl, '/');
      return replacedUrl.startsWith('//') ? replacedUrl.substring(1) : replacedUrl;
    }

    return url;
  }, []);

  const extractThumbnailUrlFromWysiwig = useCallback(
    (content: string) => {
      // 마크다운 이미지 형식 매치: ![텍스트](URL)
      const markdownImgMatch = content.match(/!\[.*?\]\(([^)]+)\)/i);

      if (markdownImgMatch) {
        let url = markdownImgMatch[1];
        // URL 앞에 슬래시가 2개인 경우 하나로 줄이기
        if (url.startsWith('//')) {
          url = url.substring(1);
        }
        return convertToRelativePath(url); // 상대경로로 변환하여 반환
      }

      // 백업: HTML 이미지 태그도 검사 (마크다운 형식 변환 후에도 HTML 태그가 유지될 수 있음)
      const htmlImgMatch = content.match(
        /<img [^>]*src=["']([^"']+)["'][^>]*>/i
      );

      if (htmlImgMatch) {
        let url = htmlImgMatch[1];
        // URL 앞에 슬래시가 2개인 경우 하나로 줄이기
        if (url.startsWith('//')) {
          url = url.substring(1);
        }
        return convertToRelativePath(url); // 상대경로로 변환하여 반환
      }

      return null;
    },
    [convertToRelativePath]
  );

  const deletePost = async (postId: number) => {
    const response = await postService.deletePost(postId);
    return response;
  };

  // 게시물 파일 구매 함수 (1일 이용권)
  const purchaseFilesWithPoint = async (
    postId: number,
    userPoint: number,
    downloadPoint: number,
    setIsPurchase: (isPurchase: boolean) => void
  ): Promise<CommonResponse<string>> => {
    try {
      // userPoint가 숫자가 아니라면 비로그인 상태로 판단
      if (typeof userPoint !== 'number' || isNaN(userPoint)) {
        return {
          successOrNot: 'N',
          statusCode: CommonStatus.FORBIDDEN,
          data: null,
          message: '정상 포인트가 아닙니다.',
        };
      }

      // userPoint가 downloadPoint보다 적다면 포인트 부족
      if (userPoint < downloadPoint) {
        return {
          successOrNot: 'N',
          statusCode: CommonStatus.FORBIDDEN,
          data: null,
          message: `${(
            downloadPoint - userPoint
          ).toLocaleString()} 포인트가 부족합니다.`,
        };
      }

      // 구매 확인 팝업 표시
      return new Promise(resolve => {
        const popupId = `purchase-confirm-${Date.now()}`;

        dispatch(
          showPopup({
            id: popupId,
            type: 'confirm',
            title: '파일 이용권 구매',
            content: `<div style="text-align: center; line-height: 1.6; font-family: 'Nexon', sans-serif;">
            <div style="margin-bottom: 20px; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700;">1일 파일 이용권</h3>
              <p style="margin: 0; font-size: 13px; opacity: 0.9;">포인트로 결제 후 24시간 동안 무제한 다운로드 가능합니다.</p>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 12px; background-color: white; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <span style="color: #475569; font-weight: 600; font-size: 14px;">현재 포인트</span>
                <span style="color: #3b82f6; font-weight: 700; font-size: 16px;">${userPoint.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 12px; background-color: white; border-radius: 8px; border-left: 4px solid #ef4444;">
                <span style="color: #475569; font-weight: 600; font-size: 14px;">결제 포인트</span>
                <span style="color: #ef4444; font-weight: 700; font-size: 16px;">-${downloadPoint.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background-color: white; border-radius: 8px; border-left: 4px solid #059669;">
                <span style="color: #475569; font-weight: 600; font-size: 14px;">결제 후</span>
                <span style="color: #059669; font-weight: 700; font-size: 16px;">${(
                  userPoint - downloadPoint
                ).toLocaleString()}</span>
              </div>
            </div>
          </div>`,
            confirmText: '다운로드',
            cancelText: '취소',
            showCancel: true,
            showConfirm: true,
            onConfirm: async () => {
              try {
                // 게시물 파일 구매 처리 (서버에 구매 기록 저장)
                const purchaseResponse: CommonResponse<PostDownloadHistory> =
                  await postService.purchaseFiles(postId);
                if (purchaseResponse.successOrNot === 'N') {
                  resolve({
                    successOrNot: 'N',
                    statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
                    data: null,
                    message:
                      purchaseResponse.message ||
                      '파일 구매 처리 중 오류가 발생했습니다.',
                  });
                  return;
                }

                // 유저 정보 새로고침
                dispatch(refreshMyInfo());

                // 구매 성공 시 만료 시간 설정 (successOrNot이 "Y"이므로 data는 PostDownloadHistory 타입)
                const downloadHistory =
                  purchaseResponse.data as PostDownloadHistory;
                if (downloadHistory.expires_at) {
                  setDownloadExpiredTime(new Date(downloadHistory.expires_at));
                  setIsPurchase(true);
                  resolve({
                    successOrNot: 'Y',
                    statusCode: CommonStatus.SUCCESS,
                    data: null,
                    message:
                      '파일 이용권을 구매했습니다. 24시간 동안 파일을 다운로드할 수 있습니다.',
                  });
                } else {
                  resolve({
                    successOrNot: 'N',
                    statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
                    data: null,
                    message: '파일 이용권 구매 처리 중 오류가 발생했습니다.',
                  });
                }
              } catch (error) {
                console.error('구매 중 오류 발생:', error);
                resolve({
                  successOrNot: 'N',
                  statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
                  data: null,
                  message: '구매 중 오류가 발생했습니다.',
                });
              }
            },
            onCancel: () => {
              resolve({
                successOrNot: 'N',
                statusCode: CommonStatus.FORBIDDEN,
                data: null,
                message: '구매를 취소했습니다.',
              });
            },
          })
        );
      });
    } catch (error) {
      console.error('구매 중 오류 발생:', error);
      return {
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
        data: null,
        message: '구매 중 오류가 발생했습니다.',
      };
    }
  };

  // 파일 다운로드 함수 (단순 다운로드만 처리)
  const downloadFileFromUrl = async (
    url: string,
    fileName: string
  ): Promise<CommonResponse<string>> => {
    try {
      // 파일을 blob으로 가져와서 강제 다운로드 처리
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('파일 다운로드 실패');
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // 다운로드 링크 생성 및 클릭
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      link.style.display = 'none';

      // 임시로 DOM에 추가
      document.body.appendChild(link);
      link.click();

      // 정리
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      return {
        successOrNot: 'Y',
        statusCode: CommonStatus.SUCCESS,
        data: null,
        message: '파일 다운로드가 시작되었습니다.',
      };
    } catch (error) {
      console.error('다운로드 중 오류 발생:', error);
      return {
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
        data: null,
        message: '다운로드 중 오류가 발생했습니다.',
      };
    }
  };

  // 기존 첨부파일을 fileAttachments와 filePreviews에 세팅하는 함수
  const setExistingAttachments = useCallback(
    (existingAttachments: FileAttachment[]) => {
      setFileAttachments(existingAttachments);
      const previews = existingAttachments.map(attachment => {
        if (attachment.fileType?.startsWith('image/')) {
          return attachment.url;
        } else {
          return fileService.getFileIconByType(
            attachment.fileType || '',
            attachment.fileName
          );
        }
      });
      setFilePreviews(previews);
      setFiles([]); // 기존 파일은 File 객체가 아니므로 비움
    },
    []
  );
  const bookmarkPost = async (postId: number) => {
    const response = await postService.bookmarkPost(postId);

    if (response.successOrNot === 'Y') {
      dispatch(
        showToast({
          title: '북마크 성공',
          content: '게시글이 북마크에 추가되었습니다.',
          remainTime: 'now',
          headerTextColor: 'text-green-500',
        })
      );
    } else {
      dispatch(
        showToast({
          title: '북마크 실패',
          content: response.message || '북마크 처리 중 오류가 발생했습니다.',
          remainTime: 'now',
          headerTextColor: 'text-red-500',
        })
      );
    }
    return response;
  };

  const deleteBookmarkPost = async (postId: number) => {
    const response = await postService.deleteBookmarkPost(postId);
    if (response.successOrNot === 'Y') {
      dispatch(
        showToast({
          title: '북마크 삭제 성공',
          content: '게시글이 북마크에서 삭제되었습니다.',
          remainTime: 'now',
          headerTextColor: 'text-green-500',
        })
      );
    } else {
      dispatch(
        showToast({
          title: '북마크 삭제 실패',
          content:
            response.message || '북마크 삭제 처리 중 오류가 발생했습니다.',
          remainTime: 'now',
          headerTextColor: 'text-red-500',
        })
      );
    }
    return response;
  };

  const movePost = async (postId: number, boardId: number) => {
    const response = await postService.movePost(postId, boardId);
    return response;
  };

  return {
    reactionPost,
    uploadFile,
    files,
    fileAttachments,
    filePreviews,
    handleRemoveFile,
    handleRemoveAttachment,
    cleanupFilePreviews,
    extractThumbnailUrlFromWysiwig,
    deletePost,
    setExistingAttachments,
    uploadAllFiles,
    localFilePreviews,
    addFile,
    downloadFileFromUrl,
    downloadFile,
    // 파일 통계 정보
    ...fileStats,
    purchaseFilesWithPoint,
    downloadExpiredTime,
    setDownloadExpiredTime,
    bookmarkPost,
    deleteBookmarkPost,
    movePost,
  };
};
