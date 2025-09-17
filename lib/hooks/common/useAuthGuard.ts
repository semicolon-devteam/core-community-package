'use client';

import { useAppSelector } from '@hooks/common';
import { selectUserInfo } from '@redux/Features/User/userSlice';

// AuthErrorType 정의
export type AuthErrorType =
  | 'NOT_LOGGED_IN'
  | 'INSUFFICIENT_LEVEL'
  | 'ADMIN_ONLY'
  | 'NO_PERMISSION';
import {
  hasBoardPermission,
  hasLevelPermission,
  isAdmin,
} from '@util/authUtil';
import { getCurrentUserFromToken, isTokenExpired } from '@util/jwtUtil';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface AuthGuardOptions {
  requiredLevel?: number;
  adminOnly?: boolean;
  boardPermissions?: {
    writeLevel?: number;
    readLevel?: number;
  };
  redirectOnError?: string;
  showToastOnError?: boolean;
}

export interface AuthGuardResult {
  isAuthenticated: boolean;
  hasPermission: boolean;
  isLoading: boolean;
  user: any;
  errorType: AuthErrorType | null;
  checkPermissionAsync: () => Promise<boolean>;
}

export const useAuthGuard = (
  options: AuthGuardOptions = {}
): AuthGuardResult => {
  const userState = useAppSelector(selectUserInfo);
  const { userInfo, isLoggedIn } = userState;
  const [isLoading, setIsLoading] = useState(true);
  const [errorType, setErrorType] = useState<AuthErrorType | null>(null);
  const [tokenUser, setTokenUser] = useState<any>(null);

  // 무한 재실행 방지를 위한 ref
  const isCheckingRef = useRef(false);
  const lastTokenUserRef = useRef<string | null>(null);

  // JWT 토큰 기반 인증 상태 확인 및 자동 정리
  const checkTokenAuth = useCallback(async () => {
    try {
      // 토큰 유효성 검증 및 자동 정리 함수 사용
      const { validateAndCleanToken } = await import('@util/jwtUtil');
      const tokenPayload = await validateAndCleanToken();

      if (!tokenPayload) {
        setErrorType('LOGIN_REQUIRED');
        return false;
      }

      // 토큰 사용자가 실제로 변경된 경우에만 상태 업데이트
      const tokenUserString = JSON.stringify(tokenPayload);
      if (lastTokenUserRef.current !== tokenUserString) {
        lastTokenUserRef.current = tokenUserString;
        setTokenUser(tokenPayload);
      }

      return true;
    } catch (error) {
      console.error('토큰 인증 확인 실패:', error);
      setErrorType('TOKEN_INVALID');
      
      // 오류 시에도 만료된 토큰 정리
      const { removeExpiredTokenFromCookie } = await import('@util/jwtUtil');
      removeExpiredTokenFromCookie();
      return false;
    }
  }, []);

  // 권한 체크 로직 - Redux store 정보 우선 사용
  const checkPermissions = useCallback(
    (user: any) => {
      // 관리자 전용 체크
      if (options.adminOnly && !isAdmin(user)) {
        setErrorType('ADMIN_ONLY');
        return false;
      }

      // 레벨 권한 체크 - 동기 처리로 변경 (Redux store 정보 사용)
      if (
        options.requiredLevel !== undefined &&
        !hasLevelPermission(user, options.requiredLevel)
      ) {
        setErrorType('INSUFFICIENT_PERMISSION');
        return false;
      }

      // 게시판 권한 체크
      if (options.boardPermissions) {
        const writeLevel = options.boardPermissions.writeLevel;
        const readLevel = options.boardPermissions.readLevel;

        if (
          writeLevel !== undefined &&
          !hasBoardPermission(user, writeLevel, true)
        ) {
          setErrorType('INSUFFICIENT_PERMISSION');
          return false;
        }

        if (
          readLevel !== undefined &&
          !hasBoardPermission(user, readLevel, true)
        ) {
          setErrorType('INSUFFICIENT_PERMISSION');
          return false;
        }
      }

      return true;
    },
    [options.adminOnly, options.requiredLevel, options.boardPermissions]
  );

  // 비동기 권한 체크 (수동 호출용) - 의존성 최소화
  const checkPermissionAsync = useCallback(async (): Promise<boolean> => {
    // 이미 체크 중이면 중복 실행 방지
    if (isCheckingRef.current) {
      return false;
    }

    isCheckingRef.current = true;
    setIsLoading(true);
    setErrorType(null);

    try {
      // 1. Redux store에 사용자 정보가 있으면 우선 사용
      if (isLoggedIn && userInfo) {
        const hasPermission = checkPermissions(userInfo);
        return hasPermission;
      }

      // 2. Redux에 정보가 없는 경우에만 토큰 기반 인증 확인 (예외적 상황)
      const isTokenValid = await checkTokenAuth();
      if (!isTokenValid) {
        return false;
      }

      // 3. 토큰 사용자 정보로 권한 체크 (극히 예외적 상황)
      if (!tokenUser) {
        setErrorType('LOGIN_REQUIRED');
        return false;
      }

      console.warn(
        'Redux store에 사용자 정보가 없어 JWT 토큰 정보로 권한 체크를 수행합니다.'
      );
      const hasPermission = checkPermissions(tokenUser);
      return hasPermission;
    } catch (error) {
      console.error('권한 체크 실패:', error);
      setErrorType('TOKEN_INVALID');
      return false;
    } finally {
      setIsLoading(false);
      isCheckingRef.current = false;
    }
  }, [checkTokenAuth, checkPermissions, isLoggedIn, userInfo, tokenUser]);

  // 초기 권한 체크 (컴포넌트 마운트 시에만) - 의존성 제거
  useEffect(() => {
    checkPermissionAsync();
  }, []); // 빈 의존성 배열로 한 번만 실행

  // Redux 사용자 정보 변경 시 재체크 - 동기 처리로 변경
  useEffect(() => {
    if (isLoggedIn && userInfo && !isCheckingRef.current) {
      const hasPermission = checkPermissions(userInfo);
      if (!hasPermission) {
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setErrorType(null);
      }
    }
  }, [isLoggedIn, userInfo, checkPermissions]);

  // Redux 정보를 우선하되, 없으면 토큰 사용자 정보 사용
  const currentUser = userInfo || tokenUser;
  const isAuthenticated = isLoggedIn && !!currentUser;
  const hasPermission = isAuthenticated && !errorType;

  return {
    isAuthenticated,
    hasPermission,
    isLoading,
    user: currentUser,
    errorType,
    checkPermissionAsync,
  };
};

// 편의 Hook들
export const useAdminGuard = (options?: Omit<AuthGuardOptions, 'adminOnly'>) =>
  useAuthGuard({ ...options, adminOnly: true });

export const useLevelGuard = (
  requiredLevel: number,
  options?: Omit<AuthGuardOptions, 'requiredLevel'>
) => useAuthGuard({ ...options, requiredLevel });

export const useBoardWriteGuard = (
  writeLevel: number,
  options?: Omit<AuthGuardOptions, 'boardPermissions'>
) =>
  useAuthGuard({
    ...options,
    boardPermissions: { writeLevel },
  });
