import { getServerSupabase } from '@config/Supabase/server';
import { BoardType } from '@model/board/enum';
import type { CommonResponse } from '@model/common';
import { CommonStatus } from '@model/common';
import { PartnerListResponse } from '@model/partner';
import { NextRequest, NextResponse } from 'next/server';



export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize - 1;

  const supabase = await getServerSupabase();

  const { data, count, error } = await supabase
    .from('posts')
    .select(
      `
        id,
        title,
        writer_id,
        writer_name,
        attachments,
        is_notice,
        view_count,
        comment_count,
        like_count,
        dislike_count,
        created_at,
        metadata
      `,
      { count: 'exact' }
    )
    .eq('status', 'published') 
    .is('deleted_at', null)
    .eq('board_id', BoardType.PARTNER)
    .order('id', { ascending: false })
    .range(startRange, endRange);

  if (error) {
    console.error('게시물 목록 로딩 오류:', error);
    return NextResponse.json(
      {
        data: null,
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      } as CommonResponse<null>,
      { status: 200 }
    );
  }

  const responseData: PartnerListResponse = {
    items: data.map((item) => ({
      id: item.id,
      siteName: item.title,
      recommendId: item.metadata?.recommendId ?? "",
      imageUrl: item.metadata?.thumbnail ?? "",
      siteUrl: item.metadata?.siteUrl ?? "",
    })) || [],
    totalCount: count ?? 0,
    totalPage: Math.ceil((count ?? 0) / pageSize),
  };
  
  return NextResponse.json<CommonResponse<PartnerListResponse>>({
    data: responseData,
    successOrNot: 'Y',
    statusCode: CommonStatus.SUCCESS,
  });
}
