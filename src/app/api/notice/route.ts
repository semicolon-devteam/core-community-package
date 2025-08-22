import { getServerSupabase } from '@config/Supabase/server';
import { Notice } from '@model/post';
import { CustomerType } from '@model/board/enum';
import type { CommonResponse } from '@model/common';
import { CommonStatus } from '@model/common';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
        id, 
        title,
        content,
        created_at
      `
    )
    .eq('board_id', CustomerType.NOTICE)
    .eq('status', 'published')
    .order('id', { ascending: false });
  if (error) {
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
        data: null,
        message: error.message,
      } as CommonResponse<null>,
      { status: 200 }
    );
  }
  return NextResponse.json(
    {
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
      data: data.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        createdAt: item.created_at,
        isNew:
          item.created_at >
          new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      })),
    } as CommonResponse<Notice[]>,
    { status: 200 }
  );
}
