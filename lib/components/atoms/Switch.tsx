import React, { forwardRef } from 'react';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  /** 활성화 상태 */
  checked?: boolean;
  /** 값 변경 시 호출되는 함수 */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** 라벨 텍스트 */
  label?: string;
  /** 에러 메시지 */
  error?: string;
  /** 도움말 텍스트 */
  helper?: string;
  /** 크기 variant */
  size?: 'sm' | 'md' | 'lg';
  /** 라벨 위치 */
  labelPosition?: 'left' | 'right';
  /** 활성화 시 표시할 텍스트 */
  onText?: string;
  /** 비활성화 시 표시할 텍스트 */
  offText?: string;
  /** 컨테이너 클래스 이름 */
  containerClassName?: string;
  /** 라벨 클래스 이름 */
  labelClassName?: string;
  /** 에러 텍스트 클래스 이름 */
  errorClassName?: string;
  /** 도움말 텍스트 클래스 이름 */
  helperClassName?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
  checked = false,
  onChange,
  label,
  error,
  helper,
  size = 'md',
  labelPosition = 'right',
  onText,
  offText,
  disabled = false,
  className = '',
  containerClassName = '',
  labelClassName = '',
  errorClassName = '',
  helperClassName = '',
  id,
  ...props
}, ref) => {
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  // 크기별 클래스 정의
  const sizeClasses = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
      text: 'text-xs px-1'
    },
    md: {
      track: 'w-10 h-5',
      thumb: 'w-4 h-4',
      translate: 'translate-x-5',
      text: 'text-xs px-1.5'
    },
    lg: {
      track: 'w-12 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-6',
      text: 'text-sm px-2'
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.checked, event);
  };

  const currentSize = sizeClasses[size];

  // track 클래스
  const trackClasses = `
    relative inline-flex items-center
    ${currentSize.track}
    rounded-full
    transition-colors duration-200 ease-in-out
    focus-within:outline-none
    focus-within:ring-2
    focus-within:ring-blue-500/20
    ${checked
      ? error
        ? 'bg-red-500'
        : 'bg-blue-600'
      : error
        ? 'bg-red-200'
        : 'bg-gray-300'
    }
    ${disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer'
    }
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // thumb 클래스
  const thumbClasses = `
    inline-block
    ${currentSize.thumb}
    bg-white
    rounded-full
    shadow
    transform
    transition-transform duration-200 ease-in-out
    ${checked ? currentSize.translate : 'translate-x-0.5'}
  `.trim().replace(/\s+/g, ' ');

  const switchElement = (
    <div className="relative inline-flex">
      <input
        ref={ref}
        id={switchId}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <label
        htmlFor={switchId}
        className={trackClasses}
      >
        {/* 상태 텍스트 (선택사항) */}
        {(onText || offText) && (
          <span className={`
            absolute inset-0 flex items-center justify-center
            font-sans font-medium text-white
            ${currentSize.text}
            pointer-events-none
          `}>
            {checked ? onText : offText}
          </span>
        )}

        {/* Thumb */}
        <span className={thumbClasses} />
      </label>
    </div>
  );

  const labelElement = label && (
    <label
      htmlFor={switchId}
      className={`
        text-gray-700
        text-xs sm:text-sm
        font-normal
        font-sans
        select-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${labelClassName}
      `.trim().replace(/\s+/g, ' ')}
    >
      {label}
    </label>
  );

  return (
    <div className={containerClassName}>
      {/* Switch와 라벨 */}
      <div className={`inline-flex items-center gap-3 ${labelPosition === 'left' ? 'flex-row-reverse' : ''}`}>
        {switchElement}
        {labelElement}
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

Switch.displayName = 'Switch';

export { Switch };