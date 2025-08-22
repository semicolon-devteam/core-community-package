// 업로드 에러 타입 정의
export enum UploadErrorType {
  NETWORK_ERROR = 'network_error',
  FILE_TOO_LARGE = 'file_too_large',
  UNSUPPORTED_FORMAT = 'unsupported_format',
  PERMISSION_DENIED = 'permission_denied',
  SERVER_ERROR = 'server_error',
  UPLOAD_TIMEOUT = 'upload_timeout',
  QUOTA_EXCEEDED = 'quota_exceeded',
  INVALID_POST = 'invalid_post',
}

// 에러 메시지 매핑
const ERROR_MESSAGES: Record<UploadErrorType, string> = {
  [UploadErrorType.FILE_TOO_LARGE]: '파일 크기가 너무 큽니다. 이미지는 10MB, 비디오는 100MB 이하로 업로드해주세요.',
  [UploadErrorType.UNSUPPORTED_FORMAT]: '지원하지 않는 파일 형식입니다. JPG, PNG, GIF, WebP, MP4, AVI, MOV 파일만 업로드 가능합니다.',
  [UploadErrorType.PERMISSION_DENIED]: '파일 업로드 권한이 없습니다. 로그인 상태를 확인해주세요.',
  [UploadErrorType.NETWORK_ERROR]: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해주세요.',
  [UploadErrorType.SERVER_ERROR]: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  [UploadErrorType.UPLOAD_TIMEOUT]: '업로드 시간이 초과되었습니다. 파일 크기를 확인하거나 다시 시도해주세요.',
  [UploadErrorType.QUOTA_EXCEEDED]: '업로드 할당량을 초과했습니다. 불필요한 파일을 삭제하거나 관리자에게 문의하세요.',
  [UploadErrorType.INVALID_POST]: '유효하지 않은 게시글입니다. 게시글을 다시 생성해주세요.',
};

// 에러 분석 및 사용자 친화적 메시지 생성
export function getUploadErrorMessage(error: any): string {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorResponse = error?.response?.data;

  // API 에러 응답에서 구체적인 에러 코드 확인
  if (errorResponse?.error?.code) {
    const errorCode = errorResponse.error.code as UploadErrorType;
    if (ERROR_MESSAGES[errorCode]) {
      return ERROR_MESSAGES[errorCode];
    }
  }

  // 에러 메시지 키워드 기반 분석
  if (errorMessage.includes('file too large') || errorMessage.includes('413')) {
    return ERROR_MESSAGES[UploadErrorType.FILE_TOO_LARGE];
  }

  if (errorMessage.includes('unsupported') || 
      errorMessage.includes('invalid format') || 
      errorMessage.includes('415')) {
    return ERROR_MESSAGES[UploadErrorType.UNSUPPORTED_FORMAT];
  }

  if (errorMessage.includes('permission') || 
      errorMessage.includes('unauthorized') || 
      errorMessage.includes('401') || 
      errorMessage.includes('403')) {
    return ERROR_MESSAGES[UploadErrorType.PERMISSION_DENIED];
  }

  if (errorMessage.includes('network') || 
      errorMessage.includes('fetch') || 
      errorMessage.includes('timeout') ||
      error?.code === 'NETWORK_ERROR') {
    return ERROR_MESSAGES[UploadErrorType.NETWORK_ERROR];
  }

  if (errorMessage.includes('quota') || 
      errorMessage.includes('storage full') ||
      errorMessage.includes('429')) {
    return ERROR_MESSAGES[UploadErrorType.QUOTA_EXCEEDED];
  }

  if (errorMessage.includes('post not found') || 
      errorMessage.includes('invalid post') ||
      errorMessage.includes('404')) {
    return ERROR_MESSAGES[UploadErrorType.INVALID_POST];
  }

  // 기본 에러 메시지
  return '파일 업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
}

// 재시도 가능한 에러인지 확인
export function isRetryableError(error: any): boolean {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorCode = error?.response?.data?.error?.code;

  // 재시도 불가능한 에러들
  const nonRetryableErrors = [
    UploadErrorType.FILE_TOO_LARGE,
    UploadErrorType.UNSUPPORTED_FORMAT,
    UploadErrorType.PERMISSION_DENIED,
    UploadErrorType.QUOTA_EXCEEDED,
    UploadErrorType.INVALID_POST,
  ];

  if (nonRetryableErrors.includes(errorCode)) {
    return false;
  }

  // 키워드 기반 재시도 불가능 에러 체크
  if (errorMessage.includes('file too large') ||
      errorMessage.includes('unsupported') ||
      errorMessage.includes('invalid format') ||
      errorMessage.includes('permission') ||
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('quota')) {
    return false;
  }

  // 그 외는 모두 재시도 가능
  return true;
}

// 업로드 에러 로깅
export function logUploadError(
  error: any, 
  context: {
    postId?: number;
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    action?: 'upload' | 'retry' | 'progress' | 'cancel';
  }
): void {
  const errorInfo = {
    message: error?.message || 'Unknown error',
    stack: error?.stack,
    response: error?.response?.data,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };

  // 개발 환경에서는 콘솔에 상세 출력
  if (process.env.NODE_ENV === 'development') {
    console.group('🚨 Upload Error');
    console.error('Error Details:', errorInfo);
    console.groupEnd();
  }

  // 프로덕션에서는 모니터링 서비스로 전송
  if (process.env.NODE_ENV === 'production') {
    // 예: Sentry, LogRocket 등으로 전송
    // window.Sentry?.captureException(error, { extra: errorInfo });
    console.error('Upload Error:', errorInfo);
  }
}

// 업로드 진행 상황 추적을 위한 인터페이스
export interface UploadMetrics {
  startTime: number;
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  totalBytes: number;
  uploadedBytes: number;
  retryCount: number;
}

// 업로드 메트릭스 계산
export function calculateUploadMetrics(files: any[], startTime: number): UploadMetrics {
  const totalFiles = files.length;
  const completedFiles = files.filter(f => f.status === 'completed').length;
  const failedFiles = files.filter(f => f.status === 'failed').length;
  const totalBytes = files.reduce((sum, f) => sum + (f.fileSize || 0), 0);
  const uploadedBytes = files.reduce((sum, f) => {
    return sum + (f.fileSize || 0) * ((f.progress || 0) / 100);
  }, 0);

  return {
    startTime,
    totalFiles,
    completedFiles,
    failedFiles,
    totalBytes,
    uploadedBytes,
    retryCount: 0, // 별도 관리 필요
  };
}

// 예상 완료 시간 계산
export function estimateCompletionTime(metrics: UploadMetrics): number | null {
  const elapsed = Date.now() - metrics.startTime;
  const progress = metrics.uploadedBytes / metrics.totalBytes;
  
  if (progress === 0) return null;
  
  const totalEstimated = elapsed / progress;
  const remaining = totalEstimated - elapsed;
  
  return Math.max(0, remaining);
}

// 업로드 속도 계산 (MB/s)
export function calculateUploadSpeed(metrics: UploadMetrics): number {
  const elapsed = (Date.now() - metrics.startTime) / 1000; // 초 단위
  const uploadedMB = metrics.uploadedBytes / (1024 * 1024);
  
  return elapsed > 0 ? uploadedMB / elapsed : 0;
}