"use client";

import { useGlobalLoader } from "@hooks/common";
import type { AuthGuardOptions } from "@hooks/common/useAuthGuard";
import { useAuthGuard } from "@hooks/common/useAuthGuard";
import AuthErrorHandler from "@organisms/AuthErrorHandler";
import { useEffect, useRef } from "react";

interface AuthGuardProps extends AuthGuardOptions {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export default function AuthGuard({ 
  children, 
  fallback,
  loadingComponent,
  ...authOptions 
}: AuthGuardProps) {
  const { 
    isAuthenticated, 
    hasPermission, 
    isLoading, 
    errorType 
  } = useAuthGuard(authOptions);
  
  const { showLoader, hideLoader } = useGlobalLoader();
  
  // 무한 재실행 방지를 위한 ref
  const lastLoadingStateRef = useRef<boolean | null>(null);

  // 로딩 상태 글로벌 로더와 동기화 - 의존성 최소화
  useEffect(() => {
    // 로딩 상태가 실제로 변경된 경우에만 처리
    if (lastLoadingStateRef.current !== isLoading) {
      lastLoadingStateRef.current = isLoading;
      
      if (isLoading) {
        showLoader("권한을 확인하는 중입니다...");
      } else {
        hideLoader();
      }
    }

    return () => {
      hideLoader();
    };
  }, [isLoading]); // showLoader, hideLoader 의존성 제거

  // 로딩 중
  if (isLoading) {
    return loadingComponent || null;
  }

  // 에러 발생 시
  if (errorType) {
    return <AuthErrorHandler 
      errorType={errorType}
      redirectTo={authOptions.redirectOnError}
    />;
  }

  // 권한 없음
  if (!hasPermission) {
    return fallback || <AuthErrorHandler 
      errorType="INSUFFICIENT_PERMISSION"
      redirectTo={authOptions.redirectOnError}
    />;
  }

  // 모든 검증 통과
  return <>{children}</>;
}

// 간단한 Login 체크만 하는 컴포넌트
interface SimpleAuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LoginGuard = ({ children, fallback }: SimpleAuthGuardProps) => (
  <AuthGuard fallback={fallback}>
    {children}
  </AuthGuard>
); 