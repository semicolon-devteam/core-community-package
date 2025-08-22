"use client";
import { updateDeviceTypeFromWidth } from "@redux/Features/App/appSlice";
import { RootState } from "@redux/stores";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useDeviceType = () => {
  const dispatch = useDispatch();
  const deviceType = useSelector((state: RootState) => state.app.deviceType);

  useEffect(() => {
    // 초기 디바이스 타입 설정
    const updateDeviceType = () => {
      dispatch(updateDeviceTypeFromWidth(window.innerWidth));
    };

    // 초기 설정
    updateDeviceType();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener("resize", updateDeviceType);

    // 클린업
    return () => {
      window.removeEventListener("resize", updateDeviceType);
    };
  }, [dispatch]);

  // 편의 함수들
  const isMobile = deviceType === "mobile";
  const isTablet = deviceType === "tablet";
  const isDesktop = deviceType === "desktop";
  const isMobileOrTablet = deviceType === "mobile" || deviceType === "tablet";

  return {
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
    isMobileOrTablet,
  };
}; 