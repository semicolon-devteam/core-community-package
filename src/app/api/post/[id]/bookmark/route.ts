import { getServerSupabase } from '@config/Supabase/server';
import type { CommonResponse } from '@model/common';
import { CommonStatus } from '@model/common';
import { PostBookmark } from '@model/post';
import { NextRequest, NextResponse } from 'next/server';

// @info: Type "{ params: { id: string; }; }" is not a valid type for the function's second argument.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(request: NextRequest, context: { params: any }) {
  const { id } = await context.params;
  const postId = id;

  const supabase = await getServerSupabase();

  const { data: existingBookmark, error: existingBookmarkError } = await supabase
      .from('post_bookmarks')
      .select('id, user_id, post_id')
      .eq('post_id', postId)
      .maybeSingle();

  if (existingBookmarkError) {
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
        data: null,
        message: existingBookmarkError.message,
      } as CommonResponse<String>,
      { status: 200 }
    );
  }

  if (existingBookmark) {
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
        data: null,
        message: '이미 북마크된 게시글입니다.',
      } as CommonResponse<String>,
      { status: 200 }
    );
  }
  

  const { data, error } = await supabase
    .from('post_bookmarks')
    .insert([{post_id: postId}])
    .select('id, user_id, post_id')
    .single();

  if(error) {
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
        data: null,
        message: error.message,
      } as CommonResponse<String>,
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
      data: {
        id: data.id,
        userId: data.user_id,
        postId: data.post_id,
      },
    } as CommonResponse<PostBookmark>,
    { status: 200 }
  );
}

export async function DELETE(request: NextRequest, context: { params: any }) {
  const { id } = await context.params;
  const postId = id;

  const supabase = await getServerSupabase();

  const { error } = await supabase
    .from('post_bookmarks')
    .delete()
    .eq('post_id', postId);

  if (error) {
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
        data: false,
        message: error.message,
      } as CommonResponse<boolean>,
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
      data: true,
    } as CommonResponse<boolean>,
    { status: 200 }
  );
}
