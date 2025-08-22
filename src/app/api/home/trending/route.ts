import { getServerSupabase } from '@config/Supabase/server';
import { TrendingItem } from '@model/board';
import { CommonResponse, CommonStatus } from '@model/common';
import { NextResponse } from 'next/server';

const PERIOD_RPC_MAP = {
  daily: 'posts_get_daily_popular',
  weekly: 'get_weekly_popular_posts',
  monthly: 'get_monthly_popular_posts',
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period: 'daily' | 'weekly' | 'monthly' = searchParams.get('period') as 'daily' | 'weekly' | 'monthly' ?? 'daily';

  const supabase = await getServerSupabase();

  // 모든 RPC 함수에 p_date와 p_limit 전달 (legacy route와 동일)
  const rpcParams = {
    p_date: new Date().toISOString().split('T')[0],
    p_limit: 10,
  };


  const { data: popularData, error: popularError } =
    await supabase.rpc(PERIOD_RPC_MAP[period], rpcParams);


  if (popularError) {
    return NextResponse.json({
      data: null,
      successOrNot: 'N',
      message: `${period} 트렌딩 데이터 조회 실패: ${popularError.message}`,
      statusCode: CommonStatus.FAIL,
    } as CommonResponse<TrendingItem[]>);
  }


  return NextResponse.json({
    data: popularData as TrendingItem[],
    successOrNot: 'Y',
    statusCode: CommonStatus.SUCCESS,
    message: `${period} 트렌딩 데이터 조회 성공 (${popularData?.length || 0}개 항목)`,
  } as CommonResponse<TrendingItem[]>);
}
