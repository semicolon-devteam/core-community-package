'use client';

import type { BoardWrapperProps } from '../types';

/**
 * Board 컴포넌트를 감싸는 래퍼
 * 기본 스타일과 레이아웃을 제공합니다.
 */
export default function BoardWrapper({ 
  children,
  className = ''
}: BoardWrapperProps) {
  return (
    <div className={`w-full max-w-full h-auto p-3 sm:p-5 bg-white rounded-2xl shadow-custom border border-border-default flex-col justify-center items-center gap-3 sm:gap-5 flex overflow-hidden ${className}`.trim()}>
      {children}
    </div>
  );
}
