"use client";

import { useState } from "react";
import { Providers } from "./providers";

import AppSetup from "@common/AppSetup";
import GlobalAuthListener from "@common/GlobalAuthListener";
import type { Banner } from "@model/banner";
import { Menu } from "@model/menu";
import type { User } from "@model/User";
import Footer from "@molecules/Footer";
import GlobalLoader from "@organisms/GlobalLoader";
import GlobalPopup from "@organisms/GlobalPopup";
import Header from "@organisms/Header";
import MiniLoader from "@organisms/MiniLoader";
import MainBanner from "@organisms/MainBanner";
import MainContentWrapper from "@organisms/MainContentWrapper";
import MobileLayoutProvider from "@organisms/MobileLayoutProvider";
import Navigation from "@organisms/Navigation";
import SideBarWrapper from "@organisms/SideBar/Wrapper";
import ToastContainer from "@organisms/ToastContainer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query";

// 개발 환경에서만 세션 테스트 도구 로드
if (process.env.NODE_ENV === 'development') {
  import('@util/sessionTestUtils');
}

export default function ClientSideApp({
  isLoggedIn,
  user,
  isMobileInitial,
  children,
  mainBanners,
  sideBanners,
  menuData,
}: Readonly<{
  isLoggedIn: boolean;
  user: User | null;
  isMobileInitial: boolean;
  children: React.ReactNode;
  mainBanners: Banner[];
  sideBanners: Banner[];
  menuData: Menu[];
}>) {
  const [queryClient] = useState(() => new QueryClient());

  // 사용자 관리자 권한 체크 (필요에 따라 실제 로직으로 변경)
  const isAdmin = false; // 또는 user?.role === 'admin' 등의 실제 체크 로직

  return (
    <QueryClientProvider client={queryClient}>
      <Providers isLoggedIn={isLoggedIn} user={user} isAdmin={isAdmin}>
        <MobileLayoutProvider isMobileInitial={isMobileInitial}>
          <AppSetup />
          <main className="min-h-screen bg-gray-50">
            <div className="mx-auto">
              <div className="grid grid-cols-12 gap-4 bg-background min-h-screen">
                {/* 헤더 영역 */}
                <div className="col-span-12 bg-white">
                  <Header />
                  <Navigation menuData={menuData} />
                </div>

                <div className="col-span-12 grid grid-cols-12 max-w-global-container mx-auto w-full">

                  {/* 메인 컨텐츠 영역 */}
                  <MainContentWrapper>
                    <MainBanner banners={mainBanners} />
                    {children}
                  </MainContentWrapper>

                  {/* 사이드바 영역 */}
                  <SideBarWrapper
                    isLoggedIn={isLoggedIn}
                    userInfo={user}
                    banners={sideBanners}
                  />
                </div>

                {/* 푸터 영역 */}
                <div className="col-span-12 mt-4">
                  <Footer />
                </div>
              </div>
            </div>
          </main>
          <ToastContainer />
          <GlobalAuthListener />
          <GlobalLoader />
          <MiniLoader />
          <GlobalPopup />
        </MobileLayoutProvider>
      </Providers>
      {/* 개발 환경에서만 표시되는 DevTools */}
      {/* {process.env.NODE_ENV === "development" && <ReactQueryDevtools />} */}
    </QueryClientProvider>
  );
}
