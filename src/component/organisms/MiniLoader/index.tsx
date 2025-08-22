"use client";

import { useAppSelector } from "@hooks/common";
import { selectUIState } from "@redux/Features/UI/uiSlice";
import React, { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";

const MiniLoader: React.FC = () => {
  const { isMiniLoading, miniLoadingText, isAutoTransitioned } = useAppSelector(selectUIState);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isMiniLoading) {
      // 로딩 시작 시 즉시 렌더링하고 페이드 인
      setShouldRender(true);
      // 다음 프레임에서 opacity 변경 (CSS 트랜지션 적용)
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      // 로딩 종료 시 페이드 아웃
      setIsVisible(false);
      // 페이드 아웃 완료 후 DOM에서 제거
      const timer = setTimeout(() => setShouldRender(false), 350);
      return () => clearTimeout(timer);
    }
  }, [isMiniLoading]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div 
      className={`
        fixed top-4 right-4 z-[9999] w-[300px] h-[80px]
        flex items-center justify-start bg-black bg-opacity-80
        backdrop-blur-sm rounded-lg shadow-lg
        transition-all duration-300 ease-out transform
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'}
      `}
    >
      {/* 로더 영역 (3:9 비율의 3 부분) */}
      <div className="flex items-center justify-center w-1/4 h-full">
        <div className="scale-75">
          <FadeLoader
            color="#f37021"
            loading={true}
            height={10}
            width={3}
            radius={1}
            margin={1}
            aria-label="Mini Loading Spinner"
            data-testid="mini-loader"
          />
        </div>
      </div>
      
      {/* 텍스트 영역 (3:9 비율의 9 부분) */}
      <div className="flex items-center justify-start w-3/4 h-full pr-4">
        <div 
          className={`
            text-white text-sm font-medium tracking-wide
            transition-all duration-500 ease-out delay-100
            ${isVisible ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-1'}
          `}
        >
          {miniLoadingText}
        </div>
      </div>
    </div>
  );
};

export default MiniLoader;