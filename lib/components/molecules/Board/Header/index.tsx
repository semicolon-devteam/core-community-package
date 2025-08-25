'use client';

import { Fragment, useState, useEffect } from 'react';
import type { BoardHeaderProps, BoardCategory } from './board.header.model';

export default function BoardHeader({
  boardName,
  category,
  totalCount,
  isGlobalSearch,
  searchText,
  totalPages,
  selectedCategoryId = null,
  onCategoryChange,
}: BoardHeaderProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(selectedCategoryId);

  // Props로 전달된 selectedCategoryId가 변경될 때 상태 동기화
  useEffect(() => {
    setSelectedCategory(selectedCategoryId);
  }, [selectedCategoryId]);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  return (
    <div
      className="w-full p-0 flex flex-col flex-wrap overflow-x-auto"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {/* 첫 번째 줄: 카테고리 */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        {boardName && (
          <div className="text-xl font-nexon font-bold text-nowrap">
            {boardName}
          </div>
        )}
        <div className="flex items-center flex-wrap gap-1 min-w-0 w-full overflow-x-auto whitespace-nowrap justify-start sm:justify-end">
          {category.length > 0 && (
            <Fragment key={`board-header-all`}>
              <div
                className={`cursor-pointer w-16 sm:w-24 h-10 flex items-center justify-center text-sm font-nexon font-bold rounded-lg transition
                  ${
                    selectedCategory === null
                      ? 'bg-[#FA7D1A] text-white'
                      : 'text-gray-400 hover:text-primary'
                  }
                `}
                onClick={() => handleCategoryClick(null)}
              >
                전체
              </div>
              <span className="mx-1 text-gray-300 text-lg">|</span>
            </Fragment>
          )}
          {category.map((e: BoardCategory, i: number) => {
            const isLast = i === category.length - 1;
            return (
              <Fragment key={`board-header-${e.id}`}>
                <div
                  className={`cursor-pointer w-16 sm:w-24 h-10 flex items-center justify-center text-sm font-nexon font-bold rounded-lg transition
                    ${
                      selectedCategory === String(e.id)
                        ? 'bg-[#FA7D1A] text-white'
                        : 'text-gray-400 hover:text-primary'
                    }
                  `}
                  onClick={() => handleCategoryClick(String(e.id))}
                >
                  {e.name}
                </div>
                {!isLast && (
                  <span className="sm:mx-1 text-gray-300 text-lg">|</span>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* 두 번째 줄: 검색 결과 정보 */}
      {isGlobalSearch && searchText && (
        <div className="w-full text-left text-xs sm:text-sm font-nexon text-text-tertiary mt-3">
          <span className="text-primary font-medium">"{searchText}"</span>{' '}
          검색결과 : 게시물 {totalCount.toLocaleString()}개 / 총 {totalPages}
          페이지
        </div>
      )}

      {/* 페이지/카운트
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs sm:text-sm font-nexon text-text-tertiary">
            <span className="text-text-tertiary">페이지</span>
            <span className="text-primary font-medium">{currentPage}</span>
          </div>
          <span className="text-text-tertiary text-xs sm:text-sm font-nexon">
            /
          </span>
          <div className="flex items-center gap-1 text-xs sm:text-sm font-nexon">
            <span>{totalCount.toLocaleString()}</span>
          </div>
        </div>
        <BoardRefreshIcon className="sm:w-6 sm:h-6" />
      </div> */}
    </div>
  );
}
