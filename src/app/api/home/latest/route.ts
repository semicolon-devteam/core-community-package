import { getServerSupabase } from '@config/Supabase/server';
import { LatestItem } from '@model/board';
import {
  CloseLoungeType,
  OpenLoungeType
} from '@model/board/enum';
import { CommonResponse, CommonStatus } from '@model/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

  

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type: 'post' | 'comment' = searchParams.get('type') as 'post' | 'comment' ?? 'post';

  if (type !== 'post' && type !== 'comment') {
    return NextResponse.json({
      data: null,
      successOrNot: 'N',
      message: '타입이 올바르지 않습니다.',
      statusCode: CommonStatus.FAIL,
    } as CommonResponse<LatestItem[]>);
  }
  const supabase = await getServerSupabase();
  const { data, error } = type === 'post' 
    ? await latestPostResult(supabase) 
    : await latestCommentResult(supabase);

  if (error) {
    return NextResponse.json({
      data: null,
      successOrNot: 'N',
      message: error.message,
      statusCode: CommonStatus.FAIL,
    } as CommonResponse<LatestItem[]>);
  }
  return NextResponse.json({
    data: data as unknown as LatestItem[],
    successOrNot: 'Y',
    statusCode: CommonStatus.SUCCESS,
  } as CommonResponse<LatestItem[]>);
}


const latestPostResult = async (supabase: SupabaseClient) => await supabase
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

const latestCommentResult = async (supabase: SupabaseClient) => await supabase
  .from('comments')
  .select(
    `
    id,
    title:content,
    created_at,
    post_id
    `
  )
  .eq('status', 'published')
  .is('deleted_at', null)
  .order('id', { ascending: false })
  .range(0, 4);