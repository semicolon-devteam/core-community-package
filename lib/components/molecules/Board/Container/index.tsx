'use client';

import { BoardContainerProps } from '../types';

/**
 * Board 컴포넌트를 감싸는 컨테이너
 * 반응형 그리드 레이아웃과 중앙 정렬을 제공합니다.
 */
export default function BoardContainer({ 
  children,
  className = ''
}: BoardContainerProps) {
  return (
    <div className={`col-span-12 lg:col-span-7 lg:col-start-2 flex flex-col gap-2 justify-center items-center ${className}`.trim()}>
      {children}
    </div>
  );
}
