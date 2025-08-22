export declare enum UploadErrorType {
    NETWORK_ERROR = "network_error",
    FILE_TOO_LARGE = "file_too_large",
    UNSUPPORTED_FORMAT = "unsupported_format",
    PERMISSION_DENIED = "permission_denied",
    SERVER_ERROR = "server_error",
    UPLOAD_TIMEOUT = "upload_timeout",
    QUOTA_EXCEEDED = "quota_exceeded",
    INVALID_POST = "invalid_post"
}
export declare function getUploadErrorMessage(error: any): string;
export declare function isRetryableError(error: any): boolean;
export declare function logUploadError(error: any, context: {
    postId?: number;
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    action?: 'upload' | 'retry' | 'progress' | 'cancel';
}): void;
export interface UploadMetrics {
    startTime: number;
    totalFiles: number;
    completedFiles: number;
    failedFiles: number;
    totalBytes: number;
    uploadedBytes: number;
    retryCount: number;
}
export declare function calculateUploadMetrics(files: any[], startTime: number): UploadMetrics;
export declare function estimateCompletionTime(metrics: UploadMetrics): number | null;
export declare function calculateUploadSpeed(metrics: UploadMetrics): number;
