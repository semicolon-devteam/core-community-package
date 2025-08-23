"use client";
import { useAppDispatch, useAppSelector } from "@hooks/common";
import type { User } from '../../../../types/User';
import { selectUIState } from "@redux/Features/UI/uiSlice";
import { setUserInfo } from "@redux/Features/User/userSlice";
import { useEffect } from "react";

import type { Banner } from '../../../../types/banner';
import SideBar from "@organisms/SideBar";
export default function SideBarWrapper({
  userInfo,
  isLoggedIn,
  banners,
}: {
  userInfo: User | null;
  isLoggedIn: boolean;
  banners: Banner[];
}) {
  const dispatch = useAppDispatch();
  const { isMobile, isMobileMenuOpen } = useAppSelector(selectUIState);
  
  useEffect(() => {
    if (userInfo) {
      dispatch(setUserInfo(userInfo));
    }
  }, [userInfo, dispatch]);
  
  // 모바일에서는 메뉴가 활성화된 경우에만 사이드바 표시
  // 데스크톱에서는 항상 표시
  if (isMobile && !isMobileMenuOpen) return null;
  return <SideBar banners={banners || []} />;
}
