import { AuthChangeEvent, createClient } from "@supabase/supabase-js";

function createClientSupabase() {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "sb-access-token",
        storage: {
          getItem: (key: string) => {
            if (typeof window === "undefined") return null;

            try {
              const value = document.cookie
                .split("; ")
                .find((row) => row.startsWith(`${key}=`))
                ?.split("=")[1];

              if (!value) {
                return null;
              }

              const decodedValue = decodeURIComponent(value);
              
              // 토큰 유효성 검증 (만료된 토큰 자동 정리)
              try {
                const sessionData = JSON.parse(decodedValue);
                if (sessionData?.access_token) {
                  // 동적 import로 순환 참조 방지
                  import('../../utils/jwtUtil').then(({ decodeJWTPayload, isTokenExpired, removeExpiredTokenFromCookie }) => {
                    const payload = decodeJWTPayload(sessionData.access_token);
                    if (payload && isTokenExpired(payload)) {
                      console.log('🗑️ 클라이언트 Storage: 만료된 토큰 감지, 정리 중...');
                      removeExpiredTokenFromCookie(key);
                    }
                  });
                }
              } catch (parseError) {
                // JSON 파싱 실패 시 로그만 남기고 원본 반환
                console.warn('클라이언트 Storage: 세션 데이터 파싱 실패:', parseError);
              }
              
              return decodedValue;
            } catch (error) {
              console.error("❌ 클라이언트: 쿠키 읽기 실패:", error);
              return null;
            }
          },

          setItem: (key: string, value: string) => {
            if (typeof window === "undefined") return;

            try {
              // 세션 데이터 유효성 검사
              const sessionData = JSON.parse(value);
              if (!sessionData.access_token) {
                // console.warn("⚠️  클라이언트: access_token이 없는 세션 데이터");
                return;
              }

              const encodedValue = encodeURIComponent(value);
              
              // 쿠키 설정 (30일 유효)
              const expires = new Date();
              expires.setDate(expires.getDate() + 30);
              
              document.cookie = `${key}=${encodedValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`;
              
              // console.log("💾 클라이언트: 세션 정보 쿠키 저장 성공");
              // console.log("🔑 클라이언트: access_token 존재:", !!sessionData.access_token);
              // console.log("👤 클라이언트: 사용자 정보:", sessionData.user?.email);
            } catch (error) {
              // console.error("❌ 클라이언트: 쿠키 저장 실패:", error);
            }
          },

          removeItem: (key: string) => {
            if (typeof window === "undefined") return;

            try {
              document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
              // console.log("🗑️  클라이언트: 쿠키 삭제 완료");
            } catch (error) {
              // console.error("❌ 클라이언트: 쿠키 삭제 실패:", error);
            }
          },
        },
      },
    }
  );

  // 세션 상태 변경 감지 및 처리
  if (typeof window !== "undefined") {
    let isHandlingSignOut = false;  // 로그아웃 처리 중복 방지 플래그

    client.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      // console.log("🔄 클라이언트: 인증 상태 변경:", event);
      
      switch (event) {
        case "SIGNED_OUT":
          if (!isHandlingSignOut) {
            isHandlingSignOut = true;
            // 쿠키 및 로컬 상태 정리
            client.auth.getSession().then(() => {
              isHandlingSignOut = false;
            });
          }
          break;
          
        case "TOKEN_REFRESHED":
          if (session) {
            // console.log("🔄 클라이언트: 토큰 갱신됨");
            // 필요한 경우 추가 처리
          }
          break;
          
        case "USER_UPDATED":
          if (!session) {
            // 세션이 없는 경우에만 로그아웃 처리
            if (!isHandlingSignOut) {
              isHandlingSignOut = true;
              client.auth.signOut().then(() => {
                isHandlingSignOut = false;
              });
            }
          }
          break;
      }
    });
  }

  return client;
}

export const clientSupabase = createClientSupabase();
