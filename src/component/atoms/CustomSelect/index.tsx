'use client';

import { normalizeImageSrc } from '@util/imageUtil';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export interface SelectOption<T = any> {
  id: string | number;
  label: string;
  value: T;
  icon?: string;
  description?: string;
}

interface CustomSelectProps<T = any> {
  options: SelectOption<T>[];
  value?: T;
  onChange: (option: SelectOption<T>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  dropdownClassName?: string;
  showIcon?: boolean;
  showDescription?: boolean;
  maxHeight?: string;
  defaultValue?: T;
}

export default function CustomSelect<T = any>({
  options,
  value,
  onChange,
  placeholder = '선택해주세요',
  disabled = false,
  className = '',
  dropdownClassName = '',
  showIcon = false,
  showDescription = false,
  maxHeight = '240px',
  defaultValue,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(
    option => option.value === value || option.value === defaultValue
  );

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: SelectOption<T>) => {
    onChange(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // useEffect(() => {
  //   if (defaultValue) {
  //     onChange(defaultValue as unknown as SelectOption<T>);
  //   }
  // }, [defaultValue, onChange]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`w-full h-10 px-3 border border-gray-300 rounded-lg text-text-primary text-sm font-nexon focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center justify-between bg-white ${
          disabled
            ? 'bg-gray-100 cursor-not-allowed'
            : 'cursor-pointer hover:border-gray-400'
        }`}
      >
        <div className="flex items-center gap-2">
          {selectedOption ? (
            <>
              {showIcon && selectedOption.icon && (
                <Image
                  src={normalizeImageSrc(selectedOption.icon)}
                  alt={selectedOption.label}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              )}
              <span>{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <svg
          className="w-4 h-4 text-gray-400"
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
      </button>

      {isOpen && (
        <div
          className={`absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-y-auto ${dropdownClassName}`}
          style={{ maxHeight }}
        >
          {options.map(option => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleOptionClick(option)}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm cursor-pointer border-b border-gray-100 last:border-b-0 text-gray-900"
            >
              {showIcon && option.icon && (
                <Image
                  src={normalizeImageSrc(option.icon)}
                  alt={option.label}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              )}
              <div className="flex-1">
                <div>{option.label}</div>
                {showDescription && option.description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {option.description}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
