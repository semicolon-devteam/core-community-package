/**
 * @semicolon/community-core
 * Register Hook - 회원가입 기능 전용 훅
 */

import { useState, useCallback } from 'react';
import type { RegisterData, UseRegisterReturn } from '../../types/auth.types';

/**
 * Custom hook for handling registration functionality
 * 닉네임 중복 확인, 비밀번호 검증, OAuth 회원가입 지원
 *
 * 사용법:
 * ```tsx
 * import { useRegister } from '@semicolon/community-core';
 *
 * function RegisterForm() {
 *   const {
 *     register,
 *     checkNickname,
 *     nicknameStatus,
 *     loading,
 *     error,
 *     success
 *   } = useRegister(signUpAction, loginWithOAuthAction);
 * }
 * ```
 */
export function useRegister(
  signUpAction?: (email: string, password: string, metadata?: Record<string, string>) => Promise<{ error?: string }>,
  loginWithOAuthAction?: (provider: 'google' | 'github' | 'kakao') => Promise<{ error?: string; url?: string }>,
  nicknameCheckApi?: string,
  onSuccess?: () => void,
  initialError?: string
): UseRegisterReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);
  const [success, setSuccess] = useState(false);

  // Nickname validation state
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [checkingNickname, setCheckingNickname] = useState(false);

  const clearError = () => setError(null);

  const resetNicknameStatus = () => {
    setNicknameAvailable(null);
    setNicknameError(null);
  };

  const validatePassword = (password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) {
      return '비밀번호가 일치하지 않습니다.';
    }
    if (password.length < 6) {
      return '비밀번호는 최소 6자 이상이어야 합니다.';
    }
    return null;
  };

  const checkNickname = useCallback(async (nickname: string) => {
    if (!nickname || nickname.trim().length < 2) {
      setNicknameError('닉네임은 최소 2자 이상이어야 합니다.');
      setNicknameAvailable(false);
      return;
    }

    if (!nicknameCheckApi) {
      setNicknameError('닉네임 확인 API가 설정되지 않았습니다.');
      setNicknameAvailable(false);
      return;
    }

    setCheckingNickname(true);
    setNicknameError(null);

    try {
      const response = await fetch(nicknameCheckApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setNicknameAvailable(data.available);
        if (!data.available) {
          setNicknameError(data.message || '이미 사용 중인 닉네임입니다.');
        }
      } else {
        setNicknameError(data.error || '닉네임 확인 중 오류가 발생했습니다.');
        setNicknameAvailable(false);
      }
    } catch (err) {
      setNicknameError('네트워크 오류가 발생했습니다.');
      setNicknameAvailable(false);
      console.error('Nickname check error:', err);
    } finally {
      setCheckingNickname(false);
    }
  }, [nicknameCheckApi]);

  const register = async (data: RegisterData) => {
    if (!signUpAction) {
      setError('회원가입 함수가 제공되지 않았습니다.');
      return;
    }

    setLoading(true);
    setError(null);

    // Validate nickname availability
    if (nicknameAvailable === null) {
      setError('닉네임 중복 확인을 해주세요.');
      setLoading(false);
      return;
    }

    if (!nicknameAvailable) {
      setError('사용할 수 없는 닉네임입니다.');
      setLoading(false);
      return;
    }

    // Validate password
    const passwordError = validatePassword(data.password, data.confirmPassword);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      const result = await signUpAction(
        data.email,
        data.password,
        {
          login_id: data.login_id,
          nickname: data.nickname,
        }
      );

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        onSuccess?.();
      }
    } catch (err) {
      setError('예기치 않은 오류가 발생했습니다.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const registerWithOAuth = async (provider: 'google' | 'github' | 'kakao') => {
    if (!loginWithOAuthAction) {
      setError('OAuth 회원가입 함수가 제공되지 않았습니다.');
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
      setError('예기치 않은 오류가 발생했습니다.');
      console.error('OAuth registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    registerWithOAuth,
    checkNickname,
    nicknameStatus: {
      available: nicknameAvailable,
      error: nicknameError,
      checking: checkingNickname,
    },
    loading,
    error,
    success,
    clearError,
    resetNicknameStatus,
  };
}