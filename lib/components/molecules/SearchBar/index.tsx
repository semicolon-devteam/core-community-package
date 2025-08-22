
import { normalizeImageSrc } from '@util/imageUtil';
import Image from "next/image";
import { InputHTMLAttributes } from 'react';

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearchClick?: () => void;
  className?: string;
  isExpanded?: boolean;
  onClose?: () => void;
  autoFocus?: boolean;
}

export default function SearchBar({ onSearchClick, className, isExpanded, onClose, autoFocus, ...inputProps }: SearchBarProps) {
  return (
    <div className={`flex relative h-11 px-5 py-2.5 items-center gap-2 overflow-hidden rounded-lg border-2 border-primary ${className || 'w-[460px]'}`}>
      <input
        type="text"
        placeholder="검색어를 입력해주세요."
        className="w-full font-nexon text-[13px] font-normal leading-normal text-text-primary placeholder:text-text-secondary focus:outline-none"
        autoFocus={autoFocus}
        {...inputProps}
      />
      
      {/* 검색 버튼 */}
      <button 
        type="button"
        onClick={onSearchClick}
        className="flex items-center justify-center hover:opacity-80"
        aria-label="검색"
      >
        <Image 
          src={normalizeImageSrc("/icons/search.svg")}
          alt=""
          width={24}
          height={24}
          className="w-6 h-6"
        />
      </button>
    </div>
  );
}