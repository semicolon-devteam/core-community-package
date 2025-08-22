import { getServerSupabase } from '@config/Supabase/server';
import { HomeContents } from '@model/board';
import {
  BoardType,
  CloseLoungeType,
  OpenLoungeType,
  SportsType,
} from '@model/board/enum';
import { CommonResponse, CommonStatus } from '@model/common';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await getServerSupabase();

  const { data: dailyPopularData, error: dailyPopularError } =
    await supabase.rpc('posts_get_daily_popular', {
      p_date: new Date().toISOString().split('T')[0],
      p_limit: 10,
    }); // 일간 인기 게시글

  if (dailyPopularError) {
    return NextResponse.json({
      data: null,
      successOrNot: 'N',
      message: dailyPopularError.message,
      statusCode: CommonStatus.FAIL,
    } as CommonResponse<HomeContents>);
  }

  const { data: latestPostData, error: latestPostError } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      comment_count,
      created_at,
      view_count,
      like_count,
      board:boards(id, name)
      `
    )
    .eq('status', 'published')
    .is('deleted_at', null)
    .in('board_id', [
      OpenLoungeType.CHALLENGE,
      OpenLoungeType.SOCIAL,
      OpenLoungeType.BROADCAST,
      OpenLoungeType.ANALYTICS,
      CloseLoungeType.BRONZE,
    ])
    .order('id', { ascending: false })
    .range(0, 4);

  if (latestPostError) {
    return NextResponse.json({
      data: null,
      successOrNot: 'N',
      message: latestPostError.message,
      statusCode: CommonStatus.FAIL,
    } as CommonResponse<HomeContents>);
  }

  const { data: boardData, error } = await supabase.rpc(
    'posts_get_dashboard_recent',
    {
      p_board_ids: [
        SportsType.FOOTBALL,
        BoardType.VR,
        BoardType.SPORTS,
        OpenLoungeType.CHALLENGE,
        OpenLoungeType.FREE,
        OpenLoungeType.HUMOR,
      ],
      p_limit_per_board: 5,
    }
  );

  const response = {
    trendingItems: dailyPopularData,
    latestItems: latestPostData,
    requestedBoardItems: boardData,
  };

  if (error) {
    return NextResponse.json({
      data: null,
      successOrNot: 'N',
      message: error.message,
      statusCode: CommonStatus.FAIL,
    } as CommonResponse<HomeContents>);
  }
  return NextResponse.json({
    data: response as unknown as HomeContents,
    successOrNot: 'Y',
    statusCode: CommonStatus.SUCCESS,
  } as CommonResponse<HomeContents>);
}
