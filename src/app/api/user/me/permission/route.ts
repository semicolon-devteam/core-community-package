import { getServerSupabase } from "@config/Supabase/server";
import { CommonResponse, CommonStatus } from "@model/common";
import { UserPermission } from "@model/User";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json<CommonResponse<any>>(
      { 
        data: null,
        message: "로그인 상태가 아닙니다.",
        successOrNot: "N",
        statusCode: CommonStatus.UNAUTHORIZED,
      },
      { status: 200 }
    );
  }

  if (error) {
    return NextResponse.json({
      data: null,
      message: error.message,
      successOrNot: "N",
      statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
    } as CommonResponse<any>,

      { status: 200 }
    );
  }
  // 사용자 정보 조회
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select(`activity_level, permission_type`)
    .eq("auth_user_id", data?.user?.id)
    .single();

  if (userError) {
    return NextResponse.json({
      data: null,
      message: userError.message,
      successOrNot: "N",
      statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
    } as CommonResponse<any>,
      { status: 200 }
    );
  }

  return NextResponse.json<CommonResponse<UserPermission>>(
    {
      successOrNot: "Y",
      statusCode: CommonStatus.SUCCESS,
      data: {
        level: userData?.activity_level ?? 0,
        permissionType: userData?.permission_type ?? "anonymous",
      },
    },
    { status: 200 }
  );
}