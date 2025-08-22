'use client';

import { useAppDispatch, useAppSelector } from '@hooks/common';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { selectUserInfo } from '@redux/Features/User/userSlice';
import { getUserLevel, hasLevelPermission, isAdmin } from '@util/authUtil';
import { getCurrentUserFromToken } from '@util/jwtUtil';
import { useCallback, useEffect, useState } from 'react';

export const usePermission = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectUserInfo);
  const reduxUser = userInfo?.userInfo;
  const [jwtUser, setJwtUser] = useState<any>(null);

  // 현재 사용자: Redux 사용자 정보를 우선하되, 없으면 JWT 정보 사용 (극히 예외적 상황)
  const currentUser = reduxUser || jwtUser;
  const userLevel = getUserLevel(currentUser);
  const adminStatus = isAdmin(currentUser);
  const isLoggedIn = userInfo?.isLoggedIn || !!jwtUser;

  // JWT 토큰에서 사용자 정보 가져오기 (Redux에 정보가 없을 때만 대비용)
  useEffect(() => {
    const getJwtUser = async () => {
      // Redux에 사용자 정보가 이미 있으면 JWT 조회 생략
      if (reduxUser) {
        setJwtUser(null);
        return;
      }

      try {
        const tokenUser = await getCurrentUserFromToken();
        setJwtUser(tokenUser);
      } catch (error) {
        // JWT 토큰이 없거나 유효하지 않은 경우
        setJwtUser(null);
      }
    };

    getJwtUser();
  }, [reduxUser]);

  // 권한 체크 함수 - Redux store 정보 우선 사용 (동기 처리)
  const checkPermission = useCallback(
    (requiredLevel?: number) => {
      if (requiredLevel === undefined) return true;

      // Redux store의 사용자 정보가 있으면 우선 사용 (이것이 일반적인 경우)
      if (reduxUser) {
        return hasLevelPermission(reduxUser, requiredLevel);
      }

      // Redux에 정보가 없는 예외적 상황에서만 JWT 사용
      if (jwtUser) {
        console.warn(
          'Redux store에 사용자 정보가 없어 JWT 토큰 정보를 사용합니다.'
        );
        return hasLevelPermission(jwtUser, requiredLevel);
      }

      // 사용자 정보가 전혀 없는 경우
      return requiredLevel === 0;
    },
    [reduxUser, jwtUser]
  );

  // 권한이 없는 경우 토스트 메시지 표시
  const showAccessDeniedToast = useCallback(() => {
    dispatch(
      showToast({
        title: '접근 권한이 없습니다.',
        content: '해당 메뉴에 접근할 권한이 없습니다.',
        headerTextColor: 'text-red-500',
      })
    );
  }, [dispatch]);

  return {
    checkPermission,
    showAccessDeniedToast,
    userLevel,
    isAdmin: adminStatus,
    isLoggedIn,
    currentUser,
  };
};
