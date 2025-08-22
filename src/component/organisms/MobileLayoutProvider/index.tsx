"use client";
import { useAppDispatch, useDebounce } from "@hooks/common";
import { setIsMobile } from "@redux/Features/UI/uiSlice";
import { useCallback, useEffect } from "react";

export default function MobileLayoutProvider({
  isMobileInitial,
  children,
}: {
  isMobileInitial: boolean;
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const checkIfMobile = useCallback(() => {
    dispatch(setIsMobile(window.innerWidth < 1024));
  }, [dispatch]);
  const debouncedCheckIfMobile = useDebounce(checkIfMobile);

  useEffect(() => {
    // 초기값을 먼저 적용
    dispatch(setIsMobile(window.innerWidth < 1024));

    // 그 후 실제 화면 크기 확인
    checkIfMobile();

    // 창 크기 변경 이벤트 리스너 등록
    window.addEventListener("resize", debouncedCheckIfMobile);

    return () => window.removeEventListener("resize", debouncedCheckIfMobile);
  }, [dispatch, debouncedCheckIfMobile, checkIfMobile, isMobileInitial]);

  return <>{children}</>;
}
