/**
 * @semicolon/community-core
 * Auth 유틸리티 함수들
 */

import type { User } from '@supabase/supabase-js';

// =============================================================================
// User 관련 유틸리티
// =============================================================================

/**
 * 사용자가 인증되었는지 확인
 */
export function isAuthenticated(user: User | null): boolean {
  return !!user;
}

/**
 * 관리자 권한 확인
 * user_metadata나 app_metadata에서 role을 확인
 */
export function isAdmin(user: User | null): boolean {
  if (!user) return false;

  const userRole = user.user_metadata?.role || user.app_metadata?.role;
  const claims = user.app_metadata?.claims_admin;

  return userRole === 'admin' || userRole === 'super_admin' || !!claims;
}

/**
 * 사용자 레벨 확인
 * user_metadata에서 level을 가져옴
 */
export function getUserLevel(user: User | null): number {
  if (!user) return 0;
  return user.user_metadata?.level || 0;
}

/**
 * 사용자 닉네임 가져오기
 */
export function getUserNickname(user: User | null): string | null {
  if (!user) return null;
  return user.user_metadata?.nickname || null;
}

/**
 * 사용자 프로필 정보 가져오기
 */
export function getUserProfile(user: User | null) {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    nickname: user.user_metadata?.nickname,
    login_id: user.user_metadata?.login_id,
    avatar_url: user.user_metadata?.avatar_url,
    level: user.user_metadata?.level || 0,
    role: user.user_metadata?.role || 'user',
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

// =============================================================================
// 권한 관련 유틸리티
// =============================================================================

/**
 * 레벨 기반 권한 확인
 */
export function checkLevelPermission(user: User | null, requiredLevel: number): boolean {
  if (!user) return false;
  const userLevel = getUserLevel(user);
  return userLevel >= requiredLevel;
}

/**
 * 역할 기반 권한 확인
 */
export function checkRolePermission(user: User | null, allowedRoles: string[]): boolean {
  if (!user) return false;
  const userRole = user.user_metadata?.role || user.app_metadata?.role || 'user';
  return allowedRoles.includes(userRole);
}

/**
 * 리소스 기반 권한 확인
 * 현재는 간단한 구현, 향후 Supabase RLS나 별도 권한 시스템과 연동 가능
 */
export function checkResourcePermission(
  user: User | null,
  resource: string,
  action: string
): boolean {
  if (!user) return false;

  // 관리자는 모든 권한
  if (isAdmin(user)) return true;

  // 기본적으로 인증된 사용자는 읽기 권한
  if (action === 'read') return true;

  // 기타 권한은 레벨이나 역할에 따라 결정
  const userLevel = getUserLevel(user);

  switch (resource) {
    case 'posts':
      return action === 'create' ? userLevel >= 1 : userLevel >= 5;
    case 'comments':
      return action === 'create' ? userLevel >= 1 : userLevel >= 3;
    case 'admin':
      return isAdmin(user);
    default:
      return false;
  }
}

// =============================================================================
// 검증 관련 유틸리티
// =============================================================================

/**
 * 이메일 형식 검증
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호 강도 검증
 */
export interface PasswordValidationOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(
  password: string,
  options: PasswordValidationOptions = {}
): PasswordValidationResult {
  const {
    minLength = 6,
    requireUppercase = false,
    requireLowercase = false,
    requireNumbers = false,
    requireSpecialChars = false,
  } = options;

  const errors: string[] = [];

  if (password.length < minLength) {
    errors.push(`비밀번호는 최소 ${minLength}자 이상이어야 합니다.`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('대문자를 포함해야 합니다.');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('소문자를 포함해야 합니다.');
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push('숫자를 포함해야 합니다.');
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('특수문자를 포함해야 합니다.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 닉네임 검증
 */
export function validateNickname(nickname: string): { isValid: boolean; error?: string } {
  if (!nickname || nickname.trim().length < 2) {
    return { isValid: false, error: '닉네임은 최소 2자 이상이어야 합니다.' };
  }

  if (nickname.length > 20) {
    return { isValid: false, error: '닉네임은 최대 20자까지 가능합니다.' };
  }

  // 영문, 숫자, 한글, 언더스코어만 허용
  const nicknameRegex = /^[a-zA-Z0-9가-힣_]+$/;
  if (!nicknameRegex.test(nickname)) {
    return { isValid: false, error: '닉네임은 영문, 숫자, 한글, 언더스코어(_)만 사용 가능합니다.' };
  }

  return { isValid: true };
}

// =============================================================================
// 스토리지 관련 유틸리티
// =============================================================================

/**
 * 로컬 스토리지에 값 저장 (안전하게)
 */
export function setLocalStorage(key: string, value: any): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.warn('localStorage 저장 실패:', error);
  }
}

/**
 * 로컬 스토리지에서 값 가져오기 (안전하게)
 */
export function getLocalStorage(key: string): any {
  try {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
  } catch (error) {
    console.warn('localStorage 조회 실패:', error);
  }
  return null;
}

/**
 * 로컬 스토리지에서 값 제거 (안전하게)
 */
export function removeLocalStorage(key: string): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn('localStorage 삭제 실패:', error);
  }
}