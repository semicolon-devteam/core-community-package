import BaseService from './baseService';
import type { CommonResponse } from '../types/common';
import type { User } from '../types/User';

/**
 * Authentication service interfaces and types
 */
export interface AuthServiceOptions {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
}

export interface LoginCredentials {
  userId: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  userId: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  email?: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  agreeToMarketing?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  isFirstLogin?: boolean;
  requiredActions?: string[];
}

export interface PasswordResetData {
  email?: string;
  userId?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export interface SessionInfo {
  isValid: boolean;
  user?: User;
  expiresAt?: string;
  permissions?: string[];
  level?: number;
  isAdmin?: boolean;
}

/**
 * Authentication Service Class
 * Handles all authentication-related operations including login, logout,
 * registration, password management, and session validation
 */
export class AuthService extends BaseService {
  constructor(options?: AuthServiceOptions) {
    super(options?.baseUrl || '/api/auth', options?.defaultHeaders);
  }

  /**
   * User login
   */
  async login(credentials: LoginCredentials): Promise<CommonResponse<AuthResponse>> {
    return this.postMini<AuthResponse, LoginCredentials>(
      '/login',
      credentials,
      '로그인 중...'
    );
  }

  /**
   * User logout
   */
  async logout(): Promise<CommonResponse<void>> {
    return this.postMini<void, object>('/logout', {}, '로그아웃 중...');
  }

