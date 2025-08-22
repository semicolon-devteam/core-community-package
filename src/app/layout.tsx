import type { User } from '@model/User';
import BannerServiceByServerSide from '@services/bannerServiceByServerSide';
import type { Metadata } from 'next';
import './globals.css';
// import dynamic from "next/dynamic";
import { getServerSupabase } from '@config/Supabase/server';

import { Banner } from '@model/banner';
import MenuServiceByServerSide from '@services/menuServiceByServerSide';
import ClientWrapper from './client-wrapper';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: process.env.NEXT_PUBLIC_APP_NAME,
  icons: {
    icon: '/favicon.ico',
  },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    // console.log("🔄 RootLayout: 시작");

    // Supabase 클라이언트 생성
    let supabase;
    try {
      // console.log("🔄 RootLayout: Supabase 클라이언트 생성 중...");
      supabase = await getServerSupabase();
      // console.log("✅ RootLayout: Supabase 클라이언트 생성 완료");
    } catch (error) {
      // console.error("❌ RootLayout: Supabase 클라이언트 생성 실패:", error);
      throw error;
    }

    // 사용자 인증 상태 확인
    let data, authError;
    try {
      // console.log("🔄 RootLayout: 사용자 인증 상태 확인 중...");
      const authResult = await supabase.auth.getUser();
      data = authResult.data;
      authError = authResult.error;
      // console.log("✅ RootLayout: 사용자 인증 상태 확인 완료", {
      //   hasUser: !!data?.user,
      //   hasError: !!authError
      // });
    } catch (error) {
      // console.error("❌ RootLayout: 사용자 인증 상태 확인 실패:", error);
      throw error;
    }

    const isLoggedIn = !authError;

    // 배너 데이터 조회
    let mainBannerData, sideBannerData;
    try {
      // console.log("🔄 RootLayout: 배너 데이터 조회 중...");
      mainBannerData = await BannerServiceByServerSide.getBanner('CENTER');
      sideBannerData = await BannerServiceByServerSide.getBanner('RIGHT_SIDE');
      // console.log("✅ RootLayout: 배너 데이터 조회 완료");
    } catch (error) {
      // console.error("❌ RootLayout: 배너 데이터 조회 실패:", error);
      throw error;
    }

    // 메뉴 데이터 조회
    let menuData;
    try {
      // console.log("🔄 RootLayout: 메뉴 데이터 조회 중...");
      menuData = await MenuServiceByServerSide.getMenu();
      // console.log("✅ RootLayout: 메뉴 데이터 조회 완료");
    } catch (error) {
      // console.error("❌ RootLayout: 메뉴 데이터 조회 실패:", error);
      throw error;
    }

    // 사용자 정보 조회 (로그인된 경우에만)
    let userData, pointData;
    if (isLoggedIn && data?.user?.id) {
      try {
        // console.log("🔄 RootLayout: 사용자 정보 조회 중...", { userId: data.user.id });
        const userResult = await supabase
          .from('users')
          .select(`login_id, id, activity_level, avatar_path, permission_type`)
          .eq('auth_user_id', data.user.id)
          .single();

        userData = userResult.data;
        const userError = userResult.error;

        if (userError) {
          // console.error("❌ RootLayout: 사용자 정보 조회 에러:", userError);
        } else {
          // console.log("✅ RootLayout: 사용자 정보 조회 완료", { userCount: userData?.length });
        }

        // 사용자 포인트 조회
        if (userData?.id) {
          // console.log("🔄 RootLayout: 포인트 정보 조회 중...", { userDbId: userData[0].id });
          const pointResult = await supabase
            .from('user_point_wallets')
            .select(`point_code, balance`)
            .eq('user_id', userData.id);

          pointData = pointResult.data;
          const pointError = pointResult.error;

          if (pointError) {
            // console.error("❌ RootLayout: 포인트 정보 조회 에러:", pointError);
          } else {
            // console.log("✅ RootLayout: 포인트 정보 조회 완료", { pointCount: pointData?.length });
          }
        }
      } catch (error) {
        // console.error("❌ RootLayout: 사용자/포인트 정보 조회 실패:", error);
        // 사용자 정보 조회 실패는 치명적이지 않으므로 계속 진행
        userData = null;
        pointData = null;
      }
    }

    // 사용자 객체 생성
    let user: User | null = null;
    if (isLoggedIn && data?.user) {
      try {
        // console.log("🔄 RootLayout: 사용자 객체 생성 중...");
        user = {
          id: userData?.login_id,
          nickname: data.user?.user_metadata?.nickname || '사용자',
          point:
            pointData?.reduce((sum, item) => sum + (item.balance || 0), 0) ?? 0,
          level: userData?.activity_level ?? 0,
          profileImage: userData?.avatar_path ?? '',
          permissionType: userData?.permission_type ?? 'anonymous',
          user_id: userData?.id ?? -1,
        };
        // console.log("✅ RootLayout: 사용자 객체 생성 완료", { nickname: user.nickname });
      } catch (error) {
        // console.error("❌ RootLayout: 사용자 객체 생성 실패:", error);
        user = null;
      }
    }

    // console.log("🔄 RootLayout: 렌더링 시작");

    return (
      <html lang="en">
        <body className={'antialiased'}>
          {/* TODO: SSR 완전 분리 및 구조 설계 필요 */}
          <ClientWrapper
            isLoggedIn={isLoggedIn}
            user={user}
            isMobileInitial={false}
            mainBanners={mainBannerData?.data
              ?.slice()
              ?.sort(
                (a: Banner, b: Banner) => a.display_order - b.display_order
              )}
            sideBanners={sideBannerData?.data
              ?.slice()
              ?.sort(
                (a: Banner, b: Banner) => a.display_order - b.display_order
              )}
            menuData={menuData}
          >
            {children}
          </ClientWrapper>
        </body>
      </html>
    );
  } catch (error) {
    // console.error("💥 RootLayout: 치명적 에러 발생:", error);

    // 에러 발생 시 최소한의 레이아웃 반환
    return (
      <html lang="en">
        <body className={'antialiased'}>
          <div style={{ padding: '20px', color: 'red' }}>
            <h1>서버 에러가 발생했습니다</h1>
            <p>페이지를 새로고침해 주세요.</p>
            {process.env.NODE_ENV === 'development' && (
              <pre>{error?.toString()}</pre>
            )}
          </div>
          {children}
        </body>
      </html>
    );
  }
}
