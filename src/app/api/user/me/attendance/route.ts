import { getServerSupabase } from "@config/Supabase/server";
import { CommonResponse, CommonStatus } from "@model/common";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await getServerSupabase();

  const { data: userAuthData, error: userAuthError } = await supabase.auth.getUser();

  if (userAuthError) {
    return NextResponse.json({
      data: null,
      message: userAuthError.message,
      successOrNot: "N",
      statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
    } as CommonResponse<any>,
      { status: 200 }
    );
  }

  const { data: userDBData, error: userDBError } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', userAuthData?.user?.id)
    .single();

  if(userDBError) {
    return NextResponse.json({
      data: null,
      message: userDBError.message,
      successOrNot: "N",
      statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
    } as CommonResponse<any>,
      { status: 200 }
    );
  }

  const today = new Date().toISOString().split('T')[0];

  const { data: attendanceData, error: attendanceError } = await supabase
    .from('user_attendance')
    .select('*')
    .eq('user_id', userDBData?.id)
    .eq('attendance_date', today)
    .single();
    

  if(attendanceError) {
    return NextResponse.json({
        data: null,
        message: attendanceError.message,
        successOrNot: "N",
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      } as CommonResponse<any>,
      { status: 200 }
    );
  }

  return NextResponse.json({
      data: attendanceData,
      successOrNot: "Y",
      statusCode: CommonStatus.SUCCESS,
    } as CommonResponse<any>,
    { status: 200 }
  );
}

export async function POST() {

  const supabase = await getServerSupabase();

  const { data: attendanceData, error: attendanceError } = await supabase.rpc('user_attendance_process');

  if (attendanceError) {
    return NextResponse.json({
      data: null,
      message: attendanceError.message,
      successOrNot: "N",
      statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
    } as CommonResponse<any>,
    { status: 200 }
  );
  }

  return NextResponse.json({
    data: attendanceData,
    successOrNot: "Y",
    statusCode: CommonStatus.SUCCESS,
  } as CommonResponse<String>,
  { status: 200 }
);
}