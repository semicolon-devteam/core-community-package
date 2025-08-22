'use client';

import { useRouterWithLoader } from '@hooks/common';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function ErrorHandler({
  message,
  routeUrl = 'backward',
}: {
  message: string;
  routeUrl?: string | 'prevBoard' | 'backward';
}) {
  const router = useRouterWithLoader();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      showToast({
        title: '오류가 발생했습니다.',
        content: message,
        headerTextColor: 'text-red-500',
      })
    );

    if (routeUrl === 'backward') {
      router.back();
    } else if (routeUrl === 'prevBoard') {
      router.push(sessionStorage.getItem('previousBoardPage') || '/');
    } else {
      router.push(routeUrl);
    }
  }, []);
  return null;
}
