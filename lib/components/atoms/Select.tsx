// Select Component for @semicolon/community-core

import React, { forwardRef, useEffect, useRef, useState, useMemo } from 'react';

export interface SelectOption<T = any> {
  id: string | number;
  label: string;
  value: T;
  icon?: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps<T = any> {
  /** 옵션 목록 */
  options: SelectOption<T>[];
  /** 선택된 값 */
  value?: T;
  /** 값 변경 시 호출되는 함수 */
  onChange: (option: SelectOption<T>) => void;
  /** 플레이스홀더 텍스트 */
  placeholder?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 라벨 */
  label?: string;
  /** 에러 메시지 */
  error?: string;
  /** 도움말 텍스트 */
  helper?: string;
  /** 크기 variant */
  size?: 'sm' | 'md' | 'lg';
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
  /** 다중 선택 지원 여부 */
  multiple?: boolean;
  /** 검색 기능 활성화 여부 */
  searchable?: boolean;
  /** 검색 플레이스홀더 */
  searchPlaceholder?: string;
  /** 아이콘 표시 여부 */
  showIcon?: boolean;
  /** 설명 표시 여부 */
  showDescription?: boolean;
  /** 드롭다운 최대 높이 */
  maxHeight?: string;
  /** 빈 결과 메시지 */
  noOptionsText?: string;
  /** 컨테이너 클래스 이름 */
  className?: string;
  /** 드롭다운 클래스 이름 */
  dropdownClassName?: string;
  /** 라벨 클래스 이름 */
  labelClassName?: string;
  /** 에러 텍스트 클래스 이름 */
  errorClassName?: string;
  /** 도움말 텍스트 클래스 이름 */
  helperClassName?: string;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(({
  options,
  value,
  onChange,
  placeholder = '선택해주세요',
  disabled = false,
  label,
  error,
  helper,
  size = 'md',
  fullWidth = true,
  multiple = false,
  searchable = false,
  searchPlaceholder = '검색...',
  showIcon = false,
  showDescription = false,
  maxHeight = '240px',
  noOptionsText = '옵션이 없습니다',
  className = '',
  dropdownClassName = '',
  labelClassName = '',
  errorClassName = '',
  helperClassName = '',
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectId = `select-${Math.random().toString(36).substr(2, 9)}`;

  // 선택된 옵션 찾기
  const selectedOption = useMemo(() => {
    if (multiple) return null;
    return options.find(option => option.value === value);
  }, [options, value, multiple]);

  // 크기별 클래스 정의
  const sizeClasses = {
    sm: 'h-8 px-2 text-sm',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base'
  };

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;
    onChange(option);
    if (!multiple) {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  // 기본 select 클래스
  const baseSelectClasses = `
    w-full
    font-sans
    bg-white
    border
    rounded-lg
    transition-all
    duration-200
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500/20
    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:bg-gray-50
    flex
    items-center
    justify-between
    cursor-pointer
  `;

  // 상태별 테두리 색상
  const borderClasses = error
    ? 'border-red-500 focus:border-red-500'
    : 'border-gray-300 focus:border-blue-500 hover:border-gray-400';

  // select 클래스 조합
  const selectClasses = `
    ${baseSelectClasses}
    ${sizeClasses[size]}
    ${borderClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div
      ref={ref}
      className={`${fullWidth ? 'w-full' : 'w-auto'} relative`}
    >
      {/* 라벨 */}
      {label && (
        <label
          htmlFor={selectId}
          className={`
            block
            text-sm
            font-medium
            text-gray-700
            mb-2
            font-sans
            ${disabled ? 'opacity-50' : ''}
            ${labelClassName}
          `.trim().replace(/\s+/g, ' ')}
        >
          {label}
        </label>
      )}

      {/* Select 버튼 */}
      <div
        ref={dropdownRef}
        id={selectId}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={toggleDropdown}
        className={selectClasses}
      >
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          {selectedOption ? (
            <span className="truncate text-gray-900">{selectedOption.label}</span>
          ) : (
            <span className="text-gray-500 truncate">{placeholder}</span>
          )}
        </div>

        {/* 화살표 아이콘 */}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* 드롭다운 */}
      {isOpen && (
        <div
          className={`absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden ${dropdownClassName}`}
        >
          {/* 옵션 목록 */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight }}
            role="listbox"
          >
            {options.length === 0 ? (
              <div className="px-3 py-8 text-center text-gray-500 text-sm">
                {noOptionsText}
              </div>
            ) : (
              options.map(option => {
                const isSelected = option.value === value;

                return (
                  <button
                    key={option.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleOptionClick(option)}
                    disabled={option.disabled}
                    className={`
                      w-full px-3 py-2 text-left flex items-center gap-2 text-sm cursor-pointer
                      transition-colors duration-150
                      ${option.disabled
                        ? 'opacity-50 cursor-not-allowed bg-gray-50'
                        : isSelected
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-100 text-gray-900'
                      }
                      border-b border-gray-100 last:border-b-0
                    `.trim().replace(/\s+/g, ' ')}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{option.label}</div>
                      {showDescription && option.description && (
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <p className={`
          mt-2
          text-sm
          text-red-500
          font-sans
          ${errorClassName}
        `.trim().replace(/\s+/g, ' ')}>
          {error}
        </p>
      )}

      {/* 도움말 텍스트 */}
      {helper && !error && (
        <p className={`
          mt-2
          text-sm
          text-gray-500
          font-sans
          ${helperClassName}
        `.trim().replace(/\s+/g, ' ')}>
          {helper}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export { Select };