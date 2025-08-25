'use client';

import { ReactNode } from 'react';
import type { BoardPostItem, BoardTableRowProps } from '../../types';

/**
 * Simple Table Cell component for rendering table data
 */
function TableCell({ 
  value, 
  align = 'left', 
  className = '',
  width,
  hideOnMobile = false
}: { 
  value: ReactNode; 
  align?: 'left' | 'center' | 'right';
  className?: string;
  width?: string;
  hideOnMobile?: boolean;
}) {
  return (
    <div
      className={`
        px-4 py-3 text-sm text-gray-900 truncate
        ${align === 'center' ? 'text-center' : ''}
        ${align === 'right' ? 'text-right' : ''}
        ${hideOnMobile ? 'hidden md:flex' : 'flex'}
        ${className}
      `.trim()}
      style={{ 
        width: width || 'auto',
        flex: width ? `0 0 ${width}` : '1',
      }}
    >
      {value}
    </div>
  );
}

/**
 * Board Table Row 컴포넌트
 * 게시판 테이블의 각 행을 렌더링합니다.
 */
function BoardTableRow({ data, columns, onClick, className = '' }: BoardTableRowProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // columns가 정의되지 않았을 경우 기본 방어 코드
  if (!columns || columns.length === 0) {
    return null;
  }

  const formatCellValue = (key: string, value: any) => {
    switch (key) {
      case 'createdAt':
      case 'updatedAt':
        if (value) {
          const date = new Date(value);
          return date.toLocaleDateString('ko-KR', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
          });
        }
        return '-';
      
      case 'viewCount':
      case 'likeCount':
      case 'commentCount':
        return typeof value === 'number' ? value.toLocaleString() : value || 0;
      
      case 'title':
        return (
          <div className="flex items-center gap-1">
            {data.isPinned && (
              <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                고정
              </span>
            )}
            {data.isNotice && (
              <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                공지
              </span>
            )}
            <span className="truncate">{value}</span>
          </div>
        );
      
      case 'author':
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm">{value}</span>
          </div>
        );
      
      default:
        return value;
    }
  };

  return (
    <div
      className={`
        w-full bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `.trim()}
      onClick={handleClick}
    >
      <div className="flex w-full">
        {columns.map((column) => (
          <TableCell
            key={`${data.id}-${column.key}`}
            value={formatCellValue(column.key, data[column.key])}
            align={column.align}
            className={column.className}
            width={column.width}
            hideOnMobile={column.hideOnMobile}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Board Table List 컴포넌트
 * 게시판 테이블의 본문을 렌더링합니다.
 */
export default function BoardTableList({
  data,
  columns = [],
  onRowClick,
  className = '',
}: {
  data: BoardPostItem[];
  columns?: any[];
  onRowClick?: (item: BoardPostItem) => void;
  className?: string;
}) {
  // columns나 data가 정의되지 않았을 경우 방어 코드
  if (!columns || columns.length === 0) {
    return (
      <div className="w-full py-16 text-center text-gray-500">
        <div className="text-lg font-medium">테이블 설정이 필요합니다</div>
        <div className="text-sm mt-2">columns prop을 전달해주세요.</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full py-16 text-center text-gray-500">
        <div className="text-lg font-medium">게시물이 없습니다</div>
        <div className="text-sm mt-2">첫 번째 게시물을 작성해보세요!</div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`.trim()}>
      {data.map((item) => (
        <BoardTableRow
          key={item.id}
          data={item}
          columns={columns}
          onClick={() => onRowClick?.(item)}
        />
      ))}
    </div>
  );
}