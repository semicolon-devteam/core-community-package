import {
  getServerSupabase,
  getServerSupabaseWithRetry,
} from '@config/Supabase/server';
import type { CommonResponse } from '@model/common';
import { CommonStatus } from '@model/common';
import type { PostDetail } from '@model/post';
import { NextRequest, NextResponse } from 'next/server';

// GET으로 특정 ID의 게시물 조회
// @info: Type "{ params: { id: string; }; }" is not a valid type for the function's second argument.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, context: { params: any }) {
  // URL에서 ID 가져오기
  const { id } = await context.params;
  const postId = id;

  console.log('📋 게시글 조회 API 시작', { postId });

  // 클라이언트 IP 주소 가져오기
  let clientIp =
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for') ||
    '127.0.0.1';

  // IPv6 로컬호스트를 IPv4로 변환
  if (clientIp === '::1') {
    clientIp = '127.0.0.1';
  }
  // x-forwarded-for 헤더에 여러 IP가 있을 경우 첫 번째 IP만 사용
  if (clientIp && clientIp.includes(',')) {
    clientIp = clientIp.split(',')[0].trim();
  }

  console.log('🌐 클라이언트 IP:', clientIp);

  // 인증 재시도 로직이 포함된 Supabase 클라이언트 사용
  console.log('🔧 Supabase 클라이언트 생성 중...');
  const supabase = await getServerSupabaseWithRetry();

  // RLS를 통한 권한 체크와 게시글 상세 정보 조회를 한 번에 처리

  const { data, error } = await supabase.rpc('posts_read', {
    p_post_id: Number(postId),
    p_viewer_ip: clientIp,
  });
  if (error || !data) {
    // RLS에서 차단된 경우 또는 게시글이 존재하지 않는 경우
    const errorMessage = error?.message || '게시글 정보를 불러올 수 없습니다.';

    // 권한 관련 오류인지 확인
    if (
      error?.message?.includes('permission') ||
      error?.message?.includes('access')
    ) {
      console.log('🚫 권한 오류로 판단');
      return NextResponse.json(
        {
          data: null,
          message: '해당 게시글에 접근할 권한이 없습니다.',
          successOrNot: 'N',
          statusCode: CommonStatus.FORBIDDEN,
        } as CommonResponse<PostDetail>,
        { status: 200 }
      );
    }

    // 게시글이 존재하지 않는 경우
    if (error?.code === 'PGRST116' || !data) {
      console.log('📭 게시글 없음으로 판단');
      return NextResponse.json(
        {
          data: null,
          message: '게시글을 찾을 수 없습니다.',
          successOrNot: 'N',
          statusCode: CommonStatus.NOT_FOUND,
        } as CommonResponse<PostDetail>,
        { status: 200 }
      );
    }

    // 기타 오류
    console.log('❌ 기타 오류로 판단');
    return NextResponse.json(
      {
        data: null,
        message: errorMessage,
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      } as CommonResponse<PostDetail>,
      { status: 200 }
    );
  }

  // 게시글과 관련된 모든 정보를 한 번의 쿼리로 조회 (JOIN 활용)
  const { data: postDetails, error: detailsError } = await supabase
    .from('posts')
    .select(
      `
      id,
      board_id,
      writer_id,
      boards!posts_board_id_fkey(
        name,
        permission_settings,
        point_settings,
        feature_settings,
        display_settings
      ),
      users!posts_writer_id_fkey(
        nickname,
        avatar_path,
        activity_level
      )
    `
    )
    .eq('id', postId)
    .single();

  if (detailsError || !postDetails) {
    console.error('❌ 게시글 상세 정보 조회 실패:', detailsError);
    return NextResponse.json(
      {
        data: null,
        message: '게시글 정보를 불러올 수 없습니다.',
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      } as CommonResponse<PostDetail>,
      { status: 200 }
    );
  }

  // 메뉴 링크 조회 (별도 쿼리)
  console.log('🔗 메뉴 링크 조회 중...');
  const { data: menuData } = await supabase
    .from('menu')
    .select('link_url')
    .eq('board_id', data.board_id)
    .eq('type', 'board')
    .maybeSingle();

  console.log('🔗 메뉴 링크 결과:', { linkUrl: menuData?.link_url });

  // 다운로드 히스토리 조회 (별도 RPC 호출 필요)
  console.log('📥 다운로드 히스토리 조회 중...');
  const { data: postDownloadHistory, error: downloadHistoryError } =
    await supabase.rpc('post_download_history_get_exist', {
      p_post_id: postId,
    });

  // 다운로드 히스토리 조회 실패는 치명적이지 않으므로 로깅만 하고 계속 진행
  if (downloadHistoryError) {
    console.warn('⚠️ 다운로드 히스토리 조회 실패:', downloadHistoryError);
  } else {
    console.log('📥 다운로드 히스토리 결과:', {
      hasHistory: !!postDownloadHistory,
    });
  }

  // 응답 데이터 구성
  const boardInfo = postDetails.boards as any;
  const writerInfo = postDetails.users as any;

  console.log('📦 최종 응답 데이터 구성', {
    boardName: boardInfo?.name,
    writerNickname: writerInfo?.nickname,
    hasPermissionSettings: !!boardInfo?.permission_settings,
    hasPointSettings: !!boardInfo?.point_settings,
  });

  console.log('✅ 게시글 조회 API 완료');

  return NextResponse.json({
    data: {
      ...data,
      board: {
        id: data.board_id,
        name: boardInfo?.name,
        link_url: menuData?.link_url || '/',
      },
      writer_nickname: writerInfo?.nickname,
      writer_avatar: writerInfo?.avatar_path,
      writer_level: writerInfo?.activity_level,
      permission_settings: {
        listLevel: boardInfo?.permission_settings?.list_level,
        readLevel: boardInfo?.permission_settings?.read_level,
        writeLevel: boardInfo?.permission_settings?.write_level,
        uploadLevel: boardInfo?.permission_settings?.upload_level,
        commentLevel: boardInfo?.permission_settings?.comment_level,
      },
      point_settings: boardInfo?.point_settings,
      feature_settings: boardInfo?.feature_settings,
      post_download_history: postDownloadHistory,
    },
    successOrNot: 'Y',
    statusCode: CommonStatus.SUCCESS,
  } as CommonResponse<PostDetail>);
}

