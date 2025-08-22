import { useState, useEffect, useCallback } from 'react';
import type { FileAttachment } from '@model/post';

interface UploadProgressState {
  files: FileAttachment[];
  overallProgress: number;
  isUploading: boolean;
  hasCompleted: boolean;
  hasErrors: boolean;
}

export const useUploadProgress = (postId?: number) => {
  const [state, setState] = useState<UploadProgressState>({
    files: [],
    overallProgress: 0,
    isUploading: false,
    hasCompleted: false,
    hasErrors: false,
  });

  // 전체 진행도 계산
  const calculateOverallProgress = useCallback((files: FileAttachment[]) => {
    if (files.length === 0) return 0;
    const totalProgress = files.reduce((sum, file) => sum + (file.progress || 0), 0);
    return Math.round(totalProgress / files.length);
  }, []);

  // 업로드 상태 분석
  const analyzeUploadState = useCallback((files: FileAttachment[]) => {
    const isUploading = files.some(file => 
      file.status === 'pending' || 
      file.status === 'watermarking' || 
      file.status === 'uploading'
    );
    
    const hasCompleted = files.length > 0 && files.every(file => 
      file.status === 'uploaded'
    );
    
    const hasErrors = files.some(file => file.status === 'failed');
    
    return { isUploading, hasCompleted, hasErrors };
  }, []);

  // 진행도 조회 API 호출
  const fetchUploadProgress = useCallback(async (): Promise<FileAttachment[]> => {
    if (!postId) return [];
    
    try {
      // 실제 API 호출
      const { default: postService } = await import('@services/postService');
      const progressData = await postService.getUploadProgress(postId);
      return progressData.files;
    } catch (error) {
      console.error('진행도 조회 실패:', error);
      
      // 에러 발생시 목 데이터로 폴백 (개발 중에만)
      if (process.env.NODE_ENV === 'development') {
        return new Promise((resolve) => {
          setTimeout(() => {
            const mockFiles: FileAttachment[] = [
              {
                fileName: 'sample_image.jpg',
                fileSize: 3 * 1024 * 1024,
                fileType: 'image/jpeg',
                fullPath: '/uploads/images/sample_image.jpg',
                uuid: 'image-uuid-1',
                url: '/storage/uploads/images/sample_image.jpg',
                status: 'uploaded',
                progress: 100,
                uploadedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
              },
              {
                fileName: 'large_video.mp4',
                fileSize: 26 * 1024 * 1024,
                fileType: 'video/mp4',
                fullPath: '/uploads/videos/large_video.mp4',
                uuid: 'video-uuid-1',
                url: '/storage/uploads/videos/large_video.mp4',
                status: Math.random() > 0.3 ? 'uploading' : 'uploaded',
                progress: Math.random() > 0.3 ? Math.floor(Math.random() * 40) + 50 : 100,
                uploadedAt: Math.random() > 0.3 ? undefined : new Date().toISOString(),
              },
            ];
            resolve(mockFiles);
          }, 500);
        });
      }
      
      throw error;
    }
  }, [postId]);

  // 폴링 시작
  const startPolling = useCallback(() => {
    if (!postId) return;
    
    const poll = async () => {
      try {
        const files = await fetchUploadProgress();
        const overallProgress = calculateOverallProgress(files);
        const uploadState = analyzeUploadState(files);
        
        setState({
          files,
          overallProgress,
          ...uploadState,
        });
        
        // 업로드가 완료되면 폴링 중단
        if (uploadState.hasCompleted || uploadState.hasErrors) {
          return;
        }
        
        // 2초 후 다시 폴링
        setTimeout(poll, 2000);
      } catch (error) {
        console.error('진행도 조회 실패:', error);
        // 에러 발생시 3초 후 재시도
        setTimeout(poll, 3000);
      }
    };
    
    poll();
  }, [postId, fetchUploadProgress, calculateOverallProgress, analyzeUploadState]);

  // 진행도 업데이트 (수동)
  const updateProgress = useCallback(async () => {
    if (!postId) return;
    
    try {
      const files = await fetchUploadProgress();
      const overallProgress = calculateOverallProgress(files);
      const uploadState = analyzeUploadState(files);
      
      setState({
        files,
        overallProgress,
        ...uploadState,
      });
    } catch (error) {
      console.error('진행도 업데이트 실패:', error);
    }
  }, [postId, fetchUploadProgress, calculateOverallProgress, analyzeUploadState]);

  // 초기화
  const reset = useCallback(() => {
    setState({
      files: [],
      overallProgress: 0,
      isUploading: false,
      hasCompleted: false,
      hasErrors: false,
    });
  }, []);

  return {
    ...state,
    startPolling,
    updateProgress,
    reset,
  };
};