  /**
   * User registration
   */
  async register(data: RegisterData): Promise<CommonResponse<AuthResponse>> {
    return this.postMini<AuthResponse, RegisterData>(
      '/register',
      data,
      '회원가입 처리 중...'
    );
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<CommonResponse<AuthTokens>> {
    return this.postSilent<AuthTokens, { refreshToken: string }>(
      '/refresh',
      { refreshToken }
    );
  }

  /**
   * Validate current session
   */
  async validateSession(): Promise<CommonResponse<SessionInfo>> {
    return this.getSilent<SessionInfo>('/validate');
  }

  /**
   * Get current user info (from token)
   */
  async getCurrentUser(): Promise<CommonResponse<User>> {
    return this.getMini<User>('/me', '사용자 정보 확인 중...');
  }

  /**
   * Send password reset email
   */
  async requestPasswordReset(data: PasswordResetData): Promise<CommonResponse<void>> {
    return this.postMini<void, PasswordResetData>(
      '/password-reset/request',
      data,
      '비밀번호 재설정 요청 중...'
    );
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string, 
    newPassword: string,
    newPasswordConfirm: string
  ): Promise<CommonResponse<void>> {
    return this.postMini<void, { 
      token: string; 
      newPassword: string; 
      newPasswordConfirm: string; 
    }>(
      '/password-reset/confirm',
      { token, newPassword, newPasswordConfirm },
      '비밀번호 재설정 중...'
    );
  }

  /**
   * Change password (authenticated user)
   */
  async changePassword(data: PasswordChangeData): Promise<CommonResponse<void>> {
    return this.putMini<void, PasswordChangeData>(
      '/password',
      data,
      '비밀번호 변경 중...'
    );
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(email?: string): Promise<CommonResponse<void>> {
    return this.postMini<void, { email?: string }>(
      '/verify-email/send',
      { email },
      '인증 메일 발송 중...'
    );
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<CommonResponse<void>> {
    return this.postMini<void, { token: string }>(
      '/verify-email/confirm',
      { token },
      '이메일 인증 중...'
    );
  }

  /**
   * Check if user ID is available
   */
  async checkUserIdAvailability(userId: string): Promise<CommonResponse<{ available: boolean }>> {
    return this.get<{ available: boolean }>('/check/userid', {
      params: { userId }
    });
  }

  /**
   * Check if nickname is available
   */
  async checkNicknameAvailability(nickname: string): Promise<CommonResponse<{ available: boolean }>> {
    return this.get<{ available: boolean }>('/check/nickname', {
      params: { nickname }
    });
  }

  /**
   * Check if email is available
   */
  async checkEmailAvailability(email: string): Promise<CommonResponse<{ available: boolean }>> {
    return this.get<{ available: boolean }>('/check/email', {
      params: { email }
    });
  }

  /**
   * Get user sessions (for security management)
   */
  async getUserSessions(): Promise<CommonResponse<Array<{
    id: string;
    deviceInfo: string;
    ipAddress: string;
    lastActivity: string;
    isCurrent: boolean;
  }>>> {
    return this.get<any>('/sessions');
  }

  /**
   * Revoke specific session
   */
  async revokeSession(sessionId: string): Promise<CommonResponse<void>> {
    return this.deleteMini<void>(`/sessions/${sessionId}`, '세션 해제 중...');
  }

  /**
   * Revoke all sessions except current
   */
  async revokeAllSessions(): Promise<CommonResponse<void>> {
    return this.deleteMini<void>('/sessions/all', '모든 세션 해제 중...');
  }

  /**
   * Enable two-factor authentication
   */
  async enable2FA(): Promise<CommonResponse<{
    qrCodeUrl: string;
    backupCodes: string[];
    secret: string;
  }>> {
    return this.postMini<any, object>('/2fa/enable', {}, '2FA 설정 중...');
  }

  /**
   * Verify and confirm two-factor authentication
   */
  async confirm2FA(code: string): Promise<CommonResponse<void>> {
    return this.postMini<void, { code: string }>(
      '/2fa/confirm',
      { code },
      '2FA 인증 중...'
    );
  }

  /**
   * Disable two-factor authentication
   */
  async disable2FA(password: string): Promise<CommonResponse<void>> {
    return this.deleteMini<void>('/2fa/disable', '2FA 해제 중...');
  }

  /**
   * Verify 2FA code during login
   */
  async verify2FACode(code: string): Promise<CommonResponse<AuthResponse>> {
    return this.postMini<AuthResponse, { code: string }>(
      '/2fa/verify',
      { code },
      '2FA 코드 확인 중...'
    );
  }
}

// Legacy support - functional interface (deprecated, use AuthService class instead)
const authService = {
  login(credentials: LoginCredentials): Promise<CommonResponse<AuthResponse>> {
    const service = new AuthService();
    return service.login(credentials);
  },

  logout(): Promise<CommonResponse<void>> {
    const service = new AuthService();
    return service.logout();
  },

  register(data: RegisterData): Promise<CommonResponse<AuthResponse>> {
    const service = new AuthService();
    return service.register(data);
  },

  refreshToken(refreshToken: string): Promise<CommonResponse<AuthTokens>> {
    const service = new AuthService();
    return service.refreshToken(refreshToken);
  },

  validateSession(): Promise<CommonResponse<SessionInfo>> {
    const service = new AuthService();
    return service.validateSession();
  },

  getCurrentUser(): Promise<CommonResponse<User>> {
    const service = new AuthService();
    return service.getCurrentUser();
  },

  requestPasswordReset(data: PasswordResetData): Promise<CommonResponse<void>> {
    const service = new AuthService();
    return service.requestPasswordReset(data);
  },

  resetPassword(
    token: string, 
    newPassword: string,
    newPasswordConfirm: string
  ): Promise<CommonResponse<void>> {
    const service = new AuthService();
    return service.resetPassword(token, newPassword, newPasswordConfirm);
  },

  changePassword(data: PasswordChangeData): Promise<CommonResponse<void>> {
    const service = new AuthService();
    return service.changePassword(data);
  },

  sendEmailVerification(email?: string): Promise<CommonResponse<void>> {
    const service = new AuthService();
    return service.sendEmailVerification(email);
  },

  verifyEmail(token: string): Promise<CommonResponse<void>> {
    const service = new AuthService();
    return service.verifyEmail(token);
  },

  checkUserIdAvailability(userId: string): Promise<CommonResponse<{ available: boolean }>> {
    const service = new AuthService();
    return service.checkUserIdAvailability(userId);
  },

  checkNicknameAvailability(nickname: string): Promise<CommonResponse<{ available: boolean }>> {
    const service = new AuthService();
    return service.checkNicknameAvailability(nickname);
  },

  checkEmailAvailability(email: string): Promise<CommonResponse<{ available: boolean }>> {
    const service = new AuthService();
    return service.checkEmailAvailability(email);
  },
};

export { authService };
export default AuthService;