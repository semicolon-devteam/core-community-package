import { serverFetch } from '@config/fetch';
import { getServerSupabaseWithRetry } from '@config/Supabase/server';
import type { CommonResponse } from '@model/common';
import { CommonStatus } from '@model/common';
import type { User } from '@model/User';

const UserServiceByServerSide = {
  getMyInfo: async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`;
      const res = await serverFetch(url);
      const json = await res.json();
      return {
        data: json.data ?? null,
        successOrNot: json.successOrNot,
        statusCode: json.statusCode,
      };
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error);
      // 오류 발생 시 기본값 반환
      return {
        data: null,
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      };
    }
  },

  getInfoById: async (id: number) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/user/${id}`;
      const res = await serverFetch(url);
      const json = await res.json();
      return {
        data: json.data ?? null,
        successOrNot: json.successOrNot,
        statusCode: json.statusCode,
      };
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error);
      return {
        data: null,
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      };
    }
  },

  /**
   * 서버 컴포넌트에서 간단한 인증 상태 확인
   * 로그인이 필요한 페이지에서 사용
   */
  checkAuth: async (): Promise<{
    isAuthenticated: boolean;
    user: any | null;
    error?: string;
  }> => {
    try {
      const supabase = await getServerSupabaseWithRetry();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        return {
          isAuthenticated: false,
          user: null,
          error: error?.message || '로그인이 필요합니다.',
        };
      }

      return {
        isAuthenticated: true,
        user: data.user,
      };
    } catch (error) {
      console.error('인증 상태 확인 오류:', error);
      return {
        isAuthenticated: false,
        user: null,
        error: '인증 상태 확인 중 오류가 발생했습니다.',
      };
    }
  },

  /**
   * 서버 Supabase 클라이언트로 직접 사용자 정보를 조회하는 메서드
   * layout.tsx 같은 서버 컴포넌트에서 사용
   */
  getUserInfoDirect: async (): Promise<
    CommonResponse<{ user: User | null; isLoggedIn: boolean }>
  > => {
    try {
      const supabase = await getServerSupabaseWithRetry();

      // 사용자 인증 상태 확인
      const { data, error: authError } = await supabase.auth.getUser();
      const isLoggedIn = !authError && !!data.user;

      if (!isLoggedIn || !data.user) {
        return {
          data: {
            user: null,
            isLoggedIn: false,
          },
          successOrNot: 'Y',
          statusCode: CommonStatus.SUCCESS,
        };
      }

      // 사용자 정보 조회
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`login_id, id, activity_level, avatar_path, permission_type`)
        .eq('auth_user_id', data.user.id)
        .single();

      if (userError) {
        console.error('사용자 정보 조회 오류:', userError);
        return {
          data: {
            user: null,
            isLoggedIn: false,
          },
          successOrNot: 'N',
          statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
        };
      }

      // 사용자 포인트 조회
      const { data: pointData } = await supabase
        .from('user_point_wallets')
        .select(`point_code, balance`)
        .eq('user_id', userData.id);

      // 사용자 객체 생성
      const user: User = {
        id: userData.login_id,
        nickname: data.user.user_metadata?.nickname || '사용자',
        point:
          pointData?.reduce((sum, item) => sum + (item.balance || 0), 0) ?? 0,
        level: userData.activity_level ?? 0,
        profileImage: userData.avatar_path ?? '',
        permissionType: userData.permission_type ?? 'user',
        user_id: userData.id ?? -1,
      };

      return {
        data: {
          user,
          isLoggedIn: true,
        },
        successOrNot: 'Y',
        statusCode: CommonStatus.SUCCESS,
      };
    } catch (error) {
      console.error('사용자 정보 직접 조회 오류:', error);
      return {
        data: {
          user: null,
          isLoggedIn: false,
        },
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      };
    }
  },
};

export default UserServiceByServerSide;
