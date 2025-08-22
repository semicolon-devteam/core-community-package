import { getServerSupabase } from '@config/Supabase/server';
import type { CommonResponse } from '@model/common';
import { CommonStatus } from '@model/common';
import { NextRequest, NextResponse } from 'next/server';

// PUT - 게시글 발행 (DRAFT -> PUBLISHED)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;

    const supabase = await getServerSupabase();

    // 현재 사용자 확인
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      return NextResponse.json(
        {
          data: null,
          message: '인증이 필요합니다.',
          successOrNot: 'N',
          statusCode: CommonStatus.UNAUTHORIZED,
        } as CommonResponse<null>,
        { status: 200 }
      );
    }

    // 게시글이 존재하고 현재 사용자 소유인지 확인
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id, writer_id, status, users!posts_writer_id_fkey(auth_user_id)')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        {
          data: null,
          message: '게시글을 찾을 수 없습니다.',
          successOrNot: 'N',
          statusCode: CommonStatus.NOT_FOUND,
        } as CommonResponse<null>,
        { status: 200 }
      );
    }

    // 소유권 확인
    const postUser = post.users as any;
    if (postUser?.auth_user_id !== user.id) {
      return NextResponse.json(
        {
          data: null,
          message: '게시글 발행 권한이 없습니다.',
          successOrNot: 'N',
          statusCode: CommonStatus.FORBIDDEN,
        } as CommonResponse<null>,
        { status: 200 }
      );
    }

    // 이미 발행된 게시글인지 확인
    if (post.status === 'published') {
      return NextResponse.json(
        {
          data: null,
          message: '이미 발행된 게시글입니다.',
          successOrNot: 'Y',
          statusCode: CommonStatus.SUCCESS,
        } as CommonResponse<null>,
        { status: 200 }
      );
    }

    // 게시글 상태를 PUBLISHED로 변경
    const { error: updateError } = await supabase
      .from('posts')
      .update({
        status: 'published',
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId);

    if (updateError) {
      console.error('게시글 발행 중 오류:', updateError);
      return NextResponse.json(
        {
          data: null,
          message: '게시글 발행 중 오류가 발생했습니다.',
          successOrNot: 'N',
          statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
        } as CommonResponse<null>,
        { status: 200 }
      );
    }

    return NextResponse.json({
      data: null,
      message: '게시글이 성공적으로 발행되었습니다.',
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
    } as CommonResponse<null>);

  } catch (error) {
    console.error('게시글 발행 중 오류 발생:', error);
    return NextResponse.json(
      {
        data: null,
        message:
          error instanceof Error
            ? error.message
            : '게시글 발행 처리 중 오류가 발생했습니다.',
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      } as CommonResponse<null>,
      { status: 200 }
    );
  }
}