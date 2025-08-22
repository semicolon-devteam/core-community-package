import { getServerSupabase } from "@config/Supabase/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;


  // 인증 페이지에서는 세션 검증을 건너뛰기
  if (pathname.startsWith("/authentication")) {
    return NextResponse.next();
  }

  try {
    // 1. Supabase 클라이언트 생성
    const supabase = await getServerSupabase();

    // 2. 유저 정보 가져오기
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("유저 정보 가져오기 실패 또는 세션 없음:", error);
      throw new Error("유효하지 않은 세션입니다.");
    }


    return NextResponse.next(); // 정상적으로 통과
  } catch (err) {
    console.error("미들웨어 에러:", err);

    // 세션이 유효하지 않으면 로그인 페이지로 리다이렉트
    const redirectUrl = new URL("/authentication/login", req.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }
}
export const config = {
  matcher: ["/dashboard/:path*"],
};
