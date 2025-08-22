import React, { forwardRef } from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  /** 체크 상태 */
  checked?: boolean;
  /** 값 변경 시 호출되는 함수 */
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Radio 그룹명 */
  name: string;
  /** Radio 값 */
  value: string;
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
  /** 컨테이너 클래스 이름 */
  containerClassName?: string;
  /** 라벨 클래스 이름 */
  labelClassName?: string;
  /** 에러 텍스트 클래스 이름 */
  errorClassName?: string;
  /** 도움말 텍스트 클래스 이름 */
  helperClassName?: string;
  /** 자식 요소 (라벨 대신 사용) */
  children?: React.ReactNode;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  checked = false,
  onChange,
  name,
  value,
  label,
  error,
  helper,
  size = 'md',
  labelPosition = 'right',
  disabled = false,
  className = '',
  containerClassName = '',
  labelClassName = '',
  errorClassName = '',
  helperClassName = '',
  children,
  id,
  ...props
}, ref) => {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

  // 크기별 클래스 정의
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value, event);
  };

  // 라벨 텍스트 결정
  const labelText = children || label;

  const radioElement = (
    <div className="relative inline-flex items-center">
      <input
        ref={ref}
        id={radioId}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <span
        className={`
          flex-shrink-0 rounded-full flex items-center justify-center
          border-2 transition-all duration-200
          ${sizeClasses[size]}
          ${checked
            ? error
              ? 'border-red-500 bg-red-500'
              : 'border-blue-600 bg-blue-600'
            : error
              ? 'border-red-500'
              : 'border-gray-300 hover:border-blue-600'
          }
          ${disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer'
          }
          ${className}
        `.trim().replace(/\s+/g, ' ')}
      >
        <span
          className={`
            rounded-full transition-all duration-200 bg-white
            ${dotSizeClasses[size]}
            ${checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
          `.trim().replace(/\s+/g, ' ')}
        />
      </span>
    </div>
  );

  const labelElement = labelText && (
    <label
      htmlFor={radioId}
      className={`
        text-gray-700
        text-xs sm:text-sm
        font-normal
        font-sans
        whitespace-nowrap
        select-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${labelClassName}
      `.trim().replace(/\s+/g, ' ')}
    >
      {labelText}
    </label>
  );

  return (
    <div className={containerClassName}>
      {/* Radio와 라벨 */}
      <div className={`inline-flex items-center gap-2 ${labelPosition === 'left' ? 'flex-row-reverse' : ''}`}>
        {radioElement}
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

Radio.displayName = 'Radio';

export { Radio };