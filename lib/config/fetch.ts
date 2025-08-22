// lib/serverFetch.ts
import { cookies } from "next/headers";

export async function serverFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("sb-access-token")?.value;

  const headers = new Headers(init.headers);

  if (sessionCookie) {
    try {
      // 쿠키에서 세션 데이터 파싱
      const decodedSession = decodeURIComponent(sessionCookie);
      const sessionData = JSON.parse(decodedSession);
      
      // access_token 추출
      const accessToken = sessionData?.access_token;
      
      if (accessToken) {
        // Authorization 헤더로 설정 (Cookie 헤더 대신)
        headers.set("Authorization", `Bearer ${accessToken}`);
        // console.log("🔑 serverFetch: Authorization 헤더 설정 완료");
      } else {
        // console.warn("⚠️ serverFetch: access_token을 찾을 수 없음");
      }
          } catch (error) {
        // console.error("❌ serverFetch: 세션 파싱 실패:", error);
      }
    } else {
      // console.log("📭 serverFetch: 세션 쿠키가 없음");
  }

  return fetch(input, {
    ...init,
    headers,
    cache: "no-store",
  });
}
