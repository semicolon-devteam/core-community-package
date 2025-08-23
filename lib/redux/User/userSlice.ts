import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import axiosInstance from '@config/axios';
import type { User } from '../../types/User';
import { hideLoading, hideMiniLoading, showLoading, showMiniLoading } from '@redux/Features/UI/uiSlice';
import type { RootState } from '@redux/stores';
import { isAdmin } from '@util/authUtil';

export interface LoginFormData {
  userId: string;
  password: string;
}

export interface JoinFormData extends LoginFormData {
  confirmPassword: string;
  nickname: string;
}

export interface UpdateFormData {
  password: string;
  confirmPassword: string;
  nickname: string;
}

export type JoinFormErrors = Partial<Record<keyof JoinFormData, string>>;

interface ValidationErrors {
  result: string;
}

export const update = createAsyncThunk<
  User,
  UpdateFormData,
  { rejectValue: ValidationErrors }
>('user/update', async (updateInfo, { rejectWithValue, dispatch }) => {
  try {
    dispatch(showLoading('회원정보를 수정하는 중...'));

    const response = await axiosInstance.patch('/api/user/me', updateInfo);

    if (response.data.successOrNot === 'Y') {
      // 사용자 정보 새로고침 후 반환
      const refreshResult = await dispatch(refreshMyInfo());

      if (refreshMyInfo.fulfilled.match(refreshResult)) {
        return refreshResult.payload;
      } else {
        // refreshMyInfo 실패 시에도 기본 정보는 반환
        return {
          id: '',
          nickname: updateInfo.nickname || '',
          point: 0,
          level: 1,
          profileImage: '',
          permissionType: 'user',
          user_id: -1,
        } as User;
      }
    } else {
      return rejectWithValue({
        result: response.data.message || '사용자 정보 업데이트에 실패했습니다.',
      });
    }
  } catch (error: any) {
    return rejectWithValue({
      result:
        error?.response?.data?.data ||
        '회원정보 업데이트 중 오류가 발생했습니다.',
    });
  } finally {
    dispatch(hideLoading());
  }
});

export const join = createAsyncThunk<
  User,
  JoinFormData,
  { rejectValue: ValidationErrors }
