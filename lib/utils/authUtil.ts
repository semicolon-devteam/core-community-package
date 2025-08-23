/**
 * 통합 인증 및 권한 관리 유틸리티
 */

import type { User, permissionType } from '../types/User';

interface JWTUserPayload {
  sub: string;
  user_metadata: any;
  is_admin?: boolean;
  level?: number;
}

export interface AuthUser {
  id: string;
  nickname: string;
  level: number;
  permissionType: permissionType;
  is_admin?: boolean;
}

/**
 * 사용자가 JWT 페이로드인지 확인하는 타입 가드
 */
export function isJWTPayload(user: any): user is JWTUserPayload {
  return user && typeof user.sub === 'string' && user.user_metadata;
}

/**
 * 사용자가 User 객체인지 확인하는 타입 가드 (Redux store에서 온 데이터)
 */
export function isUserObject(user: any): user is User {
  return (
    user &&
    typeof user.id === 'string' &&
    user.nickname &&
    user.permissionType
  );
}

export const isValidUser = (user: User | null): user is User => {
  return (
    !!user &&
    typeof user.id === 'string' &&
    !!user.nickname &&
    !!user.permissionType
  );
};

// checkIsAdmin 함수의 타입을 User와 완벽하게 호환되도록 수정
export const checkIsAdmin = (user: {
  level: number;
  permissionType: permissionType;
}): boolean => {
  return (
    user.level >= 99 ||
    user.permissionType === 'admin' ||
    user.permissionType === 'super_admin'
  );
};

export const isAdmin = (user: AuthUser | User | null): boolean => {
  if (!user) return false;
  return checkIsAdmin(user);
};

export const isSuperAdmin = (user: AuthUser | User | null): boolean => {
  if (!user) return false;
  return checkIsAdmin(user);
};

export const isAdminOrSuperAdmin = (user: AuthUser | User | null): boolean => {
  if (!user) return false;
  return checkIsAdmin(user);
};

/**
 * 특정 레벨 이상 권한 체크
 * @param user 사용자 정보 (Redux store의 User 객체 권장)
 * @param requiredLevel 필요한 최소 레벨
 * @returns 권한 여부
 */
export const hasLevelPermission = (
  user?: AuthUser | null,
  requiredLevel: number = 0
): boolean => {
  // 사용자가 없거나 빈 객체인 경우
  if (!user || (typeof user === 'object' && Object.keys(user).length === 0)) {
    return requiredLevel === 0;
  }

  // 관리자는 모든 권한 보유
  if (isAdmin(user)) return true;

  // Redux store의 User 객체인 경우 (권장)
  if (isUserObject(user)) {
    return user.level >= requiredLevel;
  }

  // JWT 페이로드인 경우 (레거시 호환성 - 권장하지 않음)
  if (isJWTPayload(user)) {
    console.warn(
      '[DEPRECATED] JWT 기반 권한 체크는 권장하지 않습니다. useAppSelector(selectUserInfo)를 사용하여 Redux store의 사용자 정보를 활용하세요.'
    );
    // 레거시 호환성을 위한 기본 권한 매핑
    const userLevel = user.is_admin ? 99 : (user.level || 1);
    return userLevel >= requiredLevel;
  }

  // 기존 UserPermission 형태인 경우 (레거시)
  return user.level >= requiredLevel;
};

/**
 * 게시판 권한 체크 (읽기, 쓰기, 댓글 등)
 * @param user 사용자 정보 (Redux store의 User 객체 권장)
 * @param requiredLevel 필요한 권한 레벨
 * @param isLoggedIn 로그인 여부
 * @returns 권한 여부
 */
export const hasBoardPermission = (
  user?: AuthUser | null,
  requiredLevel: number | 'free' = 0,
  isLoggedIn: boolean = false
): boolean => {
  // 'free' 또는 0인 경우 모든 사용자 접근 가능
  if (requiredLevel === 'free' || requiredLevel === 0) {
    return true;
  }

  // 로그인이 필요한 경우
  if (!isLoggedIn || !user) {
    return false;
  }

  return hasLevelPermission(user, requiredLevel);
};

/**
 * 사용자 권한 레벨 반환
 * @param user 사용자 정보 (Redux store의 User 객체 권장)
 * @returns 사용자 레벨
 */
export const getUserLevel = (user?: AuthUser | null): number => {
  if (!user) return 0;

  // Redux store의 User 객체인 경우 (권장)
  if (isUserObject(user)) {
    return user.level || 0;
  }

  // JWT 페이로드인 경우 (레거시 호환성 - 권장하지 않음)
  if (isJWTPayload(user)) {
    console.warn(
      '[DEPRECATED] JWT 기반 레벨 조회는 권장하지 않습니다. useAppSelector(selectUserInfo)를 사용하여 Redux store의 사용자 정보를 활용하세요.'
    );
    // 레거시 호환성을 위한 기본 레벨 매핑
    return user.is_admin ? 99 : (user.level || 1);
  }

  // 기존 UserPermission 형태인 경우 (레거시)
  return user.level || 0;
};

export const getUserPermissionType = (user: AuthUser | User | null): permissionType => {
  if (!user) {
    return 'anonymous';
  }

  return user.permissionType || 'user';
};

export const getUserPermissionTypeFromJWT = (user: AuthUser | User | null): permissionType => {
  if (!user) {
    return 'anonymous';
  }

  return user.permissionType || 'user';
};

export const getUserPermissionTypeFromDB = (user: AuthUser | User | null): permissionType => {
  if (!user) {
    return 'anonymous';
  }

  return user.permissionType || 'user';
};
