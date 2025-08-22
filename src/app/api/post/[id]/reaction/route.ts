import { getServerSupabase } from '@config/Supabase/server';
import type { CommonResponse } from '@model/common';
import { CommonStatus } from '@model/common';
import { NextRequest, NextResponse } from 'next/server';

// @info: Type "{ params: { id: string; }; }" is not a valid type for the function's second argument.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(request: NextRequest, context: { params: any }) {
  const { id } = await context.params;

  const postId = id;

  // body에서 reactionType 추출
  const body = await request.json();
  const reactionType: 'like' | 'dislike' = body.reactionType;
  const actionText = reactionType === 'like' ? '추천' : '비추천';

  // reactionType 유효성 검사
  if (
    !reactionType ||
    (reactionType !== 'like' && reactionType !== 'dislike')
  ) {
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
        data: null,
        message: "유효하지 않은 reactionType입니다. 'like' 또는 'dislike'만 허용됩니다.",
      } as CommonResponse<any>,
      { status: 200 }
    );
  }

  const supabase = await getServerSupabase();

  // 유저 정보 가져오기
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('반응 동작 에러발생:', userError);
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
        data: null,
        message: `로그인된 사용자만 ${actionText} 가능합니다.`,
      } as CommonResponse<any>,
      { status: 200 }
    );
  }

  // 실제 user_id 가져오기
  const { data: dbUserData, error: dbUserError } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', userData.user.id)
    .single();

  if (dbUserError) {
    console.error('유저 조회 오류:', dbUserError);
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
        data: null,
        message: dbUserError.message,
      } as CommonResponse<any>,
      { status: 200 }
    );
  }

  // 이미 반응한 게시물인지 확인
  const { data: userReaction, error: userReactionError } = await supabase
    .from('reactions')
    .select('*')
    .eq('target_type', 'post')
    .eq('target_id', postId)
    .eq('user_id', dbUserData.id)
    .single();

  if (userReactionError && userReactionError.code !== 'PGRST116') {
    // PGRST116은 데이터가 없을 때의 에러 코드
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
        data: null,
        message: userReactionError.message,
      } as CommonResponse<any>,
      { status: 200 }
    );
  }

  // 이미 같은 반응을 했는지 확인
  if (userReaction) {
    if (userReaction.reaction_type === reactionType) {
      return NextResponse.json(
        {
          successOrNot: 'N',
          statusCode: CommonStatus.FAIL,
          data: null,
          message: `이미 ${actionText}한 게시물입니다.`,
        } as CommonResponse<any>,
        { status: 200 }
      );
    }
  }

  // 2. reactions 테이블에 반응 정보 저장/업데이트
  const { error: reactionError } = await supabase
    .from('reactions')
    .upsert({
      target_type: 'post', // 'user', 'post', 'comment'
      target_id: postId, // 게시물 ID
      reaction_type: reactionType, // 동적으로 설정
      user_id: dbUserData.id,
    })
    .select()
    .maybeSingle();

  if (reactionError) {
    // reactions 테이블 실패시 posts 테이블 롤백
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
        data: null,
        message: reactionError.message,
      } as CommonResponse<any>,
      { status: 200 }
    );
  }

  // 모든 작업이 성공한 경우
  return NextResponse.json(
    {
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
      data: `${actionText}이 완료되었습니다.`,
    } as CommonResponse<string>,
    { status: 200 }
  );
}