>('user/join', async (joinInfo, { rejectWithValue, dispatch }) => {
  try {
    dispatch(showLoading('회원가입 중...'));

    // 1. 서버 API로 회원가입 처리 (Supabase에 사용자 생성)
    const response = await axiosInstance.post('/api/user/join', {
      userId: joinInfo.userId,
      password: joinInfo.password,
      nickname: joinInfo.nickname,
    });

    if (response.data.successOrNot === 'N') {
      return rejectWithValue({
        result: response.data.message || '회원가입에 실패했습니다.',
      });
    }

    // 2. 서버에서 받은 세션 정보로 클라이언트 세션 설정
    const { clientSupabase } = await import('@config/Supabase/client');
    const serverSession = response.data.data?.session;

    if (!serverSession) {
      return rejectWithValue({
        result: '서버에서 세션 정보를 받지 못했습니다.',
      });
    }

    try {
      // 서버 세션 정보로 클라이언트 세션 설정
      const { error: setSessionError } = await clientSupabase.auth.setSession({
        access_token: serverSession.access_token,
        refresh_token: serverSession.refresh_token,
      });

      if (setSessionError) {
        console.error('❌ 클라이언트 세션 설정 실패:', setSessionError);
        return rejectWithValue({
          result: '클라이언트 세션 설정에 실패했습니다.',
        });
      }

      // console.log("✅ 클라이언트 세션 설정 성공");
    } catch (sessionError) {
      console.error('❌ 세션 설정 중 오류:', sessionError);
      return rejectWithValue({
        result: '세션 설정 중 오류가 발생했습니다.',
      });
    }

    // 세션이 완전히 설정될 때까지 잠시 대기
    await new Promise(resolve => setTimeout(resolve, 500));

    // 세션 재확인
    const {
      data: { session: currentSession },
    } = await clientSupabase.auth.getSession();
    if (!currentSession) {
      console.error('❌ 세션 재확인 실패');
      return rejectWithValue({
        result: '세션 생성에 실패했습니다. 다시 로그인해주세요.',
      });
    }

    // 3. JWT 토큰에서 기본 정보 추출
    const { decodeJWTPayload } = await import('@util/jwtUtil');
    const tokenPayload = decodeJWTPayload(serverSession.access_token);

    if (!tokenPayload) {
      console.error('❌ JWT 토큰 디코딩 실패');
      return rejectWithValue({
        result: '회원가입 후 토큰 정보를 읽을 수 없습니다.',
      });
    }

    // 4. /api/user/me 엔드포인트로 사용자 정보 및 권한 정보 통합 조회
    try {
      // join API에서 이미 사용자 정보를 제공하므로 우선 해당 정보 사용
      const serverUserInfo = response.data.data?.user;
      
      if (serverUserInfo) {
        // join API 응답에서 사용자 정보 직접 사용
        const user: User = {
          id: tokenPayload.user_metadata?.login_id || joinInfo.userId,
          nickname: serverUserInfo.nickname || tokenPayload.user_metadata?.nickname || joinInfo.nickname,
          point: typeof serverUserInfo.point === 'number' && !isNaN(serverUserInfo.point) ? serverUserInfo.point : 0,
          level: serverUserInfo.level || 1,
          profileImage: serverUserInfo.profileImage || '',
          permissionType: serverUserInfo.permissionType || 'user',
          user_id: serverUserInfo.user_id || -1,
        };

        console.log("👤 회원가입 최종 사용자 객체 (join API 응답 사용):", user);
        return user;
      }

      // join API에서 사용자 정보가 없는 경우에만 /api/user/me 호출
      const userResponse = await axiosInstance.get('/api/user/me');

      if (userResponse.data?.successOrNot === 'Y' && userResponse.data?.data) {
        const userInfo = userResponse.data.data;

        // /api/user/me에서 이미 권한 정보까지 포함하여 반환하므로 추가 API 호출 불필요
        const user: User = {
          id:
            userInfo.id ||
            tokenPayload.user_metadata?.login_id ||
            joinInfo.userId,
          nickname:
            userInfo.nickname ||
            tokenPayload.user_metadata?.nickname ||
            joinInfo.nickname,
          point:
            typeof userInfo.point === 'number' && !isNaN(userInfo.point)
              ? userInfo.point
              : 0,
          level: userInfo.level || 1,
          profileImage: userInfo.profileImage || '',
          permissionType: userInfo.permissionType || 'user', // 하위 호환성
          user_id: userInfo.user_id || -1,
        } as User;

        // console.log("👤 회원가입 최종 사용자 객체:", user);
        return user;
      } else {
        console.warn('⚠️ 사용자 정보 조회 실패, JWT 정보로 기본 객체 생성');

        // 사용자 정보 조회 실패 시 JWT 정보로 기본 객체 생성
        const user: User = {
          id: tokenPayload.user_metadata?.login_id || joinInfo.userId,
          nickname: tokenPayload.user_metadata?.nickname || joinInfo.nickname,
          point: 0,
          level: 1,
          profileImage: '',
          permissionType: 'user',
          user_id: -1,
        } as User;

        return user;
      }
    } catch (userError) {
      console.warn(
        '⚠️ 사용자 정보 조회 실패, JWT 정보로 기본 객체 생성:',
        userError
      );

      // API 호출 실패 시 JWT 정보로 기본 객체 생성
      const user: User = {
        id: tokenPayload.user_metadata?.login_id || joinInfo.userId,
        nickname: tokenPayload.user_metadata?.nickname || '사용자',
        point: 0,
        level: 1,
        profileImage: '',
        permissionType: 'user',
        user_id: -1,
      } as User;

      return user;
    }
  } catch (error: any) {
    console.error('❌ 회원가입 처리 중 오류:', error);
    return rejectWithValue({
      result:
        error?.response?.data?.data || '회원가입 처리 중 오류가 발생했습니다.',
    });
  } finally {
    dispatch(hideLoading());
  }
});

export const login = createAsyncThunk<
  User,
  LoginFormData,
  { rejectValue: ValidationErrors }
