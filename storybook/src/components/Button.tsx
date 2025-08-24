import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled = false,
  children,
  className = '',
  ...props
}, ref) => {
  // 크기별 클래스
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs h-6',
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-sm h-10',
    lg: 'px-6 py-3 text-base h-12'
  };

  // Variant별 클래스
  const variantClasses = {
    primary: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white border-gray-600 hover:bg-gray-700 focus:ring-gray-500',
    outline: 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    ghost: 'bg-transparent text-blue-600 border-transparent hover:bg-blue-50 focus:ring-blue-500',
    danger: 'bg-red-600 text-white border-red-600 hover:bg-red-700 focus:ring-red-500'
  };

  // 기본 클래스
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg border
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${loading ? 'cursor-not-allowed' : ''}
    ${fullWidth ? 'w-full' : ''}
  `;

  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={buttonClasses}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };