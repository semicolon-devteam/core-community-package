import { getServerSupabase } from '@config/Supabase/server';
import { CommonResponse, CommonStatus } from '@model/common';
import { NextRequest, NextResponse } from 'next/server';

// GET으로 댓글 조회
export async function GET(request: NextRequest) {
  // URL 쿼리 파라미터 가져오기
  const searchParams = request.nextUrl.searchParams;
  const postId = searchParams.get('postId');
  const page = searchParams.get('page') || '1';
  const pageSize = searchParams.get('pageSize') || '10';

  if (!postId) {
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
        data: null,
        message: '게시글 ID가 필요합니다.',
      } as CommonResponse<any>,
      { status: 200 }
    );
  }

  const pageNumber = parseInt(page, 10);
  const pageSizeNumber = parseInt(pageSize, 10);
  const start = (pageNumber - 1) * pageSizeNumber;
  const end = start + pageSizeNumber - 1;

  try {
    // 인증 없이 공개 클라이언트로 조회
    const supabase = await getServerSupabase();

    // 댓글 조회 - posts 테이블 사용
    const { data, error, count } = await supabase
      .from('comments')
      .select(
        `*, posts(title, writer_name), users!comments_writer_id_fkey(nickname, avatar_path, activity_level)`,
        { count: 'exact' }
      ) // comments의 writer_id로 users 테이블 조인
      .is('deleted_at', null) // 삭제되지 않은 댓글만 가져오기
      .eq('post_id', parseInt(postId, 10)) // 문자열을 숫자로 변환
      .order('id', { ascending: true })
      .range(start, end);

    if (error) {
      console.error('댓글 조회 오류:', error);
      return NextResponse.json(
        {
          successOrNot: 'N',
          statusCode: CommonStatus.FAIL,
          data: null,
          message: error.message,
        } as CommonResponse<any>,
        { status: 200 }
      );
    }

    let commentList = data.map(item => ({
      ...item,
      writer_name: item.users?.nickname || '익명', // users 테이블에서 nickname 가져오기
      writer_avatar: item.users?.avatar_path || '/icons/user-profile.svg', // users 테이블에서 avatar_path 가져오기
      writer_level: item.users?.activity_level || 1, // users 테이블에서 active_level 가져오기
    }));

    // 로그인 여부 확인
    const { data: userData } = await supabase.auth.getUser();
    const isLoggedIn = userData.user ? true : false;

    // 로그인 상태일 경우 내 글인지 여부 확인
    if (isLoggedIn) {
      const { data: selectedUser } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', userData.user?.id)
        .single();

      commentList = commentList.map(item => ({
        ...item,
        isMyComment: item.writer_id === selectedUser?.id,
      }));
    }

    // 성공 응답 반환
    return NextResponse.json({
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
      data: {
        items: commentList,
        totalCount: count || 0,
      },
    } as CommonResponse<any>);
  } catch (error) {
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
        data: null,
        message: '서버 오류가 발생했습니다.',
      } as CommonResponse<any>,
      { status: 200 }
    );
  }
}

// POST 메서드는 인증이 필요한 상태로 유지하고 writer 정보 추가
export async function POST(request: NextRequest) {
  const { postId, content } = await request.json();

  // 인증된 사용자 정보 가져오기
  const supabase = await getServerSupabase();

  // 현재 로그인한 사용자 정보 조회
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('댓글 작성 에러발생:', userError);
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
        data: `댓글 작성 에러발생. ${userError.message}`,
      } as CommonResponse<any>,
      { status: 200 }
    );
  }

  // 사용자 이메일에서 이름 추출 (@ 앞부분)
  const writer_name = userData.user?.user_metadata.nickname || '사용자';

  // 댓글 생성 - writer_id와 관련된 필드 제거
  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: parseInt(postId, 10),
      content: content,
      writer_name: writer_name,
    })
    .select();

  if (error) {
    console.error('댓글 생성 오류:', error);
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
        data: error.message,
      } as CommonResponse<any>,
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
      data: data,
    } as CommonResponse<any>,
    { status: 200 }
  );
}
