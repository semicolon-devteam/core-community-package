import { getServerSupabase } from '@config/Supabase/server';
import { CommonResponse, CommonStatus } from '@model/common';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { userId, password, nickname } = await req.json();

  if (!userId || !password || !nickname) {
    return NextResponse.json(
      {
        data: null,
        message: '모든 필드가 필요합니다.',
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
      } as CommonResponse<any>,
      { status: 200 }
    );
  }

  const supabase = await getServerSupabase();
  try {
    const checkIdResponse = await supabase.rpc('users_is_login_id_duplicate', {
      p_login_id: userId,
    });
    if (checkIdResponse.data) {
      return NextResponse.json(
        {
          data: null,
          message: '이미 존재하는 아이디입니다.',
          successOrNot: 'N',
          statusCode: CommonStatus.FAIL,
        } as CommonResponse<any>,
        { status: 200 }
      );
    }
    const singUpResponse = await supabase.auth.signUp({
      email: `${userId}@example.com`,
      password,
      options: {
        data: {
          nickname: nickname,
          login_id: userId,
        },
      },
    });

    if (singUpResponse.error) {
      return NextResponse.json(
        {
          data: null,
          message: singUpResponse.error.message,
          successOrNot: 'N',
          statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
        } as CommonResponse<any>,
        { status: 200 }
      );
    }
    // 회원가입 후 자동 로그인 처리
    const signInResponse = await supabase.auth.signInWithPassword({
      email: `${userId}@example.com`,
      password,
    });

    if (signInResponse.error || !signInResponse.data.session) {
      // 자동 로그인 실패 시, 회원가입 성공 메시지와 함께 별도 로그인 진행을 안내할 수 있음.
      return NextResponse.json(
        {
          data: null,
          message: '회원가입 성공하였으나, 자동 로그인에 실패하였습니다.',
          successOrNot: 'N',
          statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
        } as CommonResponse<any>,
        { status: 200 }
      );
    }

    // JWT 토큰에서 만료 시간 추출
    const accessToken = signInResponse.data.session.access_token;
    const tokenPayload = JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64').toString()
    );
    const expiresAt = new Date(tokenPayload.exp * 1000); // 초 단위를 밀리초로 변환

    // 사용자 정보 조회
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`login_id, id, activity_level, avatar_path, permission_type`)
      .eq('auth_user_id', signInResponse?.data?.user?.id);

    // 사용자 포인트 조회
    const { data: pointData, error: pointError } = await supabase
      .from('user_point_wallets')
      .select(`point_code, balance`)
      .eq('user_id', userData?.[0]?.id);

    // 세션 토큰을 HttpOnly 쿠키에 저장 (보안 고려)
    const response = NextResponse.json(
      {
        successOrNot: 'Y',
        statusCode: CommonStatus.SUCCESS,
        data: {
          message: '회원가입 및 자동 로그인 성공',
          user: {
            id: userData?.[0]?.login_id ?? '',
            nickname: signInResponse.data.user.user_metadata.nickname,
            point:
              pointData?.reduce((sum, item) => sum + (item.balance || 0), 0) ??
              0,
            level: userData?.[0]?.activity_level ?? 0,
            profileImage: userData?.[0]?.avatar_path ?? '',
            permissionType: userData?.[0]?.permission_type ?? 'user',
            user_id: userData?.[0]?.id ?? -1,
          },
          session: {
            access_token: signInResponse.data.session.access_token,
            refresh_token: signInResponse.data.session.refresh_token,
            expires_at: signInResponse.data.session.expires_at,
            user: signInResponse.data.user,
          },
        },
      },
      { status: 200 }
    );

    // 쿠키 설정을 try-catch로 감싸서 실패 시에도 응답은 성공하도록 처리
    try {
      // 쿠키에는 필수 정보만 저장하여 크기 최소화
      const sessionData = {
        access_token: signInResponse.data.session.access_token,
        refresh_token: signInResponse.data.session.refresh_token,
        expires_at: signInResponse.data.session.expires_at,
        // user 객체 전체 대신 필수 정보만 저장
        user: {
          id: signInResponse.data.user.id,
          email: signInResponse.data.user.email,
          user_metadata: {
            nickname: signInResponse.data.user.user_metadata.nickname,
            login_id: signInResponse.data.user.user_metadata.login_id,
          }
        },
      };

      const encodedValue = encodeURIComponent(JSON.stringify(sessionData));
      
      // 쿠키 크기 체크 (4KB 미만으로 제한)
      if (encodedValue.length < 4000) {
        response.cookies.set('sb-access-token', encodedValue, {
          path: '/',
          secure: true,
          sameSite: 'lax',
          expires: expiresAt, // JWT 토큰과 동일한 만료 시간 적용
        });
      } else {
        console.warn('쿠키 크기가 너무 큽니다. 쿠키 설정을 건너뜁니다.');
        // 쿠키 설정 실패해도 응답은 성공적으로 반환
      }
    } catch (cookieError) {
      console.error('쿠키 설정 중 오류 발생:', cookieError);
      // 쿠키 설정 실패해도 응답은 성공적으로 반환
    }

    return response;
  } catch (error) {
    console.error('로그인 에러:', error);
    return NextResponse.json({ message: '회원가입 실패' }, { status: 500 });
  }
}