>('user/login', async (loginInfo, { rejectWithValue, dispatch }) => {
  try {
    dispatch(showLoading('로그인 중...'));

    // 1. 클라이언트 수파베이스로 로그인
    const { clientSupabase } = await import('@config/Supabase/client');
    const { data, error } = await clientSupabase.auth.signInWithPassword({
      email: `${loginInfo.userId}@example.com`,
      password: loginInfo.password,
    });

    if (error) {
      console.error('❌ 수파베이스 로그인 실패:', error);
      return rejectWithValue({
        result: error.message || '로그인에 실패했습니다.',
      });
    }

    if (!data.session) {
      console.error('❌ 세션 생성 실패');
      return rejectWithValue({
        result: '세션 생성에 실패했습니다.',
      });
    }

    // console.log("✅ 수파베이스 로그인 성공");
    // console.log("📝 세션 정보:", {
    //   hasAccessToken: !!data.session.access_token,
    //   hasRefreshToken: !!data.session.refresh_token,
    //   expiresAt: data.session.expires_at
    // });

    // 2. JWT 토큰에서 기본 정보 추출
    const { decodeJWTPayload } = await import('@util/jwtUtil');
    const tokenPayload = decodeJWTPayload(data.session.access_token);

    if (!tokenPayload) {
      console.error('❌ JWT 토큰 디코딩 실패');
      return rejectWithValue({
        result: '로그인 후 토큰 정보를 읽을 수 없습니다.',
      });
    }

    // console.log("📋 JWT 페이로드:", {
    //   sub: tokenPayload.sub,
    //   email: tokenPayload.email,
    //   nickname: tokenPayload.user_metadata?.nickname,
    //   login_id: tokenPayload.user_metadata?.login_id
    // });

    // 3. /api/user/me로 사용자 정보 및 권한 정보 통합 조회
    try {
      // console.log("👤 사용자 정보 조회 시작:", tokenPayload.sub);

      const userResponse = await axiosInstance.get('/api/user/me');
      // console.log("👤 사용자 정보 응답:", userResponse.data);

      if (userResponse.data?.successOrNot === 'Y' && userResponse.data?.data) {
        const userInfo = userResponse.data.data;

        // /api/user/me에서 이미 권한 정보까지 포함하여 반환하므로 추가 API 호출 불필요
        const user: User = {
          id: tokenPayload.user_metadata?.login_id || '',
          nickname:
            userInfo.nickname ||
            tokenPayload.user_metadata?.nickname ||
            '사용자',
          point:
            typeof userInfo.point === 'number' && !isNaN(userInfo.point)
              ? userInfo.point
              : 0,
          level: userInfo.level || 1,
          profileImage: userInfo.profileImage || '',
          permissionType: userInfo.permissionType || 'user', // 하위 호환성
          user_id: userInfo.user_id || -1,
        } as User;

        // console.log("👤 최종 사용자 객체:", user);
        return user;
      } else {
        console.warn('⚠️ 사용자 정보 조회 실패, JWT 정보로 기본 객체 생성');

        // 사용자 정보 조회 실패 시 JWT 정보로 기본 객체 생성
        const user: User = {
          id: tokenPayload.user_metadata?.login_id || '',
          nickname: tokenPayload.user_metadata?.nickname || '사용자',
          point: 0,
          level: 1,
          profileImage: '',
          permissionType: 'user',
          user_id: -1,
        } as User;

        return user;
      }
    } catch (userError) {
      console.warn(
        '⚠️ 사용자 정보 조회 실패, JWT 정보로 기본 객체 생성:',
        userError
      );

      // API 호출 실패 시 JWT 정보로 기본 객체 생성
      const user: User = {
        id: tokenPayload.user_metadata?.login_id || '',
        nickname: tokenPayload.user_metadata?.nickname || '사용자',
        point: 0,
        level: 1,
        profileImage: '',
        permissionType: 'user',
        user_id: -1,
      } as User;

      return user;
    }
  } catch (error: any) {
    console.error('❌ 로그인 처리 중 오류:', error);
    return rejectWithValue({
      result:
        error?.response?.data?.message || '로그인 처리 중 오류가 발생했습니다.',
    });
  } finally {
    dispatch(hideLoading());
  }
});

export const autoLogin = createAsyncThunk<
  User,
  void,
  { rejectValue: ValidationErrors }
