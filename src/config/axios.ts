// import useAuthStore from "@stores/AuthStore";
import axios, { InternalAxiosRequestConfig } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// axios 설정 타입 확장
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    skipLoader?: boolean;
    loaderText?: string;
    useMiniLoader?: boolean; // 작은 로더 사용 여부
  };
}

// 토큰은 시큐어 쿠키에 저장되어있다고 가정하여 withCredentials 옵션을 추가함
export const axiosInstance = axios.create({
  baseURL,
  timeout: 60 * 60 * 1000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// API 로딩 상태 관리를 위한 글로벌 함수들
let globalShowLoader: ((text?: string) => void) | null = null;
let globalHideLoader: (() => void) | null = null;
let globalSetLoaderText: ((text: string) => void) | null = null;
let globalShowMiniLoader: ((text?: string) => void) | null = null;
let globalHideMiniLoader: (() => void) | null = null;
let globalSetMiniLoaderText: ((text: string) => void) | null = null;
let activeRequestsCount = 0;
let activeMiniRequestsCount = 0;

// 로더 함수들을 설정하는 함수 (클라이언트 사이드에서 호출)
export const setGlobalLoaderFunctions = (
  showLoader: (text?: string) => void,
  hideLoader: () => void,
  setLoaderText: (text: string) => void,
  showMiniLoader?: (text?: string) => void,
  hideMiniLoader?: () => void,
  setMiniLoaderText?: (text: string) => void
) => {
  globalShowLoader = showLoader;
  globalHideLoader = hideLoader;
  globalSetLoaderText = setLoaderText;
  globalShowMiniLoader = showMiniLoader || null;
  globalHideMiniLoader = hideMiniLoader || null;
  globalSetMiniLoaderText = setMiniLoaderText || null;
};

// 요청 인터셉터 추가 - FormData 감지 및 로더 표시 + Authorization 헤더 추가
axiosInstance.interceptors.request.use(async (config: CustomAxiosRequestConfig) => {
  // API 로더 비활성화 옵션이 없는 경우에만 로더 표시
  if (!config.metadata?.skipLoader) {
    const useMiniLoader = config.metadata?.useMiniLoader;
    const loaderText = config.metadata?.loaderText || (useMiniLoader ? '처리중...' : '요청중입니다..');
    
    if (useMiniLoader && globalShowMiniLoader) {
      // 작은 로더 사용
      if (activeMiniRequestsCount === 0) {
        globalShowMiniLoader(loaderText);
      }
      activeMiniRequestsCount++;
    } else if (!useMiniLoader && globalShowLoader) {
      // 전체 화면 로더 사용
      if (activeRequestsCount === 0) {
        globalShowLoader(loaderText);
      }
      activeRequestsCount++;
    }
  }

  // FormData인 경우 Content-Type 헤더를 삭제하여 브라우저가 자동으로 설정하도록 함
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers['Content-Type'];
    }
  }

  // 클라이언트 사이드에서 토큰 유효성 검증 후 Authorization 헤더에 추가
  if (typeof window !== 'undefined') {
    try {
      // 쿠키에서 세션 정보 읽기
      const sessionCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('sb-access-token='))
        ?.split('=')[1];

      if (sessionCookie) {
        // URL 디코딩 후 JSON 파싱
        const decodedSession = decodeURIComponent(sessionCookie);
        const sessionData = JSON.parse(decodedSession);

        // access_token 추출
        const accessToken = sessionData?.access_token;

        if (accessToken) {
          // 토큰 만료 검증 (동적 import로 순환 참조 방지)
          const { decodeJWTPayload, isTokenExpired, removeExpiredTokenFromCookie } = await import('@util/jwtUtil');
          const payload = decodeJWTPayload(accessToken);
          
          if (payload && !isTokenExpired(payload)) {
            // 유효한 토큰인 경우에만 헤더 설정
            if (config.headers) {
              config.headers.Authorization = `Bearer ${accessToken}`;
            }
          } else {
            // 만료되거나 유효하지 않은 토큰 제거
            console.log('🗑️ axios 인터셉터: 만료된 토큰 감지, 쿠키에서 제거');
            removeExpiredTokenFromCookie();
          }
        }
      }
    } catch (error) {
      // 에러 발생 시 만료된 토큰 정리 (안전장치)
      try {
        const { removeExpiredTokenFromCookie } = await import('@util/jwtUtil');
        removeExpiredTokenFromCookie();
      } catch (importError) {
        console.error('JWT 유틸리티 import 실패:', importError);
      }
    }
  }

  return config;
});

