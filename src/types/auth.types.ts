/**
 * @semicolon/community-core
 * Auth 타입 정의 - Supabase 기반 인증 시스템
 */

import type { User, Session } from '@supabase/supabase-js';

// =============================================================================
// Core Auth Types
// =============================================================================

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export interface ActionResponse<T = unknown> {
  data?: T;
  error?: string;
}

// =============================================================================
// Login Types
// =============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UseLoginReturn {
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithOAuth: (provider: 'google' | 'github' | 'kakao') => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

// =============================================================================
// Register Types
// =============================================================================

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  login_id: string;
  nickname: string;
}

export interface NicknameCheckResult {
  available: boolean | null;
  error: string | null;
  checking: boolean;
}

export interface UseRegisterReturn {
  register: (data: RegisterData) => Promise<void>;
  registerWithOAuth: (provider: 'google' | 'github' | 'kakao') => Promise<void>;
  checkNickname: (nickname: string) => Promise<void>;
  nicknameStatus: NicknameCheckResult;
  loading: boolean;
  error: string | null;
  success: boolean;
  clearError: () => void;
  resetNicknameStatus: () => void;
}

// =============================================================================
// Profile Types
// =============================================================================

export interface ProfileData {
  nickname?: string;
  email?: string;
  login_id?: string;
}

export interface UseProfileReturn {
  user: User | null;
  profile: ProfileData | null;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

// =============================================================================
// Auth Context Types
// =============================================================================

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// =============================================================================
// Supabase Auth Types
// =============================================================================

export interface UseSupabaseAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, metadata?: Record<string, string>) => Promise<{ error: Error | null }>;
  signInWithOAuth: (provider: 'google' | 'github' | 'kakao') => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
}

// =============================================================================
// Permission Types
// =============================================================================

export interface UsePermissionReturn {
  hasPermission: boolean;
  loading: boolean;
}

// =============================================================================
// Auth Provider Props
// =============================================================================

export interface AuthProviderProps {
  children: React.ReactNode;
}