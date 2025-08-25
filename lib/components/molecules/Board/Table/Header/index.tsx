'use client';

import { ReactNode } from 'react';
import type { BoardTableHeaderProps } from '../../types';

/**
 * Board Table Header 컴포넌트
 * 게시판 테이블의 헤더를 렌더링합니다.
 */
export default function BoardTableHeader({ 
  columns, 
  className = '' 
}: BoardTableHeaderProps) {
  if (!columns || columns.length === 0) {
    return null;
  }

  return (
    <div className={`w-full bg-gray-50 border-b border-gray-200 ${className}`.trim()}>
      <div className="flex w-full">
        {columns.map((column, index) => (
          <div
            key={`header-${column.key}-${index}`}
            className={`
              px-4 py-3 text-sm font-medium text-gray-700 truncate
              ${column.align === 'center' ? 'text-center' : ''}
              ${column.align === 'right' ? 'text-right' : ''}
              ${column.hideOnMobile ? 'hidden md:flex' : 'flex'}
              ${column.className || ''}
            `.trim()}
            style={{ 
              width: column.width || 'auto',
              flex: column.width ? `0 0 ${column.width}` : '1',
            }}
          >
            {column.label}
          </div>
        ))}
      </div>
    </div>
  );
}