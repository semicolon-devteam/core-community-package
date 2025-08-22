import { NextResponse } from "next/server";
import { getServerSupabase } from "@config/Supabase/server";

export async function POST() {
  const supabase = await getServerSupabase();
  const { error } = await supabase.auth.signOut();

  // 응답에 쿠키 삭제 헤더 추가
  const response = NextResponse.json(
    { message: error ? "로그아웃 실패" : "로그아웃 성공" },
    { status: error ? 400 : 200 }
  );

  // 인증 관련 쿠키 명시적 삭제
  response.cookies.set("sb-access-token", "", {
    maxAge: 0,
    path: "/",
    secure: true,
    sameSite: "lax",
  });
  return response;
}
