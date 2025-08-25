'use client';

import { ReactNode } from 'react';
import BoardTableHeader from './Header';
import BoardTableList from './List';

/**
 * Board Table Content wrapper
 */
function BoardTableContent({ 
  children,
  className = ''
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full flex-col justify-start items-center flex overflow-x-auto ${className}`.trim()}>
      {children}
    </div>
  );
}

/**
 * Board Table 컴포넌트 집합
 * 게시판 테이블 기능을 제공합니다.
 */
const BoardTable = {
  Header: BoardTableHeader,
  Body: BoardTableList,
  Content: BoardTableContent,
};

export default BoardTable;
