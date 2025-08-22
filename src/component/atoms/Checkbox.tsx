import React, { forwardRef } from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  /** 체크 상태 */
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
  /** 중간 상태 (indeterminate) */
  indeterminate?: boolean;
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
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  checked = false,
  onChange,
  label,
  error,
  helper,
  size = 'md',
  indeterminate = false,
  labelPosition = 'right',
  disabled = false,
  className = '',
  containerClassName = '',
  labelClassName = '',
  errorClassName = '',
  helperClassName = '',
  id,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  // 크기별 클래스 정의
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.checked, event);
  };

  // 기본 checkbox 클래스
  const baseCheckboxClasses = `
    text-primary
    bg-white
    border-2
    rounded
    transition-all
    duration-200
    focus:outline-none
    focus:ring-2
    focus:ring-primary/20
    focus:border-primary
    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:bg-gray-50
  `;

  // 상태별 테두리 색상
  const borderClasses = error
    ? 'border-red-500'
    : 'border-border-default hover:border-primary';

  // checkbox 클래스 조합
  const checkboxClasses = `
    ${baseCheckboxClasses}
    ${sizeClasses[size]}
    ${borderClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const checkboxElement = (
    <input
      ref={ref}
      id={checkboxId}
      type="checkbox"
      checked={checked}
      onChange={handleChange}
      disabled={disabled}
      className={checkboxClasses}
      {...props}
    />
  );

  const labelElement = label && (
    <label
      htmlFor={checkboxId}
      className={`
        text-text-primary
        text-xs sm:text-sm
        font-normal
        font-nexon
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
      {/* Checkbox와 라벨 */}
      <div className={`flex items-center gap-2 ${labelPosition === 'left' ? 'flex-row-reverse' : ''}`}>
        {checkboxElement}
        {labelElement}
      </div>

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

Checkbox.displayName = 'Checkbox';

export default Checkbox;