// @info: Type "{ params: { id: string; }; }" is not a valid type for the function's second argument.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(request: NextRequest, context: { params: any }) {
  // URL에서 ID 가져오기
  try {
    // URL에서 ID 가져오기
    const { id } = await context.params;

    // Content-Type 확인
    const contentType = request.headers.get('content-type') || '';

    // 요청 데이터 파싱 (FormData 또는 JSON)
    let requestBody;

    if (contentType.includes('multipart/form-data')) {
      // FormData 처리
      const formData = await request.formData();
      requestBody = {
        title: formData.get('title'),
        content: formData.get('content'),
        attachments: formData.get('attachments'),
        metadata: formData.get('metadata'),
        categoryId: formData.get('categoryId'),
        downloadPoint: formData.get('downloadPoint'),
        isNotice: formData.get('isNotice') === 'true',
        hasFiles: formData.get('hasFiles') === 'true',
      };

      // attachments가 문자열로 전달된 경우 JSON으로 파싱
      if (
        requestBody.attachments &&
        typeof requestBody.attachments === 'string'
      ) {
        try {
          requestBody.attachments = JSON.parse(requestBody.attachments);
        } catch (e) {
          console.error('첨부파일 정보 파싱 에러:', e);
        }
      }

      // metadata가 문자열로 전달된 경우 JSON으로 파싱
      if (requestBody.metadata && typeof requestBody.metadata === 'string') {
        try {
          requestBody.metadata = JSON.parse(requestBody.metadata);
        } catch (e) {
          console.error('메타데이터 파싱 에러:', e);
        }
      }
    } else {
      // JSON 처리
      requestBody = await request.json();
    }

    // 클라이언트 IP 주소 가져오기
    let clientIp =
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for') ||
      '127.0.0.1';

    // IPv6 로컬호스트를 IPv4로 변환
    if (clientIp === '::1') {
      clientIp = '127.0.0.1';
    }
    // x-forwarded-for 헤더에 여러 IP가 있을 경우 첫 번째 IP만 사용
    if (clientIp && clientIp.includes(',')) {
      clientIp = clientIp.split(',')[0].trim();
    }

    const supabase = await getServerSupabase();
    
    // 첨부파일이 있는 경우 DRAFT, 없는 경우 PUBLISHED로 설정
    const postStatus = requestBody.hasFiles ? 'draft' : 'published';
    
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          board_id: Number(id),
          parent_id: null, // 부모 게시물 ID
          writer_ip: clientIp, // TODO IP 주소 가져오는 방법 논의 필요.
          title: requestBody.title,
          content: requestBody.content,
          attachments: requestBody.attachments, // 첨부파일 목록
          metadata: requestBody.metadata, // 메타데이터 (썸네일 URL 등)
          restrict_attachments: [],
          password: null, // 비밀글일 경우 사용
          is_notice: requestBody.isNotice,
          is_secret: false,
          is_anonymous: false,
          category_id: requestBody.categoryId,
          download_point: requestBody.downloadPoint,
          status: postStatus, // 첨부파일 유무에 따라 상태 결정
        },
      ])
      .select()
      .maybeSingle();

    if (error) {
      console.error('게시글 작성 중 오류가 발생했습니다.', error);
      return NextResponse.json(
        {
          data: null,
          message: error.message,
          successOrNot: 'N',
          statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
        } as CommonResponse<PostDetail>,
        { status: 200 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          data: null,
          successOrNot: 'N',
          statusCode: CommonStatus.FAIL,
        } as CommonResponse<PostDetail>,
        { status: 200 }
      );
    }

    // TODO: supabase ID와 비교해서 내껀지 확인 필요
    return NextResponse.json({
      data: data,
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
    } as CommonResponse<PostDetail>);
  } catch (error) {
    console.error('게시글 생성 중 오류 발생:', error);
    return NextResponse.json(
      {
        data: null,
        message:
          error instanceof Error
            ? error.message
            : '게시글 작성 처리 중 오류가 발생했습니다.',
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      } as CommonResponse<PostDetail>,
      { status: 200 }
    );
  }
}

