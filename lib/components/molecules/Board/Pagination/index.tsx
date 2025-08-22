'use client';

import PaginationItem from '@atoms/PaginationItem';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageUrl = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams]
  );

  // 페이지 범위 계산 - 개선된 로직
  const getPageRange = () => {
    const range = [];
    const maxVisiblePages = 5; // 최대 보여줄 페이지 수

    // 전체 페이지가 최대 보여줄 페이지 수보다 적으면 모든 페이지 표시
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
      return range;
    }

    // 현재 페이지를 중심으로 앞뒤 2개씩 계산 (총 5개)
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    // 시작 페이지가 1에 가까워서 5개를 못 채우는 경우, 뒤쪽으로 확장
    if (end - start + 1 < maxVisiblePages) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisiblePages - 1);
      } else if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  // 화살표 버튼 컴포넌트
  const ArrowButton = ({
    direction,
    onClick,
    disabled,
    isDouble = false,
  }: {
    direction: 'left' | 'right';
    onClick: () => void;
    disabled: boolean;
    isDouble?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex justify-center items-center transition-colors
        ${
          disabled
            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 cursor-pointer'
        }`}
      aria-label={
        isDouble
          ? direction === 'left'
            ? '첫 페이지로 이동'
            : '마지막 페이지로 이동'
          : direction === 'left'
          ? '이전 페이지로 이동'
          : '다음 페이지로 이동'
      }
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        {direction === 'left' ? (
          isDouble ? (
            // 첫 페이지 (<<)
            <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6 1.41-1.41zM6 6h2v12H6V6z" />
          ) : (
            // 이전 페이지 (<)
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          )
        ) : isDouble ? (
          // 마지막 페이지 (>>)
          <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6-1.41 1.41zM18 6v12h-2V6h2z" />
        ) : (
          // 다음 페이지 (>)
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        )}
      </svg>
    </button>
  );

  return (
    <div className="flex justify-center items-center gap-1 my-4">
      {/* 첫 페이지 */}
      <ArrowButton
        direction="left"
        isDouble={true}
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      />

      {/* 이전 페이지 */}
      <ArrowButton
        direction="left"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />

      {/* 페이지 번호들 */}
      <div className="flex items-center gap-1 mx-2">
        {getPageRange().map(page => (
          <PaginationItem
            key={page}
            number={page}
            isActive={currentPage === page}
            onClick={() => onPageChange(page)}
            isVisible={true}
          />
        ))}
      </div>

      {/* 다음 페이지 */}
      <ArrowButton
        direction="right"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />

      {/* 마지막 페이지 */}
      <ArrowButton
        direction="right"
        isDouble={true}
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    </div>
  );
}
