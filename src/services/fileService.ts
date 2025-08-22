import { type CommonResponse } from '@model/common';
import baseService from './baseService';
import userService from './userService';

// 파일명을 안전한 형태로 변환하는 유틸리티 함수
const sanitizeFileName = (fileName: string): string => {
  // 파일명과 확장자 분리
  const lastDotIndex = fileName.lastIndexOf('.');
  const name =
    lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
  const extension = lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : '';

  // 한글을 영문으로 변환하거나 제거하고, 특수문자를 안전한 문자로 변환
  const sanitizedName = name
    .normalize('NFD') // 유니코드 정규화
    .replace(/[\u0300-\u036f]/g, '') // 결합 문자 제거
    .replace(/[^\w\s-]/g, '') // 영문, 숫자, 공백, 하이픈만 허용
    .replace(/\s+/g, '_') // 공백을 언더스코어로 변환
    .replace(/_{2,}/g, '_') // 연속된 언더스코어를 하나로
    .replace(/^_|_$/g, '') // 시작과 끝의 언더스코어 제거
    .toLowerCase(); // 소문자로 변환

  // 빈 문자열인 경우 타임스탬프 사용
  const finalName = sanitizedName || `file_${Date.now()}`;

  // 파일명이 너무 긴 경우 자르기 (확장자 제외하고 최대 100자)
  const truncatedName =
    finalName.length > 100 ? finalName.substring(0, 100) : finalName;

  return truncatedName + extension.toLowerCase();
};

// 파일 업로드 로더 함수들
let globalShowFileUploadLoader: ((message?: string) => void) | null = null;
let globalHideFileUploadLoader: (() => void) | null = null;

// 파일 업로드 로더 함수들을 설정하는 함수 (클라이언트 사이드에서 호출)
export const setFileUploadLoaderFunctions = (
  showLoader: (message?: string) => void,
  hideLoader: () => void
) => {
  globalShowFileUploadLoader = showLoader;
  globalHideFileUploadLoader = hideLoader;
};

export interface FileUploadResponse {
  uuid: string;
  url: string;
  fullPath: string;
  thumbnailUrl?: string;
  metadata?: any;
}

