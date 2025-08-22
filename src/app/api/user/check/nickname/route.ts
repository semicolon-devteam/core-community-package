import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@config/Supabase/server';
import type { CommonResponse } from '@model/common';
import { CommonStatus } from '@model/common';

export async function POST(req: NextRequest) {
  const { nickname } = await req.json();

  if (!nickname) {
    return NextResponse.json(
      {
        data: null,
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      } as CommonResponse<boolean>,
      { status: 200 }
    );
  }

  const supabase = await getServerSupabase();
  try {
    const checkIdResponse = await supabase.rpc('users_is_nickname_duplicate', {
      p_nickname: nickname,
    });
    if (checkIdResponse.data) {
      return NextResponse.json(
        {
          data: true,
          successOrNot: 'Y',
          statusCode: CommonStatus.SUCCESS,
        } as CommonResponse<boolean>,
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          data: false,
          successOrNot: 'Y',
          statusCode: CommonStatus.SUCCESS,
        } as CommonResponse<boolean>,
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('닉네임 중복 검사 오류:', error);
    return NextResponse.json(
      {
        data: null,
        message: '닉네임 중복 검사 오류',
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      } as CommonResponse<boolean>,
      { status: 200 }
    );
  }
}
