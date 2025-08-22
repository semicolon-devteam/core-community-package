import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * 서버에서 클라이언트 쿠키에 갱신된 세션 정보를 저장하는 함수
 * @param session - 갱신된 세션 정보
 */
export async function syncSessionToCookie(session: any) {
  if (!session || typeof window !== 'undefined') {
    // 서버사이드에서만 실행되어야 함
    return;
  }

  try {
    const cookieStore = await cookies();
    const sessionString = JSON.stringify(session);
    const encodedValue = encodeURIComponent(sessionString);

    // 30일 후 만료
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    // Set-Cookie 헤더를 통한 쿠키 설정
    cookieStore.set('sb-access-token', encodedValue, {
      expires,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false, // 클라이언트에서도 접근 가능해야 함
    });

    console.log('✅ 서버사이드: 갱신된 세션 정보를 쿠키에 동기화 완료');
  } catch (error) {
    console.error('❌ 서버사이드: 세션 쿠키 동기화 실패:', error);
  }
}

/**
 * 서버사이드에서 사용하는 Supabase 클라이언트
 * 쿠키에서 인증 정보를 읽어와 자동으로 인증된 클라이언트를 반환
 */

export async function getServerSupabase() {
  try {
    // 1. 표준 쿠키 이름으로 토큰 읽기 (일관성 확보)
    const cookieStore = await cookies();
    const STANDARD_COOKIE_NAME = 'sb-access-token';
    
    let cookieString = cookieStore.get(STANDARD_COOKIE_NAME)?.value;

    // 표준 쿠키가 없으면 레거시 쿠키들 확인 (하위 호환성)
    if (!cookieString) {
      const legacyCookieNames = [
        'supabase-auth-token',
        'supabase.auth.token',
        'sb-auth-token',
        'auth-token',
      ];

      for (const cookieName of legacyCookieNames) {
        const value = cookieStore.get(cookieName)?.value;
        if (value) {
          cookieString = value;
          // 레거시 쿠키를 표준 이름으로 마이그레이션
          console.log(`🔄 서버사이드: 레거시 쿠키 ${cookieName}을 ${STANDARD_COOKIE_NAME}으로 마이그레이션`);
          break;
        }
      }
    }

    if (!cookieString) {
      // 쿠키가 없는 경우 익명 클라이언트 반환
      return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
    }

    // 2. 쿠키에서 세션 정보 파싱 및 검증
    let sessionData;
    try {
      // URL 디코딩 후 JSON 파싱
      const decodedCookie = decodeURIComponent(cookieString);
      sessionData = JSON.parse(decodedCookie);
      
      // 세션 데이터 유효성 검증
      if (!sessionData || typeof sessionData !== 'object') {
        throw new Error('Invalid session data structure');
      }
    } catch (parseError) {
      console.error('❌ 서버사이드: 쿠키 파싱 실패:', parseError);

      // JSON 파싱이 실패한 경우 처리
      if (cookieString.startsWith('eyJ')) {
        // JWT 토큰 형태인지 확인하고 만료 검증
        try {
          const { decodeJWTPayload, isTokenExpired } = await import('@util/jwtUtil');
          const payload = decodeJWTPayload(cookieString);
          
          if (!payload || isTokenExpired(payload)) {
            console.log('🗑️ 서버사이드: 만료된/유효하지 않은 JWT 토큰 감지');
            // 만료된 쿠키 정리
            cookieStore.delete(STANDARD_COOKIE_NAME);
            return createClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
          }
          
          sessionData = {
            access_token: cookieString,
            token_type: 'bearer',
          };
        } catch (jwtError) {
          console.error('❌ 서버사이드: JWT 검증 실패:', jwtError);
          cookieStore.delete(STANDARD_COOKIE_NAME);
          return createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          );
        }
      } else {
        // 유효하지 않은 쿠키 정리
        cookieStore.delete(STANDARD_COOKIE_NAME);
        return createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
      }
    }

    // 3. access_token 추출 및 만료 검증
    const accessToken = sessionData?.access_token;
    const refreshToken = sessionData?.refresh_token;

    if (!accessToken) {
      console.log('🗑️ 서버사이드: access_token이 없는 세션 데이터, 쿠키 정리');
      cookieStore.delete(STANDARD_COOKIE_NAME);
      return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
    }

    // 토큰 만료 검증
    try {
      const { decodeJWTPayload, isTokenExpired } = await import('@util/jwtUtil');
      const payload = decodeJWTPayload(accessToken);
      
      if (!payload) {
        console.log('🗑️ 서버사이드: JWT 토큰 디코딩 실패, 쿠키 정리');
        cookieStore.delete(STANDARD_COOKIE_NAME);
        return createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
      }
      
      if (isTokenExpired(payload)) {
        console.log('🗑️ 서버사이드: 만료된 토큰 감지, 쿠키 정리');
        cookieStore.delete(STANDARD_COOKIE_NAME);
        return createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
      }
    } catch (tokenError) {
      console.error('❌ 서버사이드: 토큰 검증 실패:', tokenError);
      cookieStore.delete(STANDARD_COOKIE_NAME);
      return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
    }

    // 4. 인증된 Supabase 클라이언트 생성
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true, // 세션 유지 활성화
          autoRefreshToken: true, // 자동 토큰 갱신 활성화
          detectSessionInUrl: false, // URL에서 세션 감지 비활성화
        },
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    );

    // 5. 세션 설정 및 토큰 갱신 시도
    try {
      // 세션 설정
      const setSessionResult = await client.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      // 토큰 유효성 확인
      const {
        data: { user },
        error: userError,
      } = await client.auth.getUser();

      // 토큰이 만료된 경우 갱신 시도
      if (
        userError &&
        (userError.message?.includes('expired') ||
          userError.message?.includes('invalid'))
      ) {
        console.log('🔄 서버사이드: 토큰 만료 감지, 갱신 시도 중...');
        const {
          data: { session },
          error: refreshError,
        } = await client.auth.refreshSession();

        if (refreshError) {
          console.error('❌ 서버사이드: 토큰 갱신 실패:', refreshError);
        } else if (session) {
          console.log('✅ 서버사이드: 토큰 갱신 성공');

          // 갱신된 토큰으로 헤더 업데이트
          client.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          });

          // 갱신된 세션을 쿠키에 동기화
          await syncSessionToCookie(session);
        }
      }
    } catch (sessionError) {
      console.error('❌ 서버사이드: 세션 설정/갱신 중 오류:', sessionError);
      // 오류 발생 시 기존 토큰으로 계속 진행
    }

    return client;
  } catch (error) {
    console.error('❌ 서버사이드 Supabase 클라이언트 생성 오류:', error);
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
}

