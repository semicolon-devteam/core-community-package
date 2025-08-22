'use client';

import AnimatedPoint from '@atoms/AnimatedPoint';
import LinkWithLoader from '@common/LinkWithLoader';
import { useAppDispatch, useAppSelector } from '@hooks/common';
import { User } from '@model/User';
import UserAvatar from '@molecules/UserAvatar';
import ErrorHandler from '@organisms/ErrorHandler';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { refreshMyInfo } from '@redux/Features/User/userSlice';
import type { RootState } from '@redux/stores';
import { LevelUtil } from '@util/levelUtil';
import Image from "next/image";
import React, { useState } from 'react';

export default function UserProfile({
  userInfo,
  handleLogout,
}: {
  userInfo: User | null;
  handleLogout: () => void;
}) {
  if (!userInfo)
    return (
      <ErrorHandler
        message="사용자 정보를 찾을 수 없습니다."
        routeUrl="prevBoard"
      />
    );

  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useAppDispatch();

  // Redux에서 레벨 테이블 가져오기
  const levelTable = useAppSelector((state: RootState) => state.app.levelTable);

  // 현재 사용자의 레벨 진행률 계산
  // const levelProgress = LevelUtil.getLevelProgress(userInfo.point || 0, levelTable);
  const { nextLevel, requiredPoint, levelUpPercent, isMaxLevel } =
    LevelUtil.getNextLevelInfo(userInfo.point || 0, levelTable);

  // 새로고침 핸들러
  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRefreshing) return;

    setIsRefreshing(true);

    const result = await dispatch(refreshMyInfo());

    if (refreshMyInfo.fulfilled.match(result)) {
      dispatch(
        showToast({
          title: '새로고침 완료',
          content: '사용자 정보가 새로고침되었습니다.',
          headerTextColor: 'text-green-500',
          remainTime: '방금',
        })
      );
    } else {
      console.error('사용자 정보 새로고침 실패:', result.error);
      dispatch(
        showToast({
          title: '새로고침 실패',
          content: '사용자 정보 새로고침에 실패했습니다.',
          headerTextColor: 'text-red-500',
          remainTime: '방금',
        })
      );
    }

    setIsRefreshing(false);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-custom border border-border-default overflow-hidden p-5">
      {/* 상단 프로필 정보 */}
      <div className="flex items-between mb-6">
        {/* 프로필 이미지 */}
        <UserAvatar
          profileImage={userInfo.profileImage}
          size={60}
          isChangeButton={true}
          className="mr-5"
        />

        {/* 사용자 정보 컨테이너 */}
        <div className="flex flex-col flex-grow justify-between">
          {/* 닉네임과 레벨 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Image
                src={`/icons/level/${userInfo.level || 1}.png`}
                alt="level"
                width={36}
                height={36}
                className="w-9 h-9 mr-1"
              />
              <div className="text-text-primary text-base font-medium font-nexon">
                {userInfo.nickname || '사용자'}
              </div>
              <div className="text-text-tertiary text-[13px] font-normal font-nexon ml-1">
                님{/* (Lv.{userInfo.level || 0}) */}
              </div>
            </div>

            {/* 새로고침 아이콘 */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`ml-1 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-200 ${
                isRefreshing
                  ? 'cursor-not-allowed bg-gray-200'
                  : 'cursor-pointer'
              }`}
              title="내 정보 새로고침"
            >
              <svg
                width="8"
                height="8"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform duration-500 ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              >
                <path
                  d="M13.65 2.35C12.18 0.88 10.21 0 8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z"
                  fill="#6B7280"
                />
              </svg>
            </button>
          </div>

          {/* 포인트 정보 */}
          <div className="flex justify-between items-center w-full">
            <div className="text-text-secondary text-[13px] font-normal font-nexon">
              포인트 :
            </div>
            <div className="flex items-center gap-1">
              <AnimatedPoint
                value={userInfo.point || 0}
                className="text-primary text-[13px] font-medium font-nexon"
                color="var(--color-primary)"
                fontSize="13px"
                duration={600}
              />
              <LinkWithLoader
                href="/me/point/purchase"
                className="bg-primary text-white text-[11px] font-medium font-nexon px-2 py-0.5 rounded hover:bg-opacity-90 transition-all duration-200 ml-1 inline-block"
                message="포인트 구매 페이지로 이동합니다."
              >
                구매
              </LinkWithLoader>
            </div>
          </div>
        </div>
      </div>

      {/* 레벨 진행률 바 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-text-tertiary text-sm font-normal font-nexon">
            레벨 진행률
          </div>
          <div className="text-text-tertiary text-xs font-normal font-nexon">
            {requiredPoint > 0 && !isMaxLevel
              ? `다음 레벨까지 ${requiredPoint.toLocaleString()}P`
              : '최고 레벨 달성!'}
          </div>
        </div>
        <div className="h-3 bg-gray-200 rounded-lg flex-grow overflow-hidden relative">
          <div
            className="h-full bg-primary rounded-lg absolute left-0 top-0 transition-all duration-300 ease-out"
            style={{ width: `${levelUpPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center">
            <Image
              src={`/icons/level/${userInfo.level || 1}.png`}
              alt="level"
              width={36}
              height={36}
              className="w-9 h-9"
            />
            <span className="text-text-secondary text-xs font-normal font-nexon">
              Lv.{userInfo.level}
            </span>
          </div>
          {!isMaxLevel && (
            <div className="flex items-center">
              <Image
                src={`/icons/level/${nextLevel}.png`}
                alt="level"
                width={36}
                height={36}
                className="w-9 h-9"
              />
              <span className="text-text-secondary text-xs font-normal font-nexon">
                Lv.{nextLevel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-border-default mb-5"></div>

      {/* 로그아웃 버튼 */}
      <LinkWithLoader
        href="/me"
        className="w-full py-2.5 bg-primary rounded-lg flex justify-center items-center hover:bg-opacity-90 transition-colors mb-2"
      >
        <div className="text-center text-white text-sm font-bold font-nexon">
          마이페이지
        </div>
      </LinkWithLoader>
      <button
        className="w-full py-2.5 bg-text-tertiary rounded-lg flex justify-center items-center hover:bg-opacity-90 transition-colors"
        onClick={handleLogout}
      >
        <div className="text-center text-white text-sm font-bold font-nexon">
          로그아웃
        </div>
      </button>
    </div>
  );
}
