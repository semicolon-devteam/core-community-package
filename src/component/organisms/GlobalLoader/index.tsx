"use client";

import { useAppDispatch, useAppSelector } from "@hooks/common";
import { selectUIState, transitionToMiniLoader } from "@redux/Features/UI/uiSlice";
import React, { useEffect, useState, useRef } from "react";
import { FadeLoader } from "react-spinners";

const GlobalLoader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, loadingText } = useAppSelector(selectUIState);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (isLoading) {
      // 로딩 시작 시 즉시 렌더링하고 페이드 인
      setShouldRender(true);
      // 다음 프레임에서 opacity 변경 (CSS 트랜지션 적용)
      const timer = setTimeout(() => setIsVisible(true), 10);
      
      // 2초 후 미니 로더로 자동 전환
      transitionTimerRef.current = setTimeout(() => {
        dispatch(transitionToMiniLoader(loadingText));
      }, 2000);
      
      return () => {
        clearTimeout(timer);
        if (transitionTimerRef.current) {
          clearTimeout(transitionTimerRef.current);
        }
      };
    } else {
      // 로딩 종료 시 페이드 아웃
      setIsVisible(false);
      // 자동 전환 타이머 클리어
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
      // 페이드 아웃 완료 후 DOM에서 제거
      const timer = setTimeout(() => setShouldRender(false), 350);
      return () => clearTimeout(timer);
    }
  }, [isLoading, dispatch, loadingText]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div 
      className={`
        fixed inset-0 z-[9999] flex items-center justify-center 
        bg-black backdrop-blur-sm transition-all duration-300 ease-out
        ${isVisible ? 'bg-opacity-60 opacity-100' : 'bg-opacity-0 opacity-0'}
      `}
    >
      {/* 로딩 컨테이너 */}
      <div 
        className={`
          relative flex flex-col items-center justify-center
          transition-all duration-300 ease-out transform
          ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-4'}
        `}
      >
        {/* 백그라운드 글로우 효과 */}
        <div 
          className={`
            absolute inset-0 rounded-full bg-white transition-all duration-500 ease-out
            ${isVisible ? 'opacity-10 scale-150 blur-xl' : 'opacity-0 scale-100 blur-none'}
          `}
        />
        
        {/* 스피너 */}
        <div className="relative z-10">
          <FadeLoader
            color="#f37021"
            loading={true}
            height={15}
            width={5}
            radius={2}
            margin={2}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
        
        {/* 로딩 텍스트 (선택사항) */}
        <div 
          className={`
            mt-4 text-white text-sm font-medium tracking-wide
            transition-all duration-500 ease-out delay-100
            ${isVisible ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-2'}
          `}
        >
          {loadingText}
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader; 