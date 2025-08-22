import { SITE_DOMAIN } from '@constants/site';
import { deleteCookie } from 'cookies-next';

export const clearCookie = (cookieName: string) => {
  deleteCookie(cookieName, {
    path: '/',
    domain: SITE_DOMAIN,
    sameSite: 'lax'
  });
};

export const handleLogout = (router: any) => {
  clearCookie('sb-access-token');
  clearCookie('sb-refresh-token');
  router.push('/');
};

/**
 * 개발 환경에서 세션 만료 시나리오를 테스트하기 위한 유틸리티
 * 브라우저 개발자 도구 콘솔에서 사용
 */

// JWT 토큰을 안전하게 base64url 인코딩하는 함수 (UTF-8 지원)
function base64UrlEncode(str: string): string {
  // UTF-8 문자를 안전하게 처리
  const utf8String = unescape(encodeURIComponent(str));
  const base64 = btoa(utf8String);
  
  // base64를 base64url로 변환
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// JWT 토큰을 안전하게 base64url 디코딩하는 함수
function base64UrlDecode(str: string): string {
  // base64url을 base64로 변환
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  
  // 패딩 추가
  while (base64.length % 4) {
    base64 += '=';
  }
  
  try {
    const decoded = atob(base64);
    return decodeURIComponent(escape(decoded));
  } catch (error) {
    console.error('Base64URL 디코딩 실패:', error);
    return str;
  }
}

interface SessionTestUtils {
  checkSession(): void;
  expireSession(): void;
  corruptToken(): void;
  clearSession(): void;
  setExpiredToken(): void;
  restoreValidSession(): void;
  simulateUnauthorized(): void;
  help(): void;
}

const sessionTestUtils: SessionTestUtils = {
  // 현재 세션 상태 확인
  checkSession() {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('sb-access-token='));
    
    if (!cookieValue) {
      console.log('❌ 세션 토큰이 없습니다.');
      return;
    }

    try {
      const sessionJson = decodeURIComponent(cookieValue.split('=')[1]);
      const session = JSON.parse(sessionJson);
      
      console.log('✅ 현재 세션 상태:', {
        hasAccessToken: !!session.access_token,
        hasRefreshToken: !!session.refresh_token,
        tokenType: session.token_type,
        expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'N/A',
        expiresIn: session.expires_in
      });

      // JWT 토큰 파싱해서 만료시간 확인
      if (session.access_token) {
        try {
          const [header, payload] = session.access_token.split('.');
          const decodedPayload = JSON.parse(base64UrlDecode(payload));
          
          const now = Math.floor(Date.now() / 1000);
          const exp = decodedPayload.exp;
          const isExpired = exp < now;
          
          console.log('🔍 JWT 토큰 정보:', {
            expired: isExpired,
            expiresAt: new Date(exp * 1000).toLocaleString(),
            remainingSeconds: exp - now,
            userId: decodedPayload.sub,
            email: decodedPayload.email
          });
        } catch (jwtError) {
          console.error('❌ JWT 토큰 파싱 실패:', jwtError);
        }
      }
      
    } catch (error) {
      console.error('❌ 세션 파싱 실패:', error);
    }
  },

  // 세션을 만료된 상태로 변경
  expireSession() {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('sb-access-token='));
    
    if (!cookieValue) {
      console.log('❌ 기존 세션이 없습니다.');
      return;
    }

    try {
      const sessionJson = decodeURIComponent(cookieValue.split('=')[1]);
      const session = JSON.parse(sessionJson);
      
      if (!session.access_token) {
        console.log('❌ access_token이 없습니다.');
        return;
      }

      // JWT 토큰 파싱
      const [header, payload, signature] = session.access_token.split('.');
      const decodedPayload = JSON.parse(base64UrlDecode(payload));
      
      // 만료 시간을 과거로 설정 (1시간 전)
      const expiredTime = Math.floor(Date.now() / 1000) - 3600;
      decodedPayload.exp = expiredTime;
      decodedPayload.iat = expiredTime - 3600; // 발급 시간도 과거로
      
      // 새로운 토큰 생성 (실제로는 서명이 맞지 않아서 무효하지만 테스트용)
      const newPayload = base64UrlEncode(JSON.stringify(decodedPayload));
      const expiredToken = `${header}.${newPayload}.${signature}`;
      
      // 세션 업데이트
      const updatedSession = {
        ...session,
        access_token: expiredToken,
        expires_at: expiredTime
      };
      
      // 쿠키 설정
      const sessionString = encodeURIComponent(JSON.stringify(updatedSession));
      document.cookie = `sb-access-token=${sessionString}; path=/; max-age=86400; SameSite=Lax`;
      
      console.log('✅ 세션이 만료된 상태로 변경되었습니다.');
      console.log('🔄 페이지를 새로고침하면 자동 로그아웃됩니다.');
      
    } catch (error) {
      console.error('❌ 세션 만료 처리 실패:', error);
    }
  },

  // 토큰을 손상시켜 무효화
  corruptToken() {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('sb-access-token='));
    
    if (!cookieValue) {
      console.log('❌ 기존 세션이 없습니다.');
      return;
    }

    try {
      const sessionJson = decodeURIComponent(cookieValue.split('=')[1]);
      const session = JSON.parse(sessionJson);
      
      // 토큰을 무효한 값으로 변경
      const corruptedSession = {
        ...session,
        access_token: 'invalid.token.corrupted'
      };
      
      const sessionString = encodeURIComponent(JSON.stringify(corruptedSession));
      document.cookie = `sb-access-token=${sessionString}; path=/; max-age=86400; SameSite=Lax`;
      
      console.log('✅ 토큰이 손상된 상태로 변경되었습니다.');
      console.log('🔄 페이지를 새로고침하면 인증 에러가 발생합니다.');
      
    } catch (error) {
      console.error('❌ 토큰 손상 처리 실패:', error);
    }
  },

  // 모든 세션 쿠키 제거
  clearSession() {
    console.log('🧹 모든 세션 쿠키를 제거합니다...');
    
    // 모든 관련 쿠키 제거
    const cookiesToClear = [
      'sb-access-token',
      'sb-refresh-token', 
      'sb-auth-token',
      'supabase-auth-token',
      'supabase.auth.token'
    ];
    
    cookiesToClear.forEach(cookieName => {
      // 현재 도메인에서 제거
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${window.location.hostname}; SameSite=Lax`;
      
      // 상위 도메인에서도 제거 (예: .example.com)
      const hostname = window.location.hostname;
      if (hostname.includes('.')) {
        const domain = '.' + hostname.split('.').slice(-2).join('.');
        document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${domain}; SameSite=Lax`;
      }
      
      console.log(`🗑️  ${cookieName} 쿠키 제거 완료`);
    });
    
    // localStorage와 sessionStorage도 정리
    try {
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-auth-token');
      sessionStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('sb-auth-token');
      console.log('🗑️  로컬 스토리지 정리 완료');
    } catch (error) {
      console.warn('⚠️  로컬 스토리지 정리 중 에러:', error);
    }
    
    console.log('✅ 모든 세션 데이터가 제거되었습니다.');
    console.log('�� 페이지를 새로고침하면 로그아웃 상태가 됩니다.');
  },

  // 만료된 토큰 직접 설정
  setExpiredToken() {
    const expiredSession = {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcl9pZCI6MTIzLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJleHAiOjE2MDk0NTkyMDAsImlhdCI6MTYwOTQ1NTYwMH0.invalid',
      refresh_token: 'expired_refresh_token',
      expires_at: 1609459200, // 2021년 1월 1일 (과거)
      expires_in: -999999,
      token_type: 'bearer'
    };
    
    const sessionString = encodeURIComponent(JSON.stringify(expiredSession));
    document.cookie = `sb-access-token=${sessionString}; path=/; max-age=86400; SameSite=Lax`;
    
    console.log('✅ 만료된 테스트 토큰이 설정되었습니다.');
    console.log('🔄 페이지를 새로고침하면 자동 로그아웃됩니다.');
  },

  // 유효한 테스트 세션 복구 (개발용)
  restoreValidSession() {
    console.log('⚠️  실제 로그인을 통해 유효한 세션을 생성해주세요.');
    console.log('🔄 로그인 페이지로 이동합니다...');

  },

  // 401 에러 직접 발생시키기
  async simulateUnauthorized() {
    try {
      const response = await fetch('/api/user/me', {
        headers: {
          'Authorization': 'Bearer invalid_token'
        }
      });
      
      if (response.status === 401) {
        console.log('✅ 401 Unauthorized 에러가 발생했습니다.');
        console.log('🔄 axios interceptor가 작동하여 로그아웃 처리됩니다.');
      } else {
        console.log(`⚠️  예상과 다른 응답: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ 요청 실패:', error);
    }
  },

  // 사용법 안내
  help() {
    console.log(`
🧪 세션 테스트 유틸리티 사용법:

1. checkSession() - 현재 세션 상태 확인
2. expireSession() - 세션을 만료된 상태로 변경
3. corruptToken() - 토큰을 손상시켜 무효화
4. clearSession() - 모든 세션 쿠키 완전 제거
5. setExpiredToken() - 만료된 토큰 직접 설정
6. restoreValidSession() - 유효한 세션 복구 (로그인 페이지로 이동)
7. simulateUnauthorized() - 401 에러 직접 발생
8. help() - 이 도움말 표시

✅ 사용 예시:
window.sessionTest.checkSession()
window.sessionTest.expireSession()
window.sessionTest.clearSession()

⚠️  주의: 개발 환경에서만 사용하세요!
    `);
  }
};

// 개발 환경에서만 전역 객체에 등록
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).sessionTest = sessionTestUtils;
  
  console.log('🧪 세션 테스트 유틸리티가 로드되었습니다.');
  console.log('💡 사용법: window.sessionTest.help()');
}

export default sessionTestUtils; 