import { getServerSupabase } from '@config/Supabase/server';
import type { Board } from '@model/board';
import type { CommonResponse } from '@model/common';
import { CommonStatus } from '@model/common';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await getServerSupabase();

  const { data, error } = await supabase
    .from('boards')
    .select(
      `
      id, 
      name,
      description
      `
    )
    .eq('is_active', true);

  if (error) {
    console.error('게시물 목록 로딩 오류:', error);
    return NextResponse.json(
      {
        data: null,
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      } as CommonResponse<Board>,
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      data: data,
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
    } as CommonResponse<Board[]>,
    {
      status: 200,
    }
  );
}