/**
 * 인증 재시도를 포함한 안전한 Supabase 클라이언트 생성
 * 인증 오류 발생 시 토큰 갱신을 통한 재시도 수행
 */
export async function getServerSupabaseWithRetry() {
  const client = await getServerSupabase();

  // 인증 상태 확인 및 재시도 로직
  const validateAndRetry = async () => {
    try {
      const {
        data: { user },
        error,
      } = await client.auth.getUser();

      if (
        error &&
        (error.message?.includes('invalid_token') ||
          error.message?.includes('expired'))
      ) {
        console.log('🔄 토큰 만료 감지, 강제 갱신 시도 중...');

        // 토큰 강제 갱신 시도
        const {
          data: { session },
          error: refreshError,
        } = await client.auth.refreshSession();

        if (refreshError) {
          console.error('❌ 토큰 갱신 실패:', refreshError);
          // 쿠키에서 세션 정보 제거
          try {
            const cookieStore = await cookies();
            cookieStore.delete('sb-access-token');
            console.log('🗑️ 만료된 세션 쿠키 제거 완료');
          } catch (cookieError) {
            console.error('❌ 쿠키 제거 실패:', cookieError);
          }
          throw refreshError;
        }

        if (session) {
          console.log('✅ 토큰 갱신 성공, 쿠키 동기화 중...');

          // 갱신된 세션을 쿠키에 동기화
          await syncSessionToCookie(session);

          // 클라이언트에 갱신된 세션 설정
          await client.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          });

          return client;
        }
      }

      return client;
    } catch (retryError) {
      console.error('❌ 인증 재시도 실패:', retryError);
      // 재시도 실패 시 익명 클라이언트 반환
      return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
    }
  };

  return await validateAndRetry();
}

/**
 * 인증이 필요한 서버사이드 작업을 안전하게 실행하는 헬퍼 함수
 * @param operation - 실행할 비동기 작업
 * @param requireAuth - 인증이 반드시 필요한지 여부 (기본값: true)
 * @returns 작업 결과와 인증 상태
 */
export async function executeWithAuth<T>(
  operation: (supabase: any, user: any) => Promise<T>,
  requireAuth: boolean = true
): Promise<{
  success: boolean;
  data?: T;
  error?: string;
  isAuthenticated: boolean;
}> {
  try {
    const supabase = await getServerSupabaseWithRetry();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const isAuthenticated = !!user && !authError;

    // 인증이 필요하지만 인증되지 않은 경우
    if (requireAuth && !isAuthenticated) {
      return {
        success: false,
        error: authError?.message || '로그인이 필요합니다.',
        isAuthenticated: false,
      };
    }

    // 작업 실행
    const result = await operation(supabase, user);

    return {
      success: true,
      data: result,
      isAuthenticated,
    };
  } catch (error) {
    console.error('executeWithAuth 오류:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.',
      isAuthenticated: false,
    };
  }
}
