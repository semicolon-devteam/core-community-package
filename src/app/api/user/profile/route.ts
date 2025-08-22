import { getServerSupabase } from "@config/Supabase/server";
import { CommonResponse, CommonStatus } from "@model/common";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  const supabase = await getServerSupabase();
  const { profileImage } = await request.json();
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

  const { data: userData, error: userError } = await supabase
    .from("users")
    .update({ avatar_path: profileImage })
    .eq("auth_user_id", data.user.id)
    .select()
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

  return NextResponse.json<CommonResponse<string>>(
    { 
      data: userData,
      successOrNot: "Y",
      statusCode: CommonStatus.SUCCESS,
    },
    { status: 200 }
  );
}