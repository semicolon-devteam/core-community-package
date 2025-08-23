'use client';

import {
    useAppDispatch,
    useAppSelector,
    useRouterWithLoader,
} from '@hooks/common';
import { useState } from 'react';

import { useNoticeQuery } from '@hooks/queries/useNoticeQuery';
import LoginForm from '@molecules/LoginForm';
import NoticeCard from '@molecules/NoticeCard';
import SideBanner from '@molecules/SideBanner';
import UserProfile from '@molecules/UserProfile';

import { useUserLogin } from '@hooks/User/useUserLogin';
import { useDeviceType } from '@hooks/common/useDeviceType';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { toggleMobileMenu } from '@redux/Features/UI/uiSlice';
import {
    logout,
    selectUserInfo,
    type LoginFormData,
} from '@redux/Features/User/userSlice';

import type { Banner } from '../../../types/banner';
import { Skeleton } from '@atoms/Skeleton';

export default function SideBar({ banners }: { banners: Banner[] }) {
  const dispatch = useAppDispatch();
  const { loginInfo, setLoginInfo, handleSubmit } = useUserLogin();
  const { isLoggedIn, userInfo } = useAppSelector(selectUserInfo);
  const { isMobile } = useDeviceType();
  const router = useRouterWithLoader();

  const [isAuthPending, setIsAuthPending] = useState(false);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = ev.target;
    setLoginInfo((prev: LoginFormData) => ({ ...prev, [id]: value }));
  };

  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const { data: notices = [] } = useNoticeQuery();

  const handlePrevNotice = () => {
    setCurrentNoticeIndex(prev => (prev > 0 ? prev - 1 : notices.length - 1));
  };

  const handleNextNotice = () => {
    setCurrentNoticeIndex(prev => (prev < notices.length - 1 ? prev + 1 : 0));
  };

  const onLogin = async () => {
    try {
      setIsAuthPending(true);
      await Promise.resolve(handleSubmit());
    } finally {
      setIsAuthPending(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsAuthPending(true);
      const logoutResult = await dispatch(logout());
      if (logout.fulfilled.match(logoutResult)) {
        dispatch(
          showToast({
            title: '로그아웃',
            content: '로그아웃 되었습니다.',
            headerTextColor: 'text-green-500',
          })
        );

        // 보호된 페이지에서 로그아웃하는 경우 메인 페이지로 리디렉션
        const currentPath = window.location.pathname;
        const protectedPaths = ['/me', '/post/write', '/board/write', '/banners'];
        const needsRedirect = protectedPaths.some(path => currentPath.startsWith(path));
        
        if (needsRedirect) {
          console.log('🔄 보호된 페이지에서 로그아웃 - 메인 페이지로 이동');
          router.replace('/');
        } else {
          // 현재 페이지가 보호되지 않은 페이지라면 새로고침하여 UI 완전 동기화
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      } else {
        dispatch(
          showToast({
            title: '로그아웃 실패',
            content: '로그아웃 중 오류가 발생했습니다.',
            headerTextColor: 'text-red-500',
          })
        );
      }
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error);
      dispatch(
        showToast({
          title: '로그아웃 오류',
          content: '로그아웃 처리 중 예상치 못한 오류가 발생했습니다.',
          headerTextColor: 'text-red-500',
        })
      );
    } finally {
      setIsAuthPending(false);
    }
  };

  return (
    <aside className="col-span-12 lg:col-span-3 flex flex-col gap-4 px-4 md:px-2 lg:px-0 w-full">
      {isLoggedIn ? (
        isAuthPending ? (
          <div className="flex flex-col w-full gap-4 bg-white p-5 rounded-2xl border border-border-default shadow-custom">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <UserProfile userInfo={userInfo} handleLogout={handleLogout} />
        )
      ) : (
        isAuthPending ? (
          <div className="flex flex-col w-full gap-4 bg-white p-5 rounded-2xl border border-border-default shadow-custom">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <LoginForm
            userId={loginInfo.userId || ''}
            passwrd={loginInfo.password || ''}
            handleChange={handleChange}
            handleSubmit={onLogin}
          />
        )
      )}
      {isMobile && (
        <div
          onClick={() => {
            dispatch(toggleMobileMenu());
            router.push('/');
          }}
          className="font-nexon text-sm font-boldw-full h-10 bg-tertiary text-white rounded-md flex items-center justify-center"
        >
          메인으로 이동
        </div>
      )}
      <NoticeCard
        notice={notices[currentNoticeIndex]}
        onPrevClick={handlePrevNotice}
        onNextClick={handleNextNotice}
      />
      <SideBanner banners={banners || []} />
    </aside>
  );
}
