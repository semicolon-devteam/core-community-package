"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useGlobalLoader } from "./useGlobalLoader";

export const useNavigation = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showLoader, hideLoader } = useGlobalLoader();

  // 페이지 이동 완료 시 로더 숨김
  useEffect(() => {
    hideLoader();
  }, [pathname, searchParams, hideLoader]);

  // Link 클릭 시 호출할 함수
  const handleLinkClick = useCallback(() => {
    showLoader();
  }, [showLoader]);

  return {
    handleLinkClick,
    pathname,
    searchParams,
  };
};
