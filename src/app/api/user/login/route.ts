import { getServerSupabase } from "@config/Supabase/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // DEPRECATED: 이 API는 더 이상 권장되지 않습니다. 
  // 클라이언트에서 직접 Supabase auth를 사용하고 /api/user/me로 사용자 정보를 조회하세요.
  
  console.warn("[DEPRECATED] /api/user/login is deprecated. Use client-side Supabase auth + /api/user/me instead.");
  
  const supabase = await getServerSupabase();
  try {
    // 현재 세션에서 사용자 정보만 반환 (로그인은 클라이언트에서 처리)
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return NextResponse.json(
        { message: "로그인이 필요합니다. 클라이언트에서 먼저 로그인을 진행해주세요." },
        { status: 401 }
      );
    }

    // 사용자 정보 조회
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select(`id, login_id, activity_level, avatar_path, permission_type`)
      .eq("auth_user_id", data?.user?.id);

    // 사용자 포인트 조회
    const { data: pointData, error: pointError } = await supabase
      .from("user_point_wallets")
      .select(`point_code, balance`)
      .eq("user_id", userData?.[0]?.id);

    return NextResponse.json(
      {
        message: "사용자 정보 조회 성공",
        user: {
          id: userData?.[0]?.login_id ?? '',
          nickname: data.user.user_metadata.nickname,
          point:
            pointData?.reduce((sum, item) => sum + (item.balance || 0), 0) ?? 0,
          level: userData?.[0]?.activity_level ?? 0,
          profileImage: userData?.[0]?.avatar_path ?? "",
          permissionType: userData?.[0]?.permission_type ?? "user",
          user_id: userData?.[0]?.id ?? 0,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("사용자 정보 조회 에러:", err);
    return NextResponse.json(
      { message: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
