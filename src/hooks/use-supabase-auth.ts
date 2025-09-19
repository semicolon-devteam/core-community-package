/**
 * @semicolon/community-core
 * Supabase 인증 Hook - 클라이언트 컴포넌트에서 인증 기능 사용
 */

'use client';

import { useEffect, useState } from 'react';
import type { User, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseAuthClientAdapter } from '../services/adapters/auth.client.adapter';
import { useAuth } from '../providers/auth-provider';
import type { UseSupabaseAuthReturn, UsePermissionReturn } from '../types/auth.types';

/**
 * Supabase 인증 Hook
 * 클라이언트 컴포넌트에서 인증 기능을 사용하기 위한 훅
 *
 * 사용법:
 * ```tsx
 * import { useSupabaseAuth } from '@semicolon/community-core';
 * import { createClient } from '@supabase/supabase-js';
 *
 * const supabase = createClient(url, key);
 *
 * function LoginComponent() {
 *   const { signIn, signUp, signOut, user, isAuthenticated } = useSupabaseAuth(supabase);
 *
 *   const handleLogin = async () => {
 *     const { error } = await signIn('email@example.com', 'password');
 *     if (error) console.error(error);
 *   };
 * }
 * ```
 */
export function useSupabaseAuth(supabaseClient: SupabaseClient): UseSupabaseAuthReturn {
  const { user, loading, signOut } = useAuth();
  const [authAdapter] = useState(() => new SupabaseAuthClientAdapter(supabaseClient));

  const signIn = async (email: string, password: string) => {
    const result = await authAdapter.signInWithPassword(email, password);
    return {
      error: result.error ? new Error(result.error.message) : null
    };
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, string>) => {
    const result = await authAdapter.signUp(email, password, metadata);
    return {
      error: result.error ? new Error(result.error.message) : null
    };
  };

  const signInWithOAuth = async (provider: 'google' | 'github' | 'kakao') => {
    const result = await authAdapter.signInWithOAuth(provider);
    if (result.url) {
      window.location.href = result.url;
    }
    return {
      error: result.error ? new Error(result.error.message) : null
    };
  };

  const resetPassword = async (email: string) => {
    const result = await authAdapter.resetPassword(email);
    return {
      error: result.error ? new Error(result.error.message) : null
    };
  };

  const updatePassword = async (newPassword: string) => {
    const result = await authAdapter.updatePassword(newPassword);
    return {
      error: result.error ? new Error(result.error.message) : null
    };
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
    resetPassword,
    updatePassword,
  };
}

/**
 * 권한 확인 Hook
 *
 * 사용법:
 * ```tsx
 * const { hasPermission, loading } = usePermission('posts', 'create');
 * if (hasPermission) {
 *   return <CreatePostButton />;
 * }
 * ```
 */
export function usePermission(resource: string, action: string): UsePermissionReturn {
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      if (!user) {
        setHasPermission(false);
        setLoading(false);
        return;
      }

      // 여기에 권한 확인 로직 구현
      // 예: Supabase RLS나 별도의 권한 테이블 조회
      // 지금은 기본적으로 로그인한 사용자는 모두 권한이 있다고 가정
      setHasPermission(true);
      setLoading(false);
    };

    checkPermission();
  }, [user, resource, action]);

  return { hasPermission, loading };
}