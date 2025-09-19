/**
 * @semicolon/community-core
 * Auth Provider - Supabase 인증 상태 관리 Provider
 */

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session, SupabaseClient } from '@supabase/supabase-js';
import type { AuthContextType, AuthProviderProps } from '../types/auth.types';

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

/**
 * Auth Provider 컴포넌트
 * Supabase 인증 상태를 관리하고 자동으로 동기화
 *
 * 사용법:
 * ```tsx
 * import { AuthProvider } from '@semicolon/community-core';
 * import { createClient } from '@supabase/supabase-js';
 *
 * const supabase = createClient(url, key);
 *
 * function App() {
 *   return (
 *     <AuthProvider
 *       supabaseClient={supabase}
 *       onSignedIn={(user) => router.push('/dashboard')}
 *       onSignedOut={() => router.push('/')}
 *     >
 *       {children}
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
interface AuthProviderWithSupabaseProps extends AuthProviderProps {
  supabaseClient: SupabaseClient;
  onSignedIn?: (user: User) => void;
  onSignedOut?: () => void;
  onTokenRefreshed?: (session: Session) => void;
  onUserUpdated?: (user: User) => void;
}

export function AuthProvider({
  children,
  supabaseClient,
  onSignedIn,
  onSignedOut,
  onTokenRefreshed,
  onUserUpdated,
}: AuthProviderWithSupabaseProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 세션 가져오기
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // 이벤트에 따른 처리
      if (event === 'SIGNED_IN' && session?.user) {
        onSignedIn?.(session.user);
      } else if (event === 'SIGNED_OUT') {
        onSignedOut?.();
      } else if (event === 'TOKEN_REFRESHED' && session) {
        onTokenRefreshed?.(session);
      } else if (event === 'USER_UPDATED' && session?.user) {
        onUserUpdated?.(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabaseClient, onSignedIn, onSignedOut, onTokenRefreshed, onUserUpdated]);

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Hook
 * Auth Context를 사용하기 위한 커스텀 훅
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}