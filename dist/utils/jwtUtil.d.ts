/**
 * JWT 토큰 디코딩 및 사용자 정보 추출 유틸리티
 */
export interface JWTUserPayload {
    aal: string;
    amr: Array<{
        method: string;
        timestamp: number;
    }>;
    app_metadata: {
        provider: string;
        providers: string[];
        [key: string]: any;
    };
    aud: string;
    created_at: string;
    email: string;
    exp: number;
    iat: number;
    is_anonymous: boolean;
    phone: string;
    role: string;
    session_id: string;
    sub: string;
    user_metadata: {
        email?: string;
        email_verified?: boolean;
        login_id?: string;
        nickname?: string;
        phone_verified?: boolean;
        role?: string;
        sub?: string;
        [key: string]: any;
    };
    user_id?: number;
    permission_type?: string;
    is_admin?: boolean;
}
/**
 * JWT 토큰에서 페이로드 추출
 * @param token JWT 액세스 토큰
 * @returns 디코딩된 사용자 정보 또는 null
 */
export declare function decodeJWTPayload(token: string): JWTUserPayload | null;
/**
 * 현재 세션에서 사용자 정보 추출
 * @returns 사용자 정보 또는 null
 */
export declare function getCurrentUserFromToken(): Promise<JWTUserPayload | null>;
/**
 * JWT 토큰이 만료되었는지 확인
 * @param payload JWT 페이로드
 * @returns 만료 여부
 */
export declare function isTokenExpired(payload: JWTUserPayload): boolean;
/**
 * 토큰 만료까지 남은 시간 (초)
 * @param payload JWT 페이로드
 * @returns 남은 시간 (초), 음수면 이미 만료
 */
export declare function getTokenTimeToExpiry(payload: JWTUserPayload): number;
/**
 * 만료된 토큰을 쿠키에서 자동으로 제거
 * @param cookieName 쿠키 이름 (기본값: 'sb-access-token')
 */
export declare function removeExpiredTokenFromCookie(cookieName?: string): void;
/**
 * 토큰 유효성을 검증하고 만료된 경우 자동으로 정리
 * @returns 유효한 토큰이 있으면 페이로드 반환, 없으면 null
 */
export declare function validateAndCleanToken(): Promise<JWTUserPayload | null>;
/**
 * 토큰 만료 5분 전 여부 확인 (갱신 시점 판단용)
 * @param payload JWT 페이로드
 * @returns true면 갱신이 필요한 시점
 */
export declare function shouldRefreshToken(payload: JWTUserPayload): boolean;