const fileService = {
  uploadFile: async (
    file: File,
    options?: { needThumbnailExtract?: boolean; doWaterMark?: boolean }
  ): Promise<CommonResponse<FileUploadResponse>> => {
    try {
      // 파일 크기 체크 (200MB)
      const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB를 바이트 단위로 변환
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('개당 파일 크기는 200MB를 초과할 수 없습니다.');
      }

      // 파일명을 안전한 형태로 변환
      const sanitizedFileName = sanitizeFileName(file.name);

      // 새로운 파일명으로 File 객체 생성
      const sanitizedFile = new File([file], sanitizedFileName, {
        type: file.type,
        lastModified: file.lastModified,
      });


      // 파일 타입 확인 (이미지 또는 영상 파일인지)
      const isImageOrVideo = file.type.startsWith('image/') || file.type.startsWith('video/');

      if (isImageOrVideo) {
        // 이미지나 영상 파일인 경우 외부 미디어 처리 서비스 사용
        return await fileService.uploadToImageProcessService(sanitizedFile, options);
      } else {
        // 이미지나 영상이 아닌 파일인 경우 내부 API 사용
        return await fileService.uploadToInternalAPI(sanitizedFile);
      }
    } catch (error) {
      console.error(
        `파일 업로드 오류: ${file.name} (처리된 파일명: ${sanitizeFileName(
          file.name
        )})`,
        error
      );
      throw error;
    }
  },

  // 외부 미디어 처리 서비스로 업로드 (이미지/영상) - 동기 방식
  uploadToImageProcessService: async (
    file: File,
    options?: { needThumbnailExtract?: boolean; doWaterMark?: boolean }
  ): Promise<CommonResponse<FileUploadResponse>> => {
    const formData = new FormData();
    formData.append('file', file);

    // 현재 로그인한 유저 ID 가져오기
    const userIdResponse = await userService.getUserUuid();
    if (userIdResponse.successOrNot === 'N') {
      throw new Error('유저 ID 가져오기 실패');
    }
    const userId = userIdResponse.data as string;
    formData.append('userId', userId);

    // 썸네일 추출 필요 여부 추가
    if (options?.needThumbnailExtract) {
      formData.append('needThumbnailExtract', 'true');
    }

    if (options?.doWaterMark === false) {
      formData.append('needWatermark', 'false');
    }

    // 외부 미디어 처리 서비스로 요청
    const imageProcessUrl = process.env.NEXT_PUBLIC_IMAGE_PROCESS_URL;
    if (!imageProcessUrl) {
      throw new Error(
        'NEXT_PUBLIC_IMAGE_PROCESS_URL 환경변수가 설정되지 않았습니다.'
      );
    }
    const apiUrl = `${imageProcessUrl}/api/media/process`;

    // 파일 업로드 로더 표시
    if (globalShowFileUploadLoader) {
      globalShowFileUploadLoader('파일 업로드 및 워터마크 생성중');
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          // FormData 사용 시 Content-Type 헤더는 자동으로 설정되므로 제거
        },
      });

      const result: CommonResponse<FileUploadResponse> =
        await response.json();

      return result;
    } finally {
      // 파일 업로드 로더 숨기기
      if (globalHideFileUploadLoader) {
        globalHideFileUploadLoader();
      }
    }
  },

  // 내부 API로 업로드 (일반 파일)
  uploadToInternalAPI: async (
    file: File
  ): Promise<CommonResponse<FileUploadResponse>> => {
    const formData = new FormData();
    formData.append('file', file);

    // 파일 업로드 로더 표시
    if (globalShowFileUploadLoader) {
      globalShowFileUploadLoader('파일 업로드중');
    }

    try {
      const response = await baseService.post<FileUploadResponse, FormData>(
        '/api/files',
        formData
      );

      return response;
    } finally {
      // 파일 업로드 로더 숨기기
      if (globalHideFileUploadLoader) {
        globalHideFileUploadLoader();
      }
    }
  },
  downloadFile: async (file: File): Promise<CommonResponse<string>> => {
    const response = await baseService.get<string>(`/api/files/${file.name}`);
    return response;
  },
  getFile: async (uuid: string): Promise<CommonResponse<string>> => {
    const response = await baseService.get<string>(`/api/files/${uuid}`);
    return response;
  },
  // 파일 유형에 따른 아이콘 URL 반환 함수
  getFileIconByType: (type: string, fileName: string = ''): string => {
    // 파일 확장자 확인 (MIME 타입이 정확하지 않을 때를 위해)
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    // 비디오/영상 파일
    if (
      type.startsWith('video/') ||
      ['mp4', 'mov', 'avi', 'wmv', 'mkv', 'webm', 'flv', 'm4v'].includes(ext)
    ) {
      return '/icons/video-icon.svg';
    }
    // 이미지 파일
    if (
      type.startsWith('image/') ||
      ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)
    ) {
      return '/icons/image-icon.svg';
    }

    // PDF 파일
    if (type.includes('pdf') || ext === 'pdf') {
      return '/icons/pdf-icon.svg';
    }

    // 워드 문서
    if (
      type.includes('word') ||
      type.includes('document') ||
      ['doc', 'docx', 'rtf', 'odt'].includes(ext)
    ) {
      return '/icons/doc-icon.svg';
    }

    // 엑셀 파일
    if (
      type.includes('excel') ||
      type.includes('sheet') ||
      ['xls', 'xlsx', 'csv', 'ods'].includes(ext)
    ) {
      return '/icons/xls-icon.svg';
    }

    // 파워포인트 파일
    if (
      type.includes('powerpoint') ||
      type.includes('presentation') ||
      ['ppt', 'pptx', 'odp'].includes(ext)
    ) {
      return '/icons/ppt-icon.svg';
    }

    // 기타 파일
    return '/icons/file-icon.svg';
  },
  // 썸네일 URL 생성 함수
  generateThumbnailFromUUID: async (
    uuid: string,
    fileType: string,
    fileName: string
  ): Promise<string> => {
    // 이미지 파일인 경우 실제 이미지 URL 반환
    if (fileType.startsWith('image/')) {
      try {
        const response = await fileService.getFile(uuid);
        if (response.successOrNot === 'Y' && response.data) {
          return response.data;
        }
      } catch (error) {
        console.error('썸네일 생성 오류:', error);
      }
    }

    // 이미지가 아니거나 오류 발생 시 파일 유형에 맞는 아이콘 반환
    return fileService.getFileIconByType(fileType, fileName);
  },
};

export default fileService;
