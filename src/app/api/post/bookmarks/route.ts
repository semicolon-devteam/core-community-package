import { getServerSupabase } from '@config/Supabase/server';
import { CommonResponse, CommonStatus } from '@model/common';
import { GalleryListItem } from '@model/post';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
  .from('post_bookmarks')
  .select(`
      posts:post_id (
        id,
        title,
        attachments,
        comment_count,
        like_count,
        metadata
      )
    `)
    .order('id', { ascending: false });
    // .range(0, 9);

  if (error) {
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
        data: null,
        message: error.message,
      } as CommonResponse<GalleryListItem[]>,
      { status: 200 }
    );
  }
  // posts 객체를 추출하여 평면화
  const flattenedData = data?.map(item => item.posts).filter(Boolean) || [];
  
  return NextResponse.json(
    {
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
      data: flattenedData,
    } as unknown as CommonResponse<GalleryListItem[]>,
    { status: 200 }
  );
}

export async function DELETE(request: Request) {
  const { postId } = await request.json();
  const supabase = await getServerSupabase();
  const { error } = await supabase.from('post_bookmarks').delete().eq('post_id', postId);
  if (error) {
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
        data: false,
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