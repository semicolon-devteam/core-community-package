/**
 * @semicolon/community-core
 * Login Hook - 로그인 기능 전용 훅
 */

import { useState } from 'react';
import type { LoginCredentials, UseLoginReturn } from '../../types/auth.types';

/**
 * Custom hook for handling login functionality
 * Next.js Server Actions와 함께 사용되거나 커스텀 로그인 함수와 함께 사용
 *
 * 사용법:
 * ```tsx
 * import { useLogin } from '@semicolon/community-core';
 *
 * function LoginForm() {
 *   const { login, loginWithOAuth, loading, error } = useLogin();
 *
 *   const handleSubmit = async (credentials) => {
 *     await login(credentials);
 *   };
 * }
 * ```
 */
export function useLogin(
  loginAction?: (email: string, password: string) => Promise<{ error?: string }>,
  loginWithOAuthAction?: (provider: 'google' | 'github' | 'kakao') => Promise<{ error?: string; url?: string }>,
  onSuccess?: () => void,
  initialError?: string
): UseLoginReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);

  const clearError = () => setError(null);

  const login = async ({ email, password }: LoginCredentials) => {
    if (!loginAction) {
      setError('로그인 함수가 제공되지 않았습니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await loginAction(email, password);

      if (result.error) {
        setError(result.error);
      } else {
        onSuccess?.();
      }
    } catch (err) {
      setError('예기치 않은 오류가 발생했습니다.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loginWithOAuth = async (provider: 'google' | 'github' | 'kakao') => {
    if (!loginWithOAuthAction) {
      setError('OAuth 로그인 함수가 제공되지 않았습니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await loginWithOAuthAction(provider);

      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      setError('OAuth 로그인 중 오류가 발생했습니다.');
      console.error('OAuth login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loginWithOAuth,
    loading,
    error,
    clearError,
  };
}