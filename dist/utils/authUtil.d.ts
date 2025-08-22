/**
 * 통합 인증 및 권한 관리 유틸리티
 */
import type { User } from '../types/User';
export type permissionType = 'super_admin' | 'admin' | 'user' | 'anonymous';
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
export declare function isJWTPayload(user: any): user is JWTUserPayload;
/**
 * 사용자가 User 객체인지 확인하는 타입 가드 (Redux store에서 온 데이터)
 */
export declare function isUserObject(user: any): user is User;
export declare const isValidUser: (user: User | null) => user is User;
export declare const checkIsAdmin: (user: {
    level: number;
    permissionType: permissionType;
}) => boolean;
export declare const isAdmin: (user: AuthUser | User | null) => boolean;
export declare const isSuperAdmin: (user: AuthUser | User | null) => boolean;
export declare const isAdminOrSuperAdmin: (user: AuthUser | User | null) => boolean;
/**
 * 특정 레벨 이상 권한 체크
 * @param user 사용자 정보 (Redux store의 User 객체 권장)
 * @param requiredLevel 필요한 최소 레벨
 * @returns 권한 여부
 */
export declare const hasLevelPermission: (user?: AuthUser | null, requiredLevel?: number) => boolean;
/**
 * 게시판 권한 체크 (읽기, 쓰기, 댓글 등)
 * @param user 사용자 정보 (Redux store의 User 객체 권장)
 * @param requiredLevel 필요한 권한 레벨
 * @param isLoggedIn 로그인 여부
 * @returns 권한 여부
 */
export declare const hasBoardPermission: (user?: AuthUser | null, requiredLevel?: number | "free", isLoggedIn?: boolean) => boolean;
/**
 * 사용자 권한 레벨 반환
 * @param user 사용자 정보 (Redux store의 User 객체 권장)
 * @returns 사용자 레벨
 */
export declare const getUserLevel: (user?: AuthUser | null) => number;
export declare const getUserPermissionType: (user: AuthUser | User | null) => permissionType;
export declare const getUserPermissionTypeFromJWT: (user: AuthUser | User | null) => permissionType;
export declare const getUserPermissionTypeFromDB: (user: AuthUser | User | null) => permissionType;
export {};
