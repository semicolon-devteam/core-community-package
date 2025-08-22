"use client";

import { useAppDispatch, useAppSelector } from "@hooks/common";
import { useGlobalLoader } from "@hooks/common/useGlobalLoader";
import { useRouterWithLoader } from "@hooks/common/useRouterWithLoader";
import { showToast } from "@redux/Features/Toast/toastSlice";
import type { LoginFormData } from "@redux/Features/User/userSlice";
import { autoLogin, login, logout, selectUserInfo } from "@redux/Features/User/userSlice";
import { useCallback } from "react";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserInfo);
  const { withLoader, showLoader, hideLoader } = useGlobalLoader();
  const router = useRouterWithLoader();

  // 로딩과 함께 로그인 처리
  const loginWithLoader = useCallback(async (loginData: LoginFormData) => {
    return withLoader(async () => {
      const result = await dispatch(login(loginData));
      
      if (login.fulfilled.match(result)) {
        dispatch(showToast({
          title: "로그인 성공",
          content: `환영합니다, ${result.payload.nickname}님!`,
          headerTextColor: "text-green-500",
        }));
        return { success: true, user: result.payload };
      } else {
        const errorMessage = result.payload?.result || "로그인에 실패했습니다.";
        dispatch(showToast({
          title: "로그인 실패",
          content: errorMessage,
          headerTextColor: "text-red-500",
        }));
        return { success: false, error: errorMessage };
      }
    });
  }, [dispatch, withLoader]);

  // 로딩과 함께 로그아웃 처리
  const logoutWithLoader = useCallback(async () => {
    return withLoader(async () => {
      const result = await dispatch(logout());
      
      if (logout.fulfilled.match(result)) {
        dispatch(showToast({
          title: "로그아웃 완료",
          content: "안전하게 로그아웃되었습니다.",
          headerTextColor: "text-blue-500",
        }));
        
        // 메인 페이지로 이동
        router.push("/");
        return { success: true };
      } else {
        const errorMessage = result.payload?.result || "로그아웃에 실패했습니다.";
        dispatch(showToast({
          title: "로그아웃 실패",
          content: errorMessage,
          headerTextColor: "text-red-500",
        }));
        return { success: false, error: errorMessage };
      }
    });
  }, [dispatch, withLoader, router]);

  // 자동 로그인 (초기화 시)
  const initializeAuth = useCallback(async () => {
    try {
      showLoader("인증 정보를 확인하는 중입니다...");
      const result = await dispatch(autoLogin());
      
      if (autoLogin.fulfilled.match(result)) {
        // console.log("자동 로그인 성공:", result.payload.nickname);
        return { success: true, user: result.payload };
      } else {
        // console.log("자동 로그인 실패 또는 세션 없음");
        return { success: false, error: result.payload?.result };
      }
    } finally {
      hideLoader();
    }
  }, [dispatch, showLoader, hideLoader]);

  // 세션 상태 확인 (수동 호출용)
  const checkSession = useCallback(async () => {
    try {
      const { getCurrentUserFromToken, isTokenExpired } = await import("@util/jwtUtil");
      const tokenPayload = await getCurrentUserFromToken();
      
      if (!tokenPayload) {
        return { valid: false, reason: "NO_TOKEN" };
      }
      
      if (isTokenExpired(tokenPayload)) {
        return { valid: false, reason: "EXPIRED" };
      }
      
      return { valid: true, user: tokenPayload };
    } catch (error) {
      console.error("세션 확인 실패:", error);
      return { valid: false, reason: "ERROR" };
    }
  }, []);

  // 권한 체크와 함께 페이지 이동
  const navigateWithAuth = useCallback(async (
    path: string, 
    requiredLevel?: number,
    adminOnly?: boolean
  ) => {
    const sessionCheck = await checkSession();
    
    if (!sessionCheck.valid) {
      dispatch(showToast({
        title: "로그인 필요",
        content: "로그인이 필요한 서비스입니다.",
        headerTextColor: "text-orange-500",
      }));
      return false;
    }

    // 권한 체크 로직 추가 가능
    if (adminOnly && sessionCheck.user && !sessionCheck.user.is_admin) {
      dispatch(showToast({
        title: "권한 부족",
        content: "관리자만 접근할 수 있습니다.",
        headerTextColor: "text-red-500",
      }));
      return false;
    }

    router.push(path);
    return true;
  }, [checkSession, dispatch, router]);

  return {
    // 상태
    userState,
    isLoggedIn: userState.isLoggedIn,
    user: userState.userInfo,
    error: userState.error,
    
    // 액션들
    loginWithLoader,
    logoutWithLoader,
    initializeAuth,
    checkSession,
    navigateWithAuth,
    
    // 편의 함수들
    isAdmin: () => 
      (userState.userInfo?.permissionType === 'admin' || 
      userState.userInfo?.permissionType === 'super_admin') &&
      (userState.userInfo?.level ?? 0) >= 99,
    isUser: () => userState.isLoggedIn && userState.userInfo,
  };
}; 