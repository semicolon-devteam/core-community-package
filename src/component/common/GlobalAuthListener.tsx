"use client";

import AuthErrorHandler, { type AuthErrorType } from "@organisms/AuthErrorHandler";
import { useEffect, useState } from "react";

export default function GlobalAuthListener() {
  const [currentError, setCurrentError] = useState<AuthErrorType | null>(null);

  useEffect(() => {
    const handleAuthError = (event: CustomEvent) => {
      const { type } = event.detail;
      console.log('글로벌 인증 에러 감지:', type);
      setCurrentError(type);
    };

    // 글로벌 인증 에러 이벤트 리스너 등록
    window.addEventListener('auth-error', handleAuthError as EventListener);

    return () => {
      window.removeEventListener('auth-error', handleAuthError as EventListener);
    };
  }, []);

  // 에러가 있을 때만 ErrorHandler 렌더링
  if (currentError) {
    return <AuthErrorHandler 
      errorType={currentError}
      autoSignOut={true}
    />;
  }

  return null;
}

// 프로그래매틱하게 인증 에러 트리거하는 유틸리티 함수들
export const triggerAuthError = {
  sessionExpired: () => {
    const event = new CustomEvent('auth-error', { 
      detail: { type: 'SESSION_EXPIRED' } 
    });
    window.dispatchEvent(event);
  },
  
  insufficientPermission: () => {
    const event = new CustomEvent('auth-error', { 
      detail: { type: 'INSUFFICIENT_PERMISSION' } 
    });
    window.dispatchEvent(event);
  },
  
  loginRequired: () => {
    const event = new CustomEvent('auth-error', { 
      detail: { type: 'LOGIN_REQUIRED' } 
    });
    window.dispatchEvent(event);
  },
  
  adminOnly: () => {
    const event = new CustomEvent('auth-error', { 
      detail: { type: 'ADMIN_ONLY' } 
    });
    window.dispatchEvent(event);
  },
  
  tokenInvalid: () => {
    const event = new CustomEvent('auth-error', { 
      detail: { type: 'TOKEN_INVALID' } 
    });
    window.dispatchEvent(event);
  }
}; 