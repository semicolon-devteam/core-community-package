import { getServerSupabase } from '@config/Supabase/server';
import type { Coin } from "@model/coin";
import type { CommonResponse } from '@model/common';
import { CommonStatus } from '@model/common';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  // 파트너 게시판 아이디 하드코딩
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize - 1;

  const supabase = await getServerSupabase();

  const { data, error } = await supabase
  .from('coin_types')
  .select('*')
  .eq('is_active', true)
  .order('display_order')
  .range(startRange, endRange);

  if (error) {
    console.error('코인 목록 로딩 오류:', error);
    return NextResponse.json(
      {
        data: null,
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      } as CommonResponse<string>,
      { status: 200 }
    );
  }

  return NextResponse.json({
    data: data,
    successOrNot: 'Y',
    statusCode: CommonStatus.SUCCESS,
  } as unknown as CommonResponse<Coin>);
}
