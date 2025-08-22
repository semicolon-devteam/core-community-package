import { getServerSupabase } from '@config/Supabase/server';
import type { CommonResponse } from '@model/common';
import { CommonStatus } from '@model/common';
import { PostDownloadHistory } from '@services/postService';
import { NextRequest, NextResponse } from 'next/server';

// @info: Type "{ params: { id: string; }; }" is not a valid type for the function's second argument.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(request: NextRequest, context: { params: any }) {
  const { id } = await context.params;
  const postId = id;

  const supabase = await getServerSupabase();

  // 24시간 후
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // 파일 다운로드 기록 생성
  // TODO: rpc 변경 시 수정 필요
  const { data: postDownloadHistoryData, error: postDownloadHistoryError } =
    await supabase.rpc('post_download_history_create', {
      p_post_id: postId,
      p_expires_at: expiresAt.toISOString(),
    });

  if (postDownloadHistoryError) {
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
        data: null,
        message: postDownloadHistoryError.message,
      } as CommonResponse<String>,
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
      data: postDownloadHistoryData,
    } as CommonResponse<PostDownloadHistory>,
    { status: 200 }
  );
}
