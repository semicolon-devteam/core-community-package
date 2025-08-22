import { getServerSupabase } from '@config/Supabase/server';
import { CommonResponse, CommonStatus } from '@model/common';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest, context: { params: any }) {
  const { id } = await context.params;
  const { point, reason } = await request.json();
  const supabase = await getServerSupabase();

  // 포인트 증가 rpc
  const { data, error } = await supabase.rpc('points_issue', {
    p_user_id: id,
    p_point_code: 'ACTIVITY_POINT',
    p_amount: point,
    p_policy_id: 1,
    p_description: reason,
  });

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

  return NextResponse.json<CommonResponse<any>>(
    {
      data: null,
      message: '포인트가 성공적으로 지급되었습니다.',
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
    },
    { status: 200 }
  );
}
