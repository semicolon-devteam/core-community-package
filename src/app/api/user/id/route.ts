import { getServerSupabase } from "@config/Supabase/server";
import { CommonResponse, CommonStatus } from "@model/common";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return NextResponse.json<CommonResponse<string>>({
      data: null,
      message: error.message,
      successOrNot: "N",
      statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
    });
  }

  if (!data.user) {
    return NextResponse.json<CommonResponse<string>>({
      data: null,
      message: "로그인 상태가 아닙니다.",
      successOrNot: "N",
      statusCode: CommonStatus.UNAUTHORIZED,
    });
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", data.user?.id);

  if (userError) {
    return NextResponse.json<CommonResponse<string>>({
      data: null,
      message: userError.message,
      successOrNot: "N",
      statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
    });
  }

  return NextResponse.json<CommonResponse<string>>({
    data: userData?.[0]?.id.toString(),
    successOrNot: "Y",
    statusCode: CommonStatus.SUCCESS,
  });
}
