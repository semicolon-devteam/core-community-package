import React, { forwardRef, useState, useCallback } from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** TextArea 라벨 */
  label?: string;
  /** 에러 메시지 */
  error?: string;
  /** 도움말 텍스트 */
  helper?: string;
  /** 크기 variant */
  size?: 'sm' | 'md' | 'lg';
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
  /** 자동 리사이징 활성화 */
  autoResize?: boolean;
  /** 최소 높이 */
  minHeight?: number;
  /** 최대 높이 */
  maxHeight?: number;
  /** 글자 수 제한 */
  maxLength?: number;
  /** 글자 수 표시 여부 */
  showCount?: boolean;
  /** 컨테이너 클래스 이름 */
  containerClassName?: string;
  /** 라벨 클래스 이름 */
  labelClassName?: string;
  /** 에러 텍스트 클래스 이름 */
  errorClassName?: string;
  /** 도움말 텍스트 클래스 이름 */
  helperClassName?: string;
  /** 글자 수 카운터 클래스 이름 */
  countClassName?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  error,
  helper,
  size = 'md',
  fullWidth = false,
  autoResize = false,
  minHeight = 80,
  maxHeight = 300,
  maxLength,
  showCount = false,
  disabled = false,
  required = false,
  className = '',
  containerClassName = '',
  labelClassName = '',
  errorClassName = '',
  helperClassName = '',
  countClassName = '',
  value,
  onChange,
  id,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const [textareaHeight, setTextareaHeight] = useState<number>(minHeight);

  // 크기별 클래스 정의
  const sizeClasses = {
    sm: 'px-2 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  // 자동 리사이징 핸들러
  const handleAutoResize = useCallback((element: HTMLTextAreaElement) => {
    if (!autoResize) return;

    // 높이 초기화
    element.style.height = 'auto';

    // 스크롤 높이 계산
    const scrollHeight = element.scrollHeight;
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);

    setTextareaHeight(newHeight);
    element.style.height = `${newHeight}px`;
  }, [autoResize, minHeight, maxHeight]);

  // 값 변경 핸들러
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // 최대 길이 체크
    if (maxLength && event.target.value.length > maxLength) {
      return;
    }

    onChange?.(event);

    // 자동 리사이징
    if (autoResize) {
      handleAutoResize(event.target);
    }
  };

  // 기본 textarea 클래스
  const baseTextareaClasses = `
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
    resize-none
  `;

  // 상태별 테두리 색상
  const borderClasses = error
    ? 'border-red-500 focus:border-red-500'
    : 'border-gray-300 focus:border-blue-500 hover:border-gray-400';

  // textarea 클래스 조합
  const textareaClasses = `
    ${baseTextareaClasses}
    ${sizeClasses[size]}
    ${borderClasses}
    ${autoResize ? 'resize-none' : 'resize-y'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // 현재 글자 수 계산
  const currentLength = typeof value === 'string' ? value.length : 0;
  const isOverLimit = maxLength ? currentLength > maxLength : false;

  return (
    <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${containerClassName}`}>
      {/* 라벨 및 글자 수 표시 */}
      <div className="flex justify-between items-center mb-2">
        {/* 라벨 */}
        {label && (
          <label
            htmlFor={textareaId}
            className={`
              block
              text-sm
              font-medium
              text-gray-700
              font-sans
              ${required ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}
              ${disabled ? 'opacity-50' : ''}
              ${labelClassName}
            `.trim().replace(/\s+/g, ' ')}
          >
            {label}
          </label>
        )}

        {/* 글자 수 표시 */}
        {showCount && (maxLength || currentLength > 0) && (
          <span className={`
            text-sm
            font-sans
            ${isOverLimit
              ? 'text-red-500'
              : currentLength / (maxLength || 100) > 0.8
                ? 'text-orange-500'
                : 'text-gray-500'
            }
            ${countClassName}
          `.trim().replace(/\s+/g, ' ')}>
            {currentLength}{maxLength && `/${maxLength}`}
          </span>
        )}
      </div>

      {/* TextArea 요소 */}
      <textarea
        ref={ref}
        id={textareaId}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        className={textareaClasses}
        style={autoResize ? { height: textareaHeight, minHeight, maxHeight } : { minHeight }}
        {...props}
      />

      {/* 하단 메시지 영역 */}
      <div className="flex justify-between items-start mt-2">
        {/* 에러 메시지 또는 도움말 텍스트 */}
        <div className="flex-1">
          {error && (
            <p className={`
              text-sm
              text-red-500
              font-sans
              ${errorClassName}
            `.trim().replace(/\s+/g, ' ')}>
              {error}
            </p>
          )}

          {helper && !error && (
            <p className={`
              text-sm
              text-gray-500
              font-sans
              ${helperClassName}
            `.trim().replace(/\s+/g, ' ')}>
              {helper}
            </p>
          )}
        </div>

        {/* 하단 글자 수 표시 (상단에 없을 때만) */}
        {showCount && !label && (maxLength || currentLength > 0) && (
          <span className={`
            text-sm
            font-sans
            ml-2
            flex-shrink-0
            ${isOverLimit
              ? 'text-red-500'
              : currentLength / (maxLength || 100) > 0.8
                ? 'text-orange-500'
                : 'text-gray-500'
            }
            ${countClassName}
          `.trim().replace(/\s+/g, ' ')}>
            {currentLength}{maxLength && `/${maxLength}`}
          </span>
        )}
      </div>
    </div>
  );
});

TextArea.displayName = 'TextArea';

export { TextArea };