import { getServerSupabase } from '@config/Supabase/server';
import { CommonResponse, CommonStatus } from '@model/common';
import { Post } from '@model/post';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: any }) {
  const { id } = await context.params;
  const { searchParams } = request.nextUrl;
  const status: null | 'draft' | 'published' | 'blocked' | 'deleted' = searchParams.get('status') as null | 'draft' | 'published' | 'blocked' | 'deleted';
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      attachments,
      comment_count,
      like_count,
      created_at,
      view_count,
      status,
      board_id,
      attachments
    `)
    .eq('writer_id', id)
    .eq('status', status);

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


  return NextResponse.json<CommonResponse<Post>>(
    {
      data: {
        items: data,
        totalCount: data.length,
        notices: [],
      },
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
    },
    { status: 200 }
  );
}
