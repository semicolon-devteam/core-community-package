"use client";

import { useRouterWithLoader } from "@hooks/common";
import { showToast } from "@redux/Features/Toast/toastSlice";
import { clearUser } from "@redux/Features/User/userSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export type AuthErrorType = 
  | "SESSION_EXPIRED" 
  | "INSUFFICIENT_PERMISSION"
  | "LOGIN_REQUIRED"
  | "ADMIN_ONLY"
  | "TOKEN_INVALID";

interface AuthErrorHandlerProps {
  errorType: AuthErrorType;
  message?: string;
  redirectTo?: string;
  autoSignOut?: boolean;
}

const DEFAULT_MESSAGES: Record<AuthErrorType, string> = {
  SESSION_EXPIRED: "세션이 만료되었습니다. 다시 로그인해주세요.",
  INSUFFICIENT_PERMISSION: "해당 작업을 수행할 권한이 없습니다.",
  LOGIN_REQUIRED: "로그인이 필요한 서비스입니다.",
  ADMIN_ONLY: "관리자만 접근할 수 있습니다.",
  TOKEN_INVALID: "인증 정보가 유효하지 않습니다.",
};

const DEFAULT_REDIRECTS: Record<AuthErrorType, string> = {
  SESSION_EXPIRED: "/",
  INSUFFICIENT_PERMISSION: "/",
  LOGIN_REQUIRED: "/",
  ADMIN_ONLY: "/",
  TOKEN_INVALID: "/",
};

export default function AuthErrorHandler({
  errorType,
  message,
  redirectTo,
  autoSignOut = true
}: AuthErrorHandlerProps) {
  const router = useRouterWithLoader();
  const dispatch = useDispatch();

  useEffect(() => {
    const errorMessage = message || DEFAULT_MESSAGES[errorType];
    const redirectPath = redirectTo || DEFAULT_REDIRECTS[errorType];

    // 토스트 메시지 표시
    dispatch(showToast({
      title: "인증 오류",
      content: errorMessage,
      headerTextColor: "text-red-500",
    }));

    // 자동 로그아웃 처리 (세션 만료, 토큰 무효 등)
    if (autoSignOut && (errorType === "SESSION_EXPIRED" || errorType === "TOKEN_INVALID")) {
      dispatch(clearUser());
      
      // 클라이언트 수파베이스에서도 로그아웃
      const performSignOut = async () => {
        try {
          const { clientSupabase } = await import("@config/Supabase/client");
          await clientSupabase.auth.signOut();
        } catch (error) {
          console.warn("클라이언트 로그아웃 실패:", error);
        }
      };
      performSignOut();
    }

    // 지정된 경로로 리다이렉팅
    router.push(redirectPath);
  }, [errorType, message, redirectTo, autoSignOut, router, dispatch]);

  return null;
}

// 편의 함수들 export
export const AuthErrorHandlers = {
  SessionExpired: (props?: Partial<AuthErrorHandlerProps>) => (
    <AuthErrorHandler errorType="SESSION_EXPIRED" {...props} />
  ),
  InsufficientPermission: (props?: Partial<AuthErrorHandlerProps>) => (
    <AuthErrorHandler errorType="INSUFFICIENT_PERMISSION" {...props} />
  ),
  LoginRequired: (props?: Partial<AuthErrorHandlerProps>) => (
    <AuthErrorHandler errorType="LOGIN_REQUIRED" {...props} />
  ),
  AdminOnly: (props?: Partial<AuthErrorHandlerProps>) => (
    <AuthErrorHandler errorType="ADMIN_ONLY" {...props} />
  ),
  TokenInvalid: (props?: Partial<AuthErrorHandlerProps>) => (
    <AuthErrorHandler errorType="TOKEN_INVALID" {...props} />
  ),
}; 