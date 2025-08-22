import { getServerSupabase } from '@config/Supabase/server';
import { CommonResponse, CommonStatus } from '@model/common';
import { UserInfo } from '@model/User';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nickname = searchParams.get('nickname');
  const needPoint = searchParams.get('needPoint') === 'true';

  try {
    const supabase = await getServerSupabase();
    let query = supabase
      .from('users')
      .select(
        needPoint
          ? 'id, avatar_path, activity_level, nickname, user_point_wallets(point_code, balance)'
          : 'id, avatar_path, activity_level, nickname'
      )
      .limit(100);

    if (nickname) {
      query = query.ilike('nickname', `%${nickname}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json<CommonResponse<string>>({
        data: null,
        message: error.message,
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      });
    }

    if (!data || data.length === 0) {
      return NextResponse.json<CommonResponse<string>>({
        data: null,
        message: '사용자를 찾을 수 없습니다.',
        successOrNot: 'N',
        statusCode: CommonStatus.NOT_FOUND,
      });
    }

    const formattedData = data.map((user: any) => ({
      id: user.id,
      nickname: user.nickname,
      level: user.activity_level,
      profileImage: user.avatar_path,
      point: needPoint
        ? user.user_point_wallets?.reduce(
            (sum: number, wallet: any) => sum + (wallet.balance || 0),
            0
          ) || 0
        : 0,
      user_id: user.user_id || -1
    }));

    return NextResponse.json<CommonResponse<UserInfo[]>>({
      data: formattedData,
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
    });
  } catch (error: any) {
    return NextResponse.json<CommonResponse<string>>({
      data: null,
      message: error.message,
      successOrNot: 'N',
      statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