// 응답 인터셉터 - 로더 숨김 및 에러 처리
axiosInstance.interceptors.response.use(
  async response => {
    // 로더 카운트 감소 및 숨김
    const config = response.config as CustomAxiosRequestConfig;
    if (!config.metadata?.skipLoader) {
      const useMiniLoader = config.metadata?.useMiniLoader;
      
      if (useMiniLoader && globalHideMiniLoader) {
        // 작은 로더 숨김
        activeMiniRequestsCount = Math.max(0, activeMiniRequestsCount - 1);
        if (activeMiniRequestsCount === 0) {
          globalHideMiniLoader();
        }
      } else if (!useMiniLoader && globalHideLoader) {
        // 전체 화면 로더 숨김
        activeRequestsCount = Math.max(0, activeRequestsCount - 1);
        if (activeRequestsCount === 0) {
          globalHideLoader();
        }
      }
    }

    // 응답 성공이지만 인증 관련 에러인 경우 체크 (successOrNot: "N"인 경우)
    if (response.data?.successOrNot === 'N') {
      const statusCode = response.data?.statusCode;
      const errorMessage = response.data?.message || response.data?.data;

      // 서버에서 명확한 인증 관련 에러를 반환한 경우만 처리
      if (
        statusCode === 'FORBIDDEN' &&
        typeof errorMessage === 'string' &&
        (errorMessage.includes('해당 게시글에 접근하려면 로그인이 필요') ||
          errorMessage.includes('로그인이 필요한 게시글') ||
          errorMessage.includes('로그인이 필요한 게시판'))
      ) {
        // 실제 세션 상태를 확인 후 이벤트 발생
        const { clientSupabase } = await import('@config/Supabase/client');
        const {
          data: { session },
        } = await clientSupabase.auth.getSession();

        if (!session || !session.access_token) {
          // 세션이 정말 없는 경우에만 이벤트 발생
          const event = new CustomEvent('auth-error', {
            detail: {
              type: 'AUTH_REQUIRED',
              message: errorMessage,
            },
          });
          window.dispatchEvent(event);
        }
      }
    }

    return response;
  },
  async error => {
    // 에러 시에도 로더 숨김
    const config = error.config as CustomAxiosRequestConfig;
    if (!config?.metadata?.skipLoader) {
      const useMiniLoader = config?.metadata?.useMiniLoader;
      
      if (useMiniLoader && globalHideMiniLoader) {
        // 작은 로더 숨김
        activeMiniRequestsCount = Math.max(0, activeMiniRequestsCount - 1);
        if (activeMiniRequestsCount === 0) {
          globalHideMiniLoader();
        }
      } else if (!useMiniLoader && globalHideLoader) {
        // 전체 화면 로더 숨김
        activeRequestsCount = Math.max(0, activeRequestsCount - 1);
        if (activeRequestsCount === 0) {
          globalHideLoader();
        }
      }
    }

    // 401/403 에러 시 토큰 갱신 후 재요청 시도
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !error.config._retried
    ) {
      try {
        console.log('🔄 axios: 401/403 에러 감지, 토큰 갱신 시도');

        // 클라이언트 수파베이스 세션 확인 및 갱신
        const { clientSupabase } = await import('@config/Supabase/client');
        const {
          data: { session },
          error: sessionError,
        } = await clientSupabase.auth.getSession();

        if (sessionError || !session) {
          console.error('❌ axios: 세션 확인 실패 또는 세션 없음');
          throw new Error('세션이 유효하지 않습니다.');
        }

        // 토큰 갱신 시도
        const { data: refreshData, error: refreshError } =
          await clientSupabase.auth.refreshSession();

        if (refreshError || !refreshData.session) {
          console.error('❌ axios: 토큰 갱신 실패');
          throw new Error('토큰 갱신에 실패했습니다.');
        }

        console.log('✅ axios: 토큰 갱신 성공');

        // 갱신된 토큰으로 원래 요청 재시도
        const originalConfig = error.config;
        originalConfig._retried = true; // 무한 루프 방지
        originalConfig.headers.Authorization = `Bearer ${refreshData.session.access_token}`;

        console.log('🔄 axios: 갱신된 토큰으로 요청 재시도');
        return axiosInstance(originalConfig);
      } catch (refreshError) {
        console.error('❌ axios: 토큰 갱신 과정에서 오류:', refreshError);

        // 갱신 실패 시 로그아웃 처리
        const { clientSupabase } = await import('@config/Supabase/client');
        await clientSupabase.auth.signOut();

        const event = new CustomEvent('auth-error', {
          detail: { type: 'TOKEN_INVALID' },
        });
        window.dispatchEvent(event);
      }
    }

    return Promise.reject(error);
  }
);

// 로더 텍스트를 동적으로 변경하는 함수
export const setApiLoaderText = (text: string) => {
  if (globalSetLoaderText) {
    globalSetLoaderText(text);
  }
};

// 커스텀 로더 텍스트로 API 요청을 수행하는 헬퍼 함수
export const apiWithCustomLoader = <T = any>(
  apiCall: () => Promise<T>,
  loaderText: string
): Promise<T> => {
  // 요청 전에 로더 텍스트 설정
  setApiLoaderText(loaderText);
  return apiCall();
};

export default axiosInstance;
