import { getServerSupabase } from "@config/Supabase/server";
import { CommonResponse, CommonStatus } from "@model/common";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await getServerSupabase();

  const { data, error } = await supabase
  .from('user_point_wallets')
  .select(`balance`)
  .eq("point_code", "ACTIVITY_POINT")
  .single();

  if (error) {

    return NextResponse.json({
      data: null,
      message: error.message,
      successOrNot: "N",
      statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
    } as CommonResponse<number>,
      { status: 200 }
    );
  }

  return NextResponse.json<CommonResponse<number>>(
    {
      successOrNot: "Y",
      statusCode: CommonStatus.SUCCESS,
        data: data?.balance ?? 0,
    },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { type, point } = requestBody;

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
    .select(`id`)
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

  const { data: pointData, error: pointError } = await supabase.rpc('points_use', {
    p_user_id: userData.id,
    p_point_code: 'ACTIVITY_POINT',
    p_amount: point,
    p_description: '파일 다운로드'
  })

  if (pointError) {
    return NextResponse.json({
        data: null,
        message: pointError.message,
        successOrNot: "N",
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      } as CommonResponse<any>,
      { status: 200 }
    );
  } else {
    return NextResponse.json({
        data: null,
        message: "포인트 사용 완료",
        successOrNot: "Y",
        statusCode: CommonStatus.SUCCESS,
      } as CommonResponse<any>,
      { status: 200 }
    );
  }
}