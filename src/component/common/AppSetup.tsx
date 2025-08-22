'use client';

import { setGlobalLoaderFunctions } from '@config/axios';
import { clientSupabase } from '@config/Supabase/client';
import { useAppDispatch, useGlobalLoader, useRouterWithLoader } from '@hooks/common';
import { useBoardQuery } from '@hooks/queries/useBoardQuery';
import { useLevelQuery } from '@hooks/queries/useLevelQuery';
import { setLevelTable } from '@redux/Features/App/appSlice';
import { setBoardList } from '@redux/Features/Board/boardSlice';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { autoLogin, clearUser } from '@redux/Features/User/userSlice';
import { setFileUploadLoaderFunctions } from '@services/fileService';
import { useEffect, useRef } from 'react';

/**
 * 앱 전역 초기화를 담당하는 컴포넌트
 * - API 로더 설정
 * - 파일 업로드 로더 설정
 * - 레벨 정보 초기화
 * - 게시판 정보 초기화
 * - 실시간 세션 감지 및 인증 상태 관리
 */
export default function AppSetup() {
  const { 
    showLoader, 
    hideLoader, 
    setLoaderText, 
    showMiniLoader, 
    hideMiniLoader, 
    setMiniLoaderText,
    showPostLoader,
    hidePostLoader
  } = useGlobalLoader();
  const dispatch = useAppDispatch();
  const { data: levelTable } = useLevelQuery();
  const router = useRouterWithLoader();
  
  // 세션 감지 관련 refs
  const sessionCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSessionStateRef = useRef<boolean | null>(null);

  // 게시판 목록 조회
  const { data: boardsData, isSuccess: isBoardsSuccess } = useBoardQuery({
    enabled: true,
  });

  // 세션 상태 확인 함수
  const checkSessionStatus = async () => {
    try {
      // 1. Supabase 세션 확인
      const { data: { session }, error } = await clientSupabase.auth.getSession();
      
      const hasValidSession = !!(session && session.access_token && !error);
      
      // 세션 상태가 변경된 경우에만 처리 (단, 너무 빠른 연속 체크는 방지)
      if (lastSessionStateRef.current !== hasValidSession) {
        // 추가 확인: 쿠키도 체크
        const sessionCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('sb-access-token='));
        
        // 쿠키와 세션이 모두 없는 경우에만 로그아웃 처리
        if (!hasValidSession && !sessionCookie) {
          lastSessionStateRef.current = false;
          console.log('❌ 세션 만료 감지 - 로그아웃 처리');
          dispatch(clearUser());
          
          // 보호된 페이지에서 메인으로 리다이렉팅
          const currentPath = window.location.pathname;
          const protectedPaths = ['/me', '/post/write', '/board/write'];
          const needsAuth = protectedPaths.some(path => currentPath.startsWith(path));
          
          if (needsAuth) {
            router.push('/');
          }
        } else if (hasValidSession) {
          lastSessionStateRef.current = true;
          // 세션이 있는 경우에만 autoLogin 호출
          dispatch(autoLogin());
        }
      }
    } catch (error) {
      console.warn('⚠️ 세션 상태 확인 중 오류:', error);
    }
  };

  // API 로더 및 파일 업로드 로더 설정
  useEffect(() => {
    setGlobalLoaderFunctions(
      showLoader, 
      hideLoader, 
      setLoaderText, 
      showMiniLoader, 
      hideMiniLoader, 
      setMiniLoaderText
    );
    // 파일 업로드는 풀스크린 로더 사용 (게시글 작성 등 중요한 작업)
    setFileUploadLoaderFunctions(showPostLoader, hidePostLoader);
  }, [showLoader, hideLoader, setLoaderText, showMiniLoader, hideMiniLoader, setMiniLoaderText, showPostLoader, hidePostLoader]);

  // 레벨 테이블 초기화 로직
  useEffect(() => {
    if (levelTable) {
      // Redux store에 레벨 테이블 저장
      dispatch(setLevelTable(levelTable));
      
      // 개발 환경에서만 로그 출력
      if (process.env.NODE_ENV === 'development') {
        console.log('🎮 레벨 테이블 초기화 완료:', levelTable);
      }
    }
  }, [levelTable, dispatch]);

  // 게시판 정보 초기화
  useEffect(() => {
    if (isBoardsSuccess && boardsData) {
      if (boardsData.successOrNot === 'Y' && Array.isArray(boardsData.data)) {
        dispatch(setBoardList(boardsData.data));
      } else {
        console.error('게시판 정보 로드 실패:', boardsData.data);
      }
    }
  }, [isBoardsSuccess, boardsData, dispatch]);

  // 실시간 세션 감지 및 인증 상태 관리
  useEffect(() => {
    // 초기 세션 상태 확인
    checkSessionStatus();

    // Supabase 인증 상태 변경 감지
    const {
      data: { subscription },
    } = clientSupabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        lastSessionStateRef.current = true;
        try {
          dispatch(autoLogin());
        } catch (error) {
          console.error("사용자 정보 가져오기 실패:", error);
        }
      } else if (event === "SIGNED_OUT") {
        lastSessionStateRef.current = false;
        dispatch(clearUser());
        
        const currentPath = window.location.pathname;
        const protectedPaths = ['/me', '/post/write', '/board/write'];
        const needsAuth = protectedPaths.some(path => currentPath.startsWith(path));
        
        if (needsAuth) {
          router.push('/');
        }
      } else if (event === "TOKEN_REFRESHED" && session) {
        lastSessionStateRef.current = true;
      } else if (event === "USER_UPDATED" && session) {
        // 사용자 정보 업데이트는 이미 해당 컴포넌트에서 처리하므로
        // 여기서는 불필요한 자동 로그인을 수행하지 않음
        console.log("✅ 사용자 정보 업데이트 감지 (자동 동기화 생략)");
      }
    });

    // axios interceptor에서 발생한 auth-error 이벤트 처리
    const handleAuthError = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const { type, message } = customEvent.detail;
      
      console.log("🔒 인증 에러 감지:", type, message);
      
      // 현재 세션 상태를 다시 한 번 확인
      try {
        const { data: { session } } = await clientSupabase.auth.getSession();
        if (session && session.access_token) {
          console.log("✅ 실제로는 유효한 세션이 존재함, 에러 무시");
          return; // 유효한 세션이 있으면 에러 처리하지 않음
        }
      } catch (sessionCheckError) {
        console.log("세션 재확인 중 오류:", sessionCheckError);
      }
      
      switch (type) {
        case 'SESSION_EXPIRED':
        case 'TOKEN_INVALID':
          // 세션이 만료되거나 토큰이 무효한 경우 로그아웃 처리
          lastSessionStateRef.current = false;
          dispatch(clearUser());
          dispatch(showToast({
            title: "인증 만료",
            content: "세션이 만료되어 로그아웃되었습니다."
          }));
          
          // 보호된 페이지에서 메인으로 리다이렉팅
          const currentPath = window.location.pathname;
          const protectedPaths = ['/me', '/post/write', '/board/write'];
          const needsAuth = protectedPaths.some(path => currentPath.startsWith(path));
          
          if (needsAuth) {
            router.push('/');
          }
          break;
          
        case 'AUTH_REQUIRED':
          // 로그인이 필요한 리소스에 접근한 경우 - 로그아웃하지 않고 메시지만 표시
          dispatch(showToast({
            title: "접근 제한",
            content: message || "해당 콘텐츠에 접근할 권한이 없습니다."
          }));
          break;
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('auth-error', handleAuthError);

    // 주기적 세션 상태 확인 (30초마다로 완화)
    sessionCheckIntervalRef.current = setInterval(() => {
      checkSessionStatus();
    }, 30000);

    // 페이지 포커스 시 세션 상태 확인
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        await checkSessionStatus();
      }
    };

    // 윈도우 포커스 시 세션 상태 확인  
    const handleWindowFocus = async () => {
      await checkSessionStatus();
    };

    // 이벤트 리스너 등록
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    
    // 클린업 함수
    return () => {
      subscription?.unsubscribe();
      
      if (sessionCheckIntervalRef.current) {
        clearInterval(sessionCheckIntervalRef.current);
        sessionCheckIntervalRef.current = null;
      }
      
      // 이벤트 리스너 제거
      window.removeEventListener('auth-error', handleAuthError);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [dispatch]);

  return (
    <>
      {/* NavigationHandler를 포함한 설정용 컴포넌트 */}
    </>
  );
}
