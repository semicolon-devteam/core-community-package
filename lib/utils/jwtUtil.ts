/**
 * JWT 토큰 디코딩 및 사용자 정보 추출 유틸리티
 */

export interface JWTUserPayload {
  aal: string;
  amr: Array<{ method: string; timestamp: number }>;
  app_metadata: {
    provider: string;
    providers: string[];
    [key: string]: any; // 추가 앱 메타데이터
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
  sub: string; // auth_user_id (UUID)
  user_metadata: {
    email?: string;
    email_verified?: boolean;
    login_id?: string;
    nickname?: string;
    phone_verified?: boolean;
    role?: string;
    sub?: string;
    [key: string]: any; // 추가 사용자 메타데이터
  };
  
  // 애플리케이션별 확장 필드 (실제로 JWT에 없을 수 있음)
  user_id?: number; // users 테이블의 실제 ID
  permission_type?: string;
  is_admin?: boolean;
}

/**
 * Base64 URL 디코딩
 */
function base64UrlDecode(str: string): string {
  // Base64 URL을 일반 Base64로 변환
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  
  // 패딩 추가
  while (str.length % 4) {
    str += '=';
  }
  
  // Base64 디코딩 후 UTF-8 문자열로 변환
  return decodeURIComponent(
    atob(str)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

/**
 * JWT 토큰에서 페이로드 추출
 * @param token JWT 액세스 토큰
 * @returns 디코딩된 사용자 정보 또는 null
 */
export function decodeJWTPayload(token: string): JWTUserPayload | null {
  try {
    // JWT는 header.payload.signature 형태
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return null;
    }
    
    // 페이로드 부분 디코딩
    const payload = base64UrlDecode(parts[1]);
    return JSON.parse(payload) as JWTUserPayload;
  } catch (error) {
    console.error('JWT 디코딩 실패:', error);
    return null;
  }
}

/**
 * 현재 세션에서 사용자 정보 추출
 * @returns 사용자 정보 또는 null
 */
export async function getCurrentUserFromToken(): Promise<JWTUserPayload | null> {
  try {
    const { clientSupabase } = await import("../config/Supabase/client");
    const { data: { session } } = await clientSupabase.auth.getSession();
    
    if (!session?.access_token) {
      return null;
    }
    
    return decodeJWTPayload(session.access_token);
  } catch (error) {
    console.error('토큰에서 사용자 정보 추출 실패:', error);
    return null;
  }
}

/**
 * JWT 토큰이 만료되었는지 확인
 * @param payload JWT 페이로드
 * @returns 만료 여부
 */
export function isTokenExpired(payload: JWTUserPayload): boolean {
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}

/**
 * 토큰 만료까지 남은 시간 (초)
 * @param payload JWT 페이로드
 * @returns 남은 시간 (초), 음수면 이미 만료
 */
export function getTokenTimeToExpiry(payload: JWTUserPayload): number {
  const now = Math.floor(Date.now() / 1000);
  return payload.exp - now;
}

/**
 * 만료된 토큰을 쿠키에서 자동으로 제거
 * @param cookieName 쿠키 이름 (기본값: 'sb-access-token')
 */
export function removeExpiredTokenFromCookie(cookieName: string = 'sb-access-token'): void {
  if (typeof window === 'undefined') return;

  try {
    // 쿠키에서 토큰 읽기
    const cookieString = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${cookieName}=`))
      ?.split('=')[1];

    if (!cookieString) return;

    // 토큰 파싱 및 검증
    const decodedCookie = decodeURIComponent(cookieString);
    const sessionData = JSON.parse(decodedCookie);
    const accessToken = sessionData?.access_token;

    if (!accessToken) return;

    // JWT 토큰 디코딩 및 만료 확인
    const payload = decodeJWTPayload(accessToken);
    if (payload && isTokenExpired(payload)) {
      console.log('🗑️ 만료된 토큰 감지, 쿠키에서 제거 중...');
      
      // 만료된 토큰 제거
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
      
      // 추가 토큰 관련 쿠키들도 정리
      const relatedCookies = ['supabase-auth-token', 'sb-auth-token', 'auth-token'];
      relatedCookies.forEach(name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
      });

      console.log('✅ 만료된 토큰 쿠키 제거 완료');
    }
  } catch (error) {
    console.error('❌ 만료된 토큰 제거 중 오류:', error);
  }
}

/**
 * 토큰 유효성을 검증하고 만료된 경우 자동으로 정리
 * @returns 유효한 토큰이 있으면 페이로드 반환, 없으면 null
 */
export async function validateAndCleanToken(): Promise<JWTUserPayload | null> {
  try {
    const { clientSupabase } = await import("../config/Supabase/client");
    const { data: { session } } = await clientSupabase.auth.getSession();
    
    if (!session?.access_token) {
      // 세션이 없는 경우 쿠키 정리
      removeExpiredTokenFromCookie();
      return null;
    }
    
    const payload = decodeJWTPayload(session.access_token);
    if (!payload) {
      // 토큰 디코딩 실패 시 쿠키 정리
      removeExpiredTokenFromCookie();
      return null;
    }
    
    if (isTokenExpired(payload)) {
      // 만료된 토큰 정리
      removeExpiredTokenFromCookie();
      
      // Supabase 세션도 정리
      await clientSupabase.auth.signOut();
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error('토큰 검증 및 정리 실패:', error);
    removeExpiredTokenFromCookie(); // 오류 시에도 쿠키 정리
    return null;
  }
}

/**
 * 토큰 만료 5분 전 여부 확인 (갱신 시점 판단용)
 * @param payload JWT 페이로드
 * @returns true면 갱신이 필요한 시점
 */
export function shouldRefreshToken(payload: JWTUserPayload): boolean {
  const timeToExpiry = getTokenTimeToExpiry(payload);
  return timeToExpiry <= 300; // 5분 이하 남으면 갱신
} 