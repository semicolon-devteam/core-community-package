/**
 * @semicolon/community-core
 * Profile Hook - 사용자 프로필 관리 전용 훅
 */

import { useState, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import type { ProfileData, UseProfileReturn } from '../../types/auth.types';

/**
 * Custom hook for handling user profile functionality
 * 사용자 정보 표시, 로그아웃, 프로필 업데이트 기능
 *
 * 사용법:
 * ```tsx
 * import { useProfile } from '@semicolon/community-core';
 *
 * function ProfilePage() {
 *   const { user, profile, signOut, loading, error } = useProfile(
 *     currentUser,
 *     currentProfile,
 *     signOutAction
 *   );
 * }
 * ```
 */
export function useProfile(
  user?: User | null,
  profile?: ProfileData | null,
  signOutAction?: () => Promise<void>,
  onSignOutSuccess?: () => void
): UseProfileReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signOut = useCallback(async () => {
    if (!signOutAction) {
      setError('로그아웃 함수가 제공되지 않았습니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signOutAction();
      onSignOutSuccess?.();
    } catch (err) {
      setError('로그아웃 중 오류가 발생했습니다.');
      console.error('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  }, [signOutAction, onSignOutSuccess]);

  return {
    user: user || null,
    profile: profile || null,
    signOut,
    loading,
    error,
  };
}