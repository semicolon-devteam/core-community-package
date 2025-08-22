'use client';

import { normalizeImageSrc } from '@util/imageUtil';
import Image from 'next/image';
import { forwardRef, useEffect, useRef, useState, useMemo } from 'react';

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
  const [selectedValues, setSelectedValues] = useState<T[]>(
    multiple ? (Array.isArray(value) ? value : []) : []
  );
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectId = `select-${Math.random().toString(36).substr(2, 9)}`;

  // 선택된 옵션 찾기
  const selectedOption = useMemo(() => {
    if (multiple) return null;
    return options.find(option => option.value === value);
  }, [options, value, multiple]);

  // 다중 선택된 옵션들 찾기
  const selectedOptions = useMemo(() => {
    if (!multiple) return [];
    const values = Array.isArray(value) ? value : selectedValues;
    return options.filter(option => values.includes(option.value));
  }, [options, value, selectedValues, multiple]);

  // 필터된 옵션들
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchable, searchTerm]);

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

  // 검색 포커스 관리
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, searchable]);

  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;

    if (multiple) {
      const values = Array.isArray(value) ? value : selectedValues;
      const isSelected = values.includes(option.value);
      const newValues = isSelected
        ? values.filter(v => v !== option.value)
        : [...values, option.value];
      
      setSelectedValues(newValues);
      onChange({ ...option, value: newValues } as any);
    } else {
      onChange(option);
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleDropdown();
    }
  };

  // 기본 select 클래스
  const baseSelectClasses = `
    w-full
    font-nexon
    bg-white
    border
    rounded-lg
    transition-all
    duration-200
    focus:outline-none
    focus:ring-2
    focus:ring-primary/20
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
    : 'border-border-default focus:border-primary hover:border-gray-400';

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
            text-text-primary
            mb-2
            font-nexon
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
        onKeyDown={handleKeyDown}
        className={selectClasses}
      >
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          {/* 선택된 값 표시 */}
          {multiple ? (
            selectedOptions.length > 0 ? (
              <div className="flex items-center gap-1 flex-wrap">
                {selectedOptions.map(option => (
                  <span
                    key={option.id}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 rounded text-gray-700"
                  >
                    {showIcon && option.icon && (
                      <Image
                        src={normalizeImageSrc(option.icon)}
                        alt={option.label}
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                    )}
                    {option.label}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-500 truncate">{placeholder}</span>
            )
          ) : selectedOption ? (
            <>
              {showIcon && selectedOption.icon && (
                <Image
                  src={normalizeImageSrc(selectedOption.icon)}
                  alt={selectedOption.label}
                  width={20}
                  height={20}
                  className="w-5 h-5 flex-shrink-0"
                />
              )}
              <span className="truncate">{selectedOption.label}</span>
            </>
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
          {/* 검색 입력 */}
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-primary"
              />
            </div>
          )}

          {/* 옵션 목록 */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight }}
            role="listbox"
          >
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-8 text-center text-gray-500 text-sm">
                {noOptionsText}
              </div>
            ) : (
              filteredOptions.map(option => {
                const isSelected = multiple
                  ? (Array.isArray(value) ? value : selectedValues).includes(option.value)
                  : option.value === value;

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
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-gray-100 text-gray-900'
                      }
                      border-b border-gray-100 last:border-b-0
                    `.trim().replace(/\s+/g, ' ')}
                  >
                    {/* 다중 선택 체크박스 */}
                    {multiple && (
                      <div className={`
                        w-4 h-4 border-2 rounded-sm flex items-center justify-center
                        ${isSelected ? 'border-primary bg-primary' : 'border-gray-300'}
                      `}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    )}

                    {/* 아이콘 */}
                    {showIcon && option.icon && (
                      <Image
                        src={normalizeImageSrc(option.icon)}
                        alt={option.label}
                        width={20}
                        height={20}
                        className="w-5 h-5 flex-shrink-0"
                      />
                    )}

                    {/* 콘텐츠 */}
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
          font-nexon
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
          font-nexon
          ${helperClassName}
        `.trim().replace(/\s+/g, ' ')}>
          {helper}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;