import { getServerSupabase } from '@config/Supabase/server';
import type { CommonResponse } from '@model/common';
import { CommonStatus } from '@model/common';
import type { ListPost, Post } from '@model/post';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const boardIdParam = searchParams.get('boardId');
  const boardId = boardIdParam ? parseInt(boardIdParam) : null;
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const categoryId = searchParams.get('categoryId') || null;
  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize - 1;
  const searchType = searchParams.get('searchType') || 'title_content';
  const searchText = searchParams.get('searchText') || '';
  const sortBy = searchParams.get('sortBy') || 'latest';
  const status = searchParams.get('status') || 'published';
  const writerId = searchParams.get('writerId') || null;
  const needNotice = (searchParams.get('needNotice') || 'false').toLowerCase() === 'true';

  if (writerId === '-1') {
    return NextResponse.json({
      data: null,
      successOrNot: 'N',
      statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      message: '사용자 id가 제대로 지정되지 않았습니다.',
    } as CommonResponse<Post>);
  }

  const supabase = await getServerSupabase();
  
  // status가 draft인 경우 현재 로그인한 사용자의 ID를 가져오기

  if (searchText.length > 100) {
    return NextResponse.json({
      data: null,
      successOrNot: 'N',
      statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
    } as CommonResponse<Post>);
  }

  // boardId가 있는 경우에만 게시판 정보 및 공지사항 가져오기
  let notices: ListPost[] = [];
  let noticeCount = 0;
  
  if (boardId && needNotice) {
    const { data: boardData, error: boardError } = await supabase
      .from('boards')
      .select('display_settings')
      .eq('id', boardId)
      .maybeSingle();

    if (boardError) {
      console.error('게시판 정보 로딩 오류:', boardError);
      return NextResponse.json({
        data: null,
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      } as CommonResponse<Post>);
    }

    noticeCount = boardData?.display_settings?.notice_count || 3;

    if (noticeCount > 0) {
      const { data: noticeData, error: noticeError } = await supabase
        .from('posts')
        .select(
          `
          id, 
          title, 
          attachments,
          created_at, 
          is_notice, 
          view_count, 
          comment_count, 
          like_count, 
          dislike_count, 
          users!posts_writer_id_fkey(nickname, avatar_path, activity_level), 
          metadata
        `
        )
        .eq('is_notice', true)
        .eq('board_id', boardId)
        .order('created_at', { ascending: false })
        .limit(noticeCount);

      if (noticeError) {
        console.error('공지사항 로딩 오류:', noticeError);
        return NextResponse.json({
          data: null,
          successOrNot: 'N',
          statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
        } as CommonResponse<Post>);
      }
      notices = noticeData as unknown as ListPost[];
    }
  }

  // TODO: content 제거 후 수정 필요
  let query = supabase
    .from('posts')
    .select(
      `
      id,
      title,
      status,
      writer_id,
      writer_name,
      attachments,
      is_notice,
      board_id,
      view_count,
      content,
      comment_count,
      like_count,
      dislike_count,
      created_at,
      users!posts_writer_id_fkey(
        nickname,
        avatar_path,
        activity_level
      ),
      metadata
    `,
      { count: 'exact' }
    )
    .eq('status', status)
    .is('deleted_at', null);
  
  if (writerId) {
    query = query.eq('writer_id', writerId);
  }


  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  // boardId가 있고 0이 아닌 경우에만 필터링
  if (boardId !== null && boardId !== 0) {
    query = query.eq('board_id', boardId);
  }

  // 검색어가 있는 경우에만 검색 조건 추가
  if (searchText) {
    switch (searchType) {
      case 'title_content':
        query = query.or(
          `title.ilike.%${searchText}%,content.ilike.%${searchText}%`
        );
        break;
      case 'title':
        query = query.ilike('title', `%${searchText}%`);
        break;
      case 'content':
        query = query.ilike('content', `%${searchText}%`);
        break;
      case 'writer':
        query = query.ilike('writer_name', `%${searchText}%`);
        break;
    }
  }

  // 정렬 조건 추가
  switch (sortBy) {
    case 'latest':
      query = query.order('id', { ascending: false });
      break;
    case 'views':
      query = query.order('view_count', { ascending: false });
      break;
    case 'popular':
      query = query.order('like_count', { ascending: false });
      break;
  }

  const { data, count, error } = await query.range(startRange, endRange);

  if (error) {
    console.error('게시물 목록 로딩 오류:', error);
    return NextResponse.json(
      {
        data: null,
        message: error.message,
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      } as CommonResponse<Post>,
      { status: 200 }
    );
  }

  return NextResponse.json({
    data: {
      items: data as unknown as ListPost[],
      totalCount: count,
      notices,
    },
    successOrNot: 'Y',
    statusCode: CommonStatus.SUCCESS,
  } as CommonResponse<Post>);
}
