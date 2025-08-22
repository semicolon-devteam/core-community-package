import { getServerSupabase } from '@config/Supabase/server';
import { CommonResponse, CommonStatus } from '@model/common';
import { User } from '@model/User';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: any }) {
  const { id } = await context.params;
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from('users')
    .select('id, login_id, avatar_path, activity_level, nickname, permission_type')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return NextResponse.json<CommonResponse<any>>(
      {
        data: null,
        message: error.message,
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      },
      { status: 200 }
    );
  }

  const { data: pointData, error: pointError } = await supabase
    .from('user_point_wallets')
    .select('point_code, balance')
    .eq('user_id', id);

  if (pointError) {
    return NextResponse.json<CommonResponse<any>>(
      {
        data: null,
        message: pointError.message,
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      },
      { status: 200 }
    );
  }

  return NextResponse.json<CommonResponse<User>>(
    {
      data: {
        id: data?.login_id,
        nickname: data?.nickname,
        point:
          pointData?.reduce((sum, item) => sum + (item.balance || 0), 0) ?? 0,
        level: data?.activity_level ?? 0,
        profileImage: data?.avatar_path ?? '',
        permissionType: data?.permission_type ?? 'user',
        user_id: data?.id ?? -1,
      },
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
    },
    { status: 200 }
  );
}
