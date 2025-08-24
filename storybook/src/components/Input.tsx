import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helper,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled = false,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-4 text-lg'
  };

  const variantClasses = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    success: 'border-green-500 focus:border-green-600 focus:ring-green-500',
    warning: 'border-yellow-500 focus:border-yellow-600 focus:ring-yellow-500',
    error: 'border-red-500 focus:border-red-600 focus:ring-red-500'
  };

  const currentVariant = error ? 'error' : variant;

  const inputClasses = `
    block border rounded-lg
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-opacity-50
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
    ${sizeClasses[size]}
    ${variantClasses[currentVariant]}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const iconClasses = `absolute top-1/2 transform -translate-y-1/2 text-gray-400`;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className={`${iconClasses} left-3`}>
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className={`${iconClasses} right-3`}>
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helper) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helper}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };