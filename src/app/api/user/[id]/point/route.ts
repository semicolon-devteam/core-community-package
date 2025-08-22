import { getServerSupabase } from '@config/Supabase/server';
import { CommonResponse, CommonStatus } from '@model/common';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: any }) {
  const { id } = await context.params;
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from('user_point_wallets')
    .select('balance')
    .eq('user_id', id)
    .eq('point_code', 'ACTIVITY_POINT')
    .maybeSingle();

  if (error) {
    return NextResponse.json<CommonResponse<string>>(
      {
        data: error.message,
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      },
      { status: 200 }
    );
  }



  return NextResponse.json<CommonResponse<number>>(
    {
      data: data?.balance ?? 0,
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
    },
    { status: 200 }
  );
}
