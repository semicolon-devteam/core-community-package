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
export declare class AuthService extends BaseService {
    constructor(options?: AuthServiceOptions);
    /**
     * User login
     */
    login(credentials: LoginCredentials): Promise<CommonResponse<AuthResponse>>;
    /**
     * User logout
     */
    logout(): Promise<CommonResponse<void>>;
    /**
     * User registration
     */
    register(data: RegisterData): Promise<CommonResponse<AuthResponse>>;
    /**
     * Refresh access token
     */
    refreshToken(refreshToken: string): Promise<CommonResponse<AuthTokens>>;
    /**
     * Validate current session
     */
    validateSession(): Promise<CommonResponse<SessionInfo>>;
    /**
     * Get current user info (from token)
     */
    getCurrentUser(): Promise<CommonResponse<User>>;
    /**
     * Send password reset email
     */
    requestPasswordReset(data: PasswordResetData): Promise<CommonResponse<void>>;
    /**
     * Reset password with token
     */
    resetPassword(token: string, newPassword: string, newPasswordConfirm: string): Promise<CommonResponse<void>>;
    /**
     * Change password (authenticated user)
     */
    changePassword(data: PasswordChangeData): Promise<CommonResponse<void>>;
    /**
     * Send email verification
     */
    sendEmailVerification(email?: string): Promise<CommonResponse<void>>;
    /**
     * Verify email with token
     */
    verifyEmail(token: string): Promise<CommonResponse<void>>;
    /**
     * Check if user ID is available
     */
    checkUserIdAvailability(userId: string): Promise<CommonResponse<{
        available: boolean;
    }>>;
    /**
     * Check if nickname is available
     */
    checkNicknameAvailability(nickname: string): Promise<CommonResponse<{
        available: boolean;
    }>>;
    /**
     * Check if email is available
     */
    checkEmailAvailability(email: string): Promise<CommonResponse<{
        available: boolean;
    }>>;
    /**
     * Get user sessions (for security management)
     */
    getUserSessions(): Promise<CommonResponse<Array<{
        id: string;
        deviceInfo: string;
        ipAddress: string;
        lastActivity: string;
        isCurrent: boolean;
    }>>>;
    /**
     * Revoke specific session
     */
    revokeSession(sessionId: string): Promise<CommonResponse<void>>;
    /**
     * Revoke all sessions except current
     */
    revokeAllSessions(): Promise<CommonResponse<void>>;
    /**
     * Enable two-factor authentication
     */
    enable2FA(): Promise<CommonResponse<{
        qrCodeUrl: string;
        backupCodes: string[];
        secret: string;
    }>>;
    /**
     * Verify and confirm two-factor authentication
     */
    confirm2FA(code: string): Promise<CommonResponse<void>>;
    /**
     * Disable two-factor authentication
     */
    disable2FA(password: string): Promise<CommonResponse<void>>;
    /**
     * Verify 2FA code during login
     */
    verify2FACode(code: string): Promise<CommonResponse<AuthResponse>>;
}
declare const authService: {
    login(credentials: LoginCredentials): Promise<CommonResponse<AuthResponse>>;
    logout(): Promise<CommonResponse<void>>;
    register(data: RegisterData): Promise<CommonResponse<AuthResponse>>;
    refreshToken(refreshToken: string): Promise<CommonResponse<AuthTokens>>;
    validateSession(): Promise<CommonResponse<SessionInfo>>;
    getCurrentUser(): Promise<CommonResponse<User>>;
    requestPasswordReset(data: PasswordResetData): Promise<CommonResponse<void>>;
    resetPassword(token: string, newPassword: string, newPasswordConfirm: string): Promise<CommonResponse<void>>;
    changePassword(data: PasswordChangeData): Promise<CommonResponse<void>>;
    sendEmailVerification(email?: string): Promise<CommonResponse<void>>;
    verifyEmail(token: string): Promise<CommonResponse<void>>;
    checkUserIdAvailability(userId: string): Promise<CommonResponse<{
        available: boolean;
    }>>;
    checkNicknameAvailability(nickname: string): Promise<CommonResponse<{
        available: boolean;
    }>>;
    checkEmailAvailability(email: string): Promise<CommonResponse<{
        available: boolean;
    }>>;
};
export { authService };
export default AuthService;
