import React from 'react';

interface UserSearchInputProps {
  value: string;
  onClick: () => void;
  placeholder?: string;
  className?: string;
}

export default function UserSearchInput({
  value,
  onClick,
  placeholder = '닉네임으로 사용자 검색',
  className = '',
}: UserSearchInputProps) {
  return (
    <div
      className={`relative w-full ${className}`}
      onClick={onClick}
      tabIndex={0}
      role="button"
    >
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        readOnly
        className="w-full h-10 px-3 pr-10 rounded-lg border border-border-default text-text-primary text-xs sm:text-sm font-normal font-nexon leading-normal cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path
            d="M20 20L17 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </div>
  );
}