>('user/autoLogin', async (_, { rejectWithValue, dispatch }) => {
  try {
    dispatch(showMiniLoading('로그인 정보 확인 중...'));

    // 1. JWT 토큰 유효성 확인
    const { getCurrentUserFromToken } = await import('@util/jwtUtil');
    const tokenPayload = await getCurrentUserFromToken();

    if (!tokenPayload) {
      console.log('❌ 토큰에서 사용자 정보 추출 실패');
      return rejectWithValue({
        result: '세션이 만료되었거나 유효하지 않습니다.',
      });
    }

    // console.log("📋 자동 로그인 JWT 페이로드:", {
    //   sub: tokenPayload.sub,
    //   email: tokenPayload.email,
    //   nickname: tokenPayload.user_metadata?.nickname
    // });

    // 2. /api/user/me로 최신 사용자 정보 및 권한 정보 통합 조회
    try {
      // console.log("👤 자동 로그인 사용자 정보 조회");
      const response = await axiosInstance.get('/api/user/me');
      // console.log("👤 자동 로그인 사용자 정보 응답:", response.data);

      if (response.data?.successOrNot === 'Y' && response.data?.data) {
        const userInfo = response.data.data;

        // /api/user/me에서 이미 권한 정보까지 포함하여 반환하므로 추가 API 호출 불필요
        const user: User = {
          id: tokenPayload.user_metadata?.login_id || '',
          nickname:
            userInfo.nickname ||
            tokenPayload.user_metadata?.nickname ||
            '사용자',
          point:
            typeof userInfo.point === 'number' && !isNaN(userInfo.point)
              ? userInfo.point
              : 0,
          level: userInfo.level || 1,
          profileImage: userInfo.profileImage || '',
          permissionType: userInfo.permissionType || 'user', // 하위 호환성
          user_id: userInfo.user_id || -1,
        } as User;

        // console.log("👤 자동 로그인 최종 사용자 객체:", user);
        return user;
      } else {
        console.error('❌ 사용자 정보 조회 실패:', response.data);
        return rejectWithValue({
          result: '사용자 정보를 조회할 수 없습니다.',
        });
      }
    } catch (apiError: any) {
      console.error('❌ 사용자 정보 API 호출 실패:', apiError);
      return rejectWithValue({
        result: '사용자 정보 조회 중 오류가 발생했습니다.',
      });
    }
  } catch (error: any) {
    console.error('❌ 자동 로그인 처리 중 오류:', error);
    return rejectWithValue({
      result: error?.message || '자동 로그인 처리 중 오류가 발생했습니다.',
    });
  } finally {
    dispatch(hideMiniLoading());
  }
});

export const logout = createAsyncThunk<
  void,
  void,
  { rejectValue: ValidationErrors }