// PUT 또는 PATCH로 특정 ID의 게시물 수정
// @info: Type "{ params: { id: string; }; }" is not a valid type for the function's second argument.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(request: NextRequest, { params }: { params: any }) {
  const { id: postId } = params;
  const body = await request.json();

  const supabase = await getServerSupabase();

  const { error: postUpdateError } = await supabase
    .from('posts')
    .update({
      title: body.title,
      content: body.content,
      attachments: body.attachments,
      metadata: body.metadata,
      updated_at: new Date().toISOString(),
      category_id: body.categoryId,
      download_point: body.downloadPoint,
    })
    .eq('id', postId);

  if (postUpdateError) {
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
        data: null,
        message: '게시글 수정 중 오류가 발생했습니다.',
      } as CommonResponse<any>,
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
      data: null,
      message: '게시글 수정 완료',
    } as CommonResponse<any>,
    { status: 200 }
  );
}

// PATCH로 특정 ID의 게시물 이동 (게시판 변경)
// @info: Type "{ params: { id: string; }; }" is not a valid type for the function's second argument.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(request: NextRequest, { params }: { params: any }) {
  const { id: postId } = await params;
  const body = await request.json();

  console.log('📋 게시글 이동 API 시작', {
    postId,
    targetBoardId: body.board_id,
  });

  const supabase = await getServerSupabase();

  // 현재 사용자가 admin인지 확인
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) {
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.UNAUTHORIZED,
        data: null,
        message: '인증이 필요합니다.',
      } as CommonResponse<any>,
      { status: 200 }
    );
  }

  // 사용자의 admin 권한 확인
  const { data: userProfile, error: userProfileError } = await supabase
    .from('users')
    .select('permission_type, activity_level')
    .eq('auth_user_id', user.id)
    .single();

  const isAdmin =
    (userProfile?.permission_type === 'admin' ||
      userProfile?.permission_type === 'super_admin') &&
    userProfile?.activity_level === 99;

  if (!isAdmin || userProfileError) {
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.FORBIDDEN,
        data: null,
        message: userProfileError
          ? userProfileError.message
          : '관리자 권한이 필요합니다.',
      } as CommonResponse<any>,
      { status: 200 }
    );
  }

  // 게시글 이동 (board_id 업데이트)
  const { error: moveError } = await supabase
    .from('posts')
    .update({ board_id: body.board_id })
    .eq('id', postId);

  if (moveError) {
    console.error('게시글 이동 중 오류:', moveError);
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
        data: null,
        message: '게시글 이동 중 오류가 발생했습니다.',
      } as CommonResponse<any>,
      { status: 200 }
    );
  }

  console.log('✅ 게시글 이동 완료');

  return NextResponse.json(
    {
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
      data: null,
      message: '게시글이 성공적으로 이동되었습니다.',
    } as CommonResponse<any>,
    { status: 200 }
  );
}

// DELETE로 특정 ID의 게시물 삭제
export async function DELETE(
  request: NextRequest,
  // @info: Type "{ params: { id: string; }; }" is not a valid type for the function's second argument.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: { params: any }
) {
  const { id: postId } = params;

  const supabase = await getServerSupabase();

  const { error: deleteError } = await supabase
    .from('posts')
    .update({ status: 'deleted' })
    .eq('id', postId);

  if (deleteError) {
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
        data: null,
        message: '게시글 삭제 오류',
      } as CommonResponse<any>,
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
      data: null,
      message: '게시글 삭제 완료',
    } as CommonResponse<any>,
    { status: 200 }
  );
}
