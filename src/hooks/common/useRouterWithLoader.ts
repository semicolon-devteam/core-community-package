"use client";
import { useRouter as useNextRouter, usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useGlobalLoader } from "./useGlobalLoader";

export const useRouterWithLoader = () => {
  const router = useNextRouter();
  const pathname = usePathname();
  const { showMiniLoader, hideMiniLoader } = useGlobalLoader();

  // 페이지 이동 완료 시 로더 숨기기
  useEffect(() => {
    // pathname이 변경되면 로더를 숨김
    hideMiniLoader();
  }, [pathname, hideMiniLoader]);

  // 경로 비교 및 외부 도메인 체크 함수
  const shouldShowLoader = useCallback((href: string): boolean => {
    try {
      let targetPath: string;
      let isExternalDomain = false;

      // 절대 URL인 경우
      if (href.startsWith('http')) {
        const targetUrl = new URL(href);
        const currentDomain = window.location.hostname;
        
        // 외부 도메인인지 확인
        isExternalDomain = targetUrl.hostname !== currentDomain;
        targetPath = targetUrl.pathname;
      } 
      // 상대 URL인 경우
      else {
        targetPath = href.split('?')[0].split('#')[0]; // 쿼리파라미터와 해시 제거
      }
      
      // 외부 도메인이거나 현재 경로와 같은 경우 로더 표시하지 않음
      if (isExternalDomain || targetPath === pathname) {
        return false;
      }
      
      return true;
    } catch {
      // URL 파싱 실패 시 - 외부 링크가 아닌 경우에만 로더 표시
      return !href.startsWith('http');
    }
  }, [pathname]);

  // router.push를 래핑하여 필요한 경우에만 로더를 표시
  const push = useCallback(
    (href: string, options?: { scroll?: boolean }) => {
      if (shouldShowLoader(href)) {
        showMiniLoader("페이지를 이동하는 중입니다.");
      }
      return router.push(href, options);
    },
    [router, showMiniLoader, shouldShowLoader]
  );

  // router.replace를 래핑하여 필요한 경우에만 로더를 표시
  const replace = useCallback(
    (href: string, options?: { scroll?: boolean }) => {
      if (shouldShowLoader(href)) {
        showMiniLoader("페이지를 이동하는 중입니다.");
      }
      return router.replace(href, options);
    },
    [router, showMiniLoader, shouldShowLoader]
  );

  // 다른 router 메서드들은 그대로 전달
  return {
    ...router,
    push,
    replace,
  };
};