>('user/logout', async (_, { rejectWithValue, dispatch }) => {
  try {
    dispatch(showLoading('로그아웃 중...'));

    // 1. 클라이언트 수파베이스에서 로그아웃
    const { clientSupabase } = await import('@config/Supabase/client');
    const { error } = await clientSupabase.auth.signOut();

    if (error) {
      return rejectWithValue({
        result: error.message || '로그아웃에 실패했습니다.',
      });
    }

    // 2. 클라이언트 쿠키에서 JWT 토큰 명시적 삭제
    try {
      // Supabase 관련 쿠키들 삭제
      const cookiesToDelete = [
        'sb-access-token',
        'sb-refresh-token', 
        'sb-auth-token',
        'sb-localhost-auth-token',
        'supabase-auth-token',
        'supabase.auth.token'
      ];

      cookiesToDelete.forEach(cookieName => {
        // 현재 도메인에서 삭제
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        // 루트 도메인에서도 삭제
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        // 서브도메인을 포함한 전체 도메인에서 삭제
        const rootDomain = window.location.hostname.split('.').slice(-2).join('.');
        if (rootDomain !== window.location.hostname) {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${rootDomain};`;
        }
      });

      console.log('✅ 클라이언트 쿠키 삭제 완료');
    } catch (cookieError) {
      console.warn('⚠️ 쿠키 삭제 중 일부 오류:', cookieError);
      // 쿠키 삭제 실패는 로그아웃 전체를 실패시키지 않음
    }

    // 3. 로컬스토리지 및 세션스토리지 정리
    try {
      // Supabase 관련 스토리지 정리
      Object.keys(localStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      Object.keys(sessionStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });

      console.log('✅ 로컬/세션 스토리지 정리 완료');
    } catch (storageError) {
      console.warn('⚠️ 스토리지 정리 중 일부 오류:', storageError);
    }

    // 4. 서버사이드 쿠키 정리를 위해 서버 API도 호출
    try {
      await axiosInstance.post('/api/user/logout');
      console.log('✅ 서버 로그아웃 API 호출 완료');
    } catch (serverError) {
      // 서버 로그아웃 실패는 무시 (클라이언트 로그아웃이 더 중요)
      console.warn('⚠️ 서버 로그아웃 API 호출 실패:', serverError);
    }

    console.log('🎉 로그아웃 완료');
  } catch (error: any) {
    return rejectWithValue({
      result: error?.message || '로그아웃 처리 중 오류가 발생했습니다.',
    });
  } finally {
    dispatch(hideLoading());
  }
});

export const refreshMyInfo = createAsyncThunk<
  User,
  void,
  { rejectValue: ValidationErrors }
>('user/me', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/user/me');

    if (response.data && response.data.successOrNot === 'Y') {
      // /api/user/me에서 권한 정보까지 포함하여 반환
      const user: User = {
        id: response.data.data.id,
        nickname: response.data.data.nickname,
        point: response.data.data.point,
        level: response.data.data.level,
        profileImage: response.data.data.profileImage,
        permissionType: response.data.data.permissionType, // 하위 호환성
        user_id: response.data.data.user_id,
      } as User;

      return user;
    }

    throw new Error('사용자 정보 업데이트 실패');
  } catch {
    return rejectWithValue({
      result: '사용자 정보 업데이트 중 오류가 발생했습니다.',
    });
  }
});

export const checkAttendance = createAsyncThunk<
  void,
  void,
  { rejectValue: ValidationErrors }
>('user/checkAttendance', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/user/me/attendance');
    return response.data;
  } catch {
    return rejectWithValue({
      result: '출석 체크 확인 중 오류가 발생했습니다.',
    });
  }
});

export const dotAttendance = createAsyncThunk<
  void,
  void,
  { rejectValue: ValidationErrors }
>('user/dotAttendance', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/api/user/me/attendance');
    return response.data;
  } catch {
    return rejectWithValue({
      result: '출석 체크 처리 중 오류가 발생했습니다.',
    });
  }
});

interface UserState {
  userInfo: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  error: string | null | undefined;
}

const initialState: UserState = {
  userInfo: null,
  isLoggedIn: false,
  isAdmin: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<User | null>) => {
      state.userInfo = action.payload;
      state.isLoggedIn = !!action.payload;
      state.isAdmin = isAdmin(action.payload);
    },
    clearUser: state => {
      state.userInfo = null;
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.userInfo = payload;
      state.isLoggedIn = true;
      state.isAdmin = isAdmin(payload);
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoggedIn = false;
      if (action.payload) {
        state.error = action.payload.result;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(join.fulfilled, (state, { payload }) => {
      state.userInfo = payload;
      state.isLoggedIn = true;
      state.isAdmin = isAdmin(payload);
      state.error = null;
    });
    builder.addCase(join.rejected, (state, action) => {
      state.isLoggedIn = false;
      if (action.payload) {
        state.error = action.payload.result;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(update.fulfilled, (state, { payload }) => {
      state.userInfo = payload;
      state.error = null;
    });
    builder.addCase(update.rejected, (state, action) => {
      if (action.payload) {
        state.error = action.payload.result;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(autoLogin.fulfilled, (state, { payload }) => {
      state.userInfo = payload;
      state.isLoggedIn = true;
      state.isAdmin = isAdmin(payload);
      state.error = null;
    });
    builder.addCase(autoLogin.rejected, (state, action) => {
      state.isLoggedIn = false;
      if (action.payload) {
        state.error = action.payload.result;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(logout.fulfilled, state => {
      state.userInfo = null;
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.error = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoggedIn = true;
      if (action.payload) {
        state.error = action.payload.result;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(refreshMyInfo.fulfilled, (state, { payload }) => {
      state.userInfo = payload;
      state.error = null;
    });
    builder.addCase(refreshMyInfo.rejected, (state, action) => {
      if (action.payload) {
        state.error = action.payload.result;
      } else {
        state.error = action.error.message;
      }
    });
  },
});

export const { setUserInfo, clearUser } = userSlice.actions;

export const selectUserInfo = (state: RootState): UserState => state.userSlice;

export default userSlice.reducer;
