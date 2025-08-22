import { usePostCommand } from '@hooks/commands/usePostCommand';
import { useAppDispatch, useAppSelector, useGlobalLoader } from '@hooks/common';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { selectUserInfo } from '@redux/Features/User/userSlice';
import { useEffect, useState } from 'react';

interface UseFileDownloadProps {
  postId: number;
  downloadPoint: number;
  fileDownloadExpiredTime?: Date | null;
}

// 남은 시간 계산 유틸리티 함수
const calculateTimeRemaining = (expiredTime: Date | string | null | undefined): {
  hours: number;
  minutes: number;
  seconds: number;
} | null => {
  if (!expiredTime) return null;
  
  const now = new Date().getTime();
  const distance = new Date(expiredTime).getTime() - now;
  
  if (distance <= 0) return null;
  
  const hours = Math.floor(distance / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds };
};

export function useFileDownload({ 
  postId, 
  downloadPoint, 
  fileDownloadExpiredTime 
}: UseFileDownloadProps) {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector(selectUserInfo);
  const { showMiniLoader, hideMiniLoader } = useGlobalLoader();
  const {
    downloadFileFromUrl,
    purchaseFilesWithPoint,
    downloadExpiredTime,
    setDownloadExpiredTime,
  } = usePostCommand();

  const [isPurchase, setIsPurchase] = useState<boolean>(
    fileDownloadExpiredTime ? true : false
  );

  // 카운트다운 상태 - hydration 오류 방지를 위해 초기값은 null로 설정
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  // 마운트 상태 확인 (hydration 오류 방지)
  const [isMounted, setIsMounted] = useState(false);

  const isFreeDownload = downloadPoint === 0;

  // 컴포넌트 마운트 확인
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // fileDownloadExpiredTime이 있을 때 downloadExpiredTime 초기화 및 초기 시간 계산
  useEffect(() => {
    if (fileDownloadExpiredTime && isMounted) {
      setDownloadExpiredTime(fileDownloadExpiredTime);
      // 클라이언트에서만 초기 시간 계산
      const initialTime = calculateTimeRemaining(fileDownloadExpiredTime);
      setTimeRemaining(initialTime);
    }
  }, [fileDownloadExpiredTime, setDownloadExpiredTime, isMounted]);

  // 다운로드 만료 시간 카운트다운
  useEffect(() => {
    if (!downloadExpiredTime) return;

    const interval = setInterval(() => {
      const calculatedTime = calculateTimeRemaining(downloadExpiredTime);
      
      if (!calculatedTime) {
        clearInterval(interval);
        setTimeRemaining(null);
        setDownloadExpiredTime(null);
        return;
      }

      setTimeRemaining(calculatedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [downloadExpiredTime, setDownloadExpiredTime]);

  // 파일 다운로드 핸들러
  const handleDownload = async (url: string, fileName: string) => {
    try {
      if (isFreeDownload) {
        // 무료 다운로드
        showMiniLoader(`${fileName} 다운로드 중...`);
        try {
          await downloadFileFromUrl(url, fileName);
        } finally {
          hideMiniLoader();
        }
      } else {
        // 포인트 결제 필요
        if (!isPurchase) {
          dispatch(
            showToast({
              show: true,
              title: '다운로드 권한 없음',
              content: '파일을 구매해야 다운로드할 수 있습니다.',
              headerTextColor: 'text-red-500',
              remainTime: '방금',
            })
          );
          return;
        }

        if (downloadExpiredTime && new Date() > new Date(downloadExpiredTime)) {
          dispatch(
            showToast({
              show: true,
              title: '다운로드 기간 만료',
              content: '다운로드 기간이 만료되었습니다.',
              headerTextColor: 'text-red-500',
              remainTime: '방금',
            })
          );
          return;
        }

        showMiniLoader(`${fileName} 다운로드 중...`);
        try {
          await downloadFileFromUrl(url, fileName);
        } finally {
          hideMiniLoader();
        }
      }
    } catch (error) {
      dispatch(
        showToast({
          show: true,
          title: '다운로드 실패',
          content: '파일 다운로드 중 오류가 발생했습니다.',
          headerTextColor: 'text-red-500',
          remainTime: '방금',
        })
      );
    }
  };

  // 파일 구매 핸들러
  const handlePurchaseFiles = async () => {
    if (!userInfo) {
      dispatch(
        showToast({
          show: true,
          title: '로그인 필요',
          content: '로그인이 필요한 서비스입니다.',
          headerTextColor: 'text-red-500',
          remainTime: '방금',
        })
      );
      return;
    }

    const response = await purchaseFilesWithPoint(
      postId,
      userInfo.point,
      downloadPoint,
      setIsPurchase
    );
    
    if (response.successOrNot === 'Y') {
      dispatch(
        showToast({
          show: true,
          title: '구매 완료',
          content: response.message || '구매가 완료되었습니다.',
          headerTextColor: 'text-green-500',
          remainTime: '방금',
        })
      );

    } else {
      dispatch(
        showToast({
          show: true,
          title: '구매 실패',
          content: response.message || '구매 처리 중 오류가 발생했습니다.',
          headerTextColor: 'text-red-500',
          remainTime: '방금',
        })
      );
    }
  };

  return {
    isPurchase,
    isFreeDownload,
    timeRemaining,
    downloadExpiredTime,
    setDownloadExpiredTime,
    handleDownload,
    handlePurchaseFiles,
    userPoint: userInfo?.point || 0,
  };
} 