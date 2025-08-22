import React, { forwardRef } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input 라벨 */
  label?: string;
  /** 에러 메시지 */
  error?: string;
  /** 도움말 텍스트 */
  helper?: string;
  /** 입력 타입 */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  /** 크기 variant */
  size?: 'sm' | 'md' | 'lg';
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
  /** 입력 앞쪽 아이콘 또는 텍스트 */
  startAdornment?: React.ReactNode;
  /** 입력 뒤쪽 아이콘 또는 텍스트 */
  endAdornment?: React.ReactNode;
  /** 컨테이너 클래스 이름 */
  containerClassName?: string;
  /** 라벨 클래스 이름 */
  labelClassName?: string;
  /** 에러 텍스트 클래스 이름 */
  errorClassName?: string;
  /** 도움말 텍스트 클래스 이름 */
  helperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helper,
  type = 'text',
  size = 'md',
  fullWidth = false,
  startAdornment,
  endAdornment,
  className = '',
  containerClassName = '',
  labelClassName = '',
  errorClassName = '',
  helperClassName = '',
  disabled = false,
  required = false,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  // 크기별 클래스 정의
  const sizeClasses = {
    sm: 'h-8 px-2 text-sm',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base'
  };

  // 기본 input 클래스
  const baseInputClasses = `
    w-full
    font-sans
    text-gray-900
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
  `;

  // 상태별 테두리 색상
  const borderClasses = error
    ? 'border-red-500 focus:border-red-500'
    : 'border-gray-300 focus:border-blue-500 hover:border-gray-400';

  // input 클래스 조합
  const inputClasses = `
    ${baseInputClasses}
    ${sizeClasses[size]}
    ${borderClasses}
    ${startAdornment ? 'pl-8' : ''}
    ${endAdornment ? 'pr-8' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${containerClassName}`}>
      {/* 라벨 */}
      {label && (
        <label
          htmlFor={inputId}
          className={`
            block
            text-sm
            font-medium
            text-gray-700
            mb-2
            font-sans
            ${required ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}
            ${disabled ? 'opacity-50' : ''}
            ${labelClassName}
          `.trim().replace(/\s+/g, ' ')}
        >
          {label}
        </label>
      )}

      {/* Input 컨테이너 */}
      <div className="relative">
        {/* 시작 아이콘/텍스트 */}
        {startAdornment && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            {startAdornment}
          </div>
        )}

        {/* Input 요소 */}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />

        {/* 끝 아이콘/텍스트 */}
        {endAdornment && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {endAdornment}
          </div>
        )}
      </div>

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

Input.displayName = 'Input';

export { Input };