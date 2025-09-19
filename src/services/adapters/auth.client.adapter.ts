/**
 * @semicolon/community-core
 * Supabase Auth Client Adapter - 클라이언트 전용 인증 어댑터
 */

'use client';

import type { User, Session, SupabaseClient } from '@supabase/supabase-js';
import type { AuthError, AuthResponse } from '../../types/auth.types';

/**
 * 클라이언트 전용 Supabase Auth 어댑터
 * 브라우저 환경에서만 사용
 *
 * 사용 시 Supabase client를 외부에서 주입받아 사용
 */
export class SupabaseAuthClientAdapter {
  private client: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.client = supabaseClient;
  }

  /**
   * 이메일/비밀번호로 로그인
   */
  async signInWithPassword(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          user: null,
          session: null,
          error: {
            message: error.message,
            status: error.status,
          },
        };
      }

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: {
          message: error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.',
        },
      };
    }
  }

  /**
   * 이메일/비밀번호로 회원가입
   */
  async signUp(email: string, password: string, metadata?: Record<string, string>): Promise<AuthResponse> {
    try {
      const { data, error } = await this.client.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        return {
          user: null,
          session: null,
          error: {
            message: error.message,
            status: error.status,
          },
        };
      }

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: {
          message: error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.',
        },
      };
    }
  }

  /**
   * OAuth 프로바이더로 로그인
   */
  async signInWithOAuth(provider: 'google' | 'github' | 'kakao') {
    try {
      const { data, error } = await this.client.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return {
          url: null,
          error: {
            message: error.message,
          },
        };
      }

      return {
        url: data.url,
        error: null,
      };
    } catch (error) {
      return {
        url: null,
        error: {
          message: error instanceof Error ? error.message : 'OAuth 로그인 중 오류가 발생했습니다.',
        },
      };
    }
  }

  /**
   * 로그아웃
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await this.client.auth.signOut();

      if (error) {
        return {
          error: {
            message: error.message,
          },
        };
      }

      return { error: null };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : '로그아웃 중 오류가 발생했습니다.',
        },
      };
    }
  }

  /**
   * 현재 사용자 정보 가져오기
   */
  async getUser(): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data: { user }, error } = await this.client.auth.getUser();

      if (error) {
        return {
          user: null,
          error: {
            message: error.message,
            status: error.status,
          },
        };
      }

      return { user, error: null };
    } catch (error) {
      return {
        user: null,
        error: {
          message: error instanceof Error ? error.message : '사용자 정보를 가져오는 중 오류가 발생했습니다.',
        },
      };
    }
  }

  /**
   * 현재 세션 가져오기
   */
  async getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    try {
      const { data: { session }, error } = await this.client.auth.getSession();

      if (error) {
        return {
          session: null,
          error: {
            message: error.message,
          },
        };
      }

      return { session, error: null };
    } catch (error) {
      return {
        session: null,
        error: {
          message: error instanceof Error ? error.message : '세션 정보를 가져오는 중 오류가 발생했습니다.',
        },
      };
    }
  }

  /**
   * 비밀번호 재설정 이메일 전송
   */
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await this.client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return {
          error: {
            message: error.message,
          },
        };
      }

      return { error: null };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : '비밀번호 재설정 이메일 전송 중 오류가 발생했습니다.',
        },
      };
    }
  }

  /**
   * 비밀번호 업데이트
   */
  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await this.client.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return {
          error: {
            message: error.message,
          },
        };
      }

      return { error: null };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : '비밀번호 변경 중 오류가 발생했습니다.',
        },
      };
    }
  }
}