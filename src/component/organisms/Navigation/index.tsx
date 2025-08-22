"use client";
import { useAppSelector } from "@hooks/common";
import { useMenuQuery } from "@hooks/queries/useMenuQuery";
import { Menu } from "@model/menu";
import { selectUIState } from "@redux/Features/UI/uiSlice";
import { useEffect } from "react";
import MobileNavigation from "./MobileNavigation";
import PcNavigation from "./PcNavigation";

export default function Navigation({ menuData }: { menuData: Menu[] }) {
  const { isMobile } = useAppSelector(selectUIState);
  const { data, isLoading, error, refetch, isError } = useMenuQuery();

  // JWT 만료 오류 발생 시 자동 재시도
  useEffect(() => {
    // JWT 관련 오류 발생 시 3초 후 자동 재시도
    if (isError && error?.message?.includes("JWT")) {
      const timer = setTimeout(() => {
        refetch();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isError, error, refetch]);

  // 로딩 중인 경우 스켈레톤 UI 또는 로딩 인디케이터 표시
  if (isLoading) {
    return (
      <div className="relative w-full bg-white border-b-2 border-primary z-20">
        <div className="w-full py-4">
          <div className="flex items-center justify-center space-x-6">
            {/* 스켈레톤 UI - 메뉴 아이템 */}
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-24 bg-gray-200 animate-pulse rounded"
                ></div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  // 에러가 발생한 경우 에러 메시지 표시
  if (error) {
    console.error("메뉴 데이터 로딩 오류:", error);
    return (
      <div className="relative w-full bg-white border-b-2 border-primary z-20">
        <div className="w-full py-4 text-center">
          <div className="text-red-500">
            메뉴를 불러오는데 문제가 발생했습니다.
          </div>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우 (빈 배열이거나 undefined)
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="relative w-full bg-white border-b-2 border-primary z-20">
        <div className="w-full py-4 text-center">표시할 메뉴가 없습니다.</div>
      </div>
    );
  }

  // 모바일 기기인 경우 MobileNavigation 컴포넌트를 렌더링
  if (isMobile) {
    return <MobileNavigation menuItems={menuData} />;
  } else {
    return <PcNavigation menuItems={menuData} />;
  }
}
