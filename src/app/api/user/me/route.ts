import { getServerSupabaseWithRetry } from '@config/Supabase/server';
import { CommonResponse, CommonStatus } from '@model/common';
import { User } from '@model/User';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 인증 재시도 로직이 포함된 Supabase 클라이언트 사용
  const supabase = await getServerSupabaseWithRetry();
  const { data, error } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json<CommonResponse<string>>(
      {
        data: null,
        message: '로그인 상태가 아닙니다.',
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
      },
      { status: 200 }
    );
  }

  if (error) {
    // 토큰 갱신 후에도 인증 오류가 지속되는 경우
    const errorMessage = error.message?.includes('invalid_token')
      ? '세션이 만료되었습니다. 다시 로그인해주세요.'
      : error.message;

    return NextResponse.json(
      {
        data: null,
        message: errorMessage,
        successOrNot: 'N',
        statusCode: CommonStatus.UNAUTHORIZED,
      } as CommonResponse<String>,
      { status: 200 }
    );
  }

  // 사용자 정보 조회
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select(`login_id, id, activity_level, avatar_path, permission_type`)
    .eq('auth_user_id', data?.user?.id)
    .single();

  if (userError) {
    return NextResponse.json(
      {
        data: null,
        message: userError.message,
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      } as CommonResponse<String>,
      { status: 200 }
    );
  }

  // 사용자 포인트 조회 - 모든 지갑의 합계 계산
  const { data: pointData, error: pointError } = await supabase
    .from('user_point_wallets')
    .select(`balance`)
    .eq('user_id', userData?.id)
    .eq('point_code', 'ACTIVITY_POINT')
    .single();

  if (pointError) {
    return NextResponse.json(
      {
        data: null,
        message: pointError.message,
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      } as CommonResponse<String>,
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      data: {
        id: userData?.login_id || '',
        nickname: data.user.user_metadata?.nickname || '사용자',
        point: pointData?.balance ?? 0,
        level: userData?.activity_level ?? 0,
        profileImage: userData?.avatar_path ?? '',
        permissionType: userData?.permission_type ?? 'user',
        user_id: userData?.id || -1,
      },
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
    } as CommonResponse<User>,
    { status: 200 }
  );
}

export async function PATCH(request: NextRequest) {
  const requestBody = await request.json();

  const supabase = await getServerSupabaseWithRetry();

  const { data, error } = await supabase.auth.updateUser({
    data: requestBody,
  });

  if (error) {
    return NextResponse.json(
      {
        data: error.message,
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      } as CommonResponse<String>,
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      data: '업데이트 성공',
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
    } as CommonResponse<String>,
    { status: 200 }
  );
}
