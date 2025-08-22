import { getServerSupabase } from '@config/Supabase/server';
import { Post } from '@model/board';

import { CommonResponse, CommonStatus } from '@model/common';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get('boardId');

  if (!boardId) {
    return NextResponse.json({
      data: null,
      successOrNot: 'N',
      message: '게시판 아이디가 필요합니다.',
      statusCode: CommonStatus.FAIL,
    } as CommonResponse<Post[]>);
  }

  const supabase = await getServerSupabase();

  const { data: latestPostData, error: latestPostError } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      content,
      board_id,
      metadata,
      is_notice,
      writer_id,
      created_at,
      like_count,
      view_count,
      comment_count,
      board:boards(name)
      `
    )
    .eq('status', 'published')
    .eq('board_id', boardId)
    .order('id', { ascending: false })
    .range(0, 4);

  if (latestPostError) {
    return NextResponse.json({
      data: null,
      successOrNot: 'N',
      message: latestPostError.message,
      statusCode: CommonStatus.FAIL,
    } as CommonResponse<Post[]>);
  }

  return NextResponse.json({
    data: latestPostData.map((item: any) => ({
      ...item,
      board_name: item.board?.name,
    })) as unknown as Post[],
    successOrNot: 'Y',
    statusCode: CommonStatus.SUCCESS,
  } as CommonResponse<Post[]>);
}
