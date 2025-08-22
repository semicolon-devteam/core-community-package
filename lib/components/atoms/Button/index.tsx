/**
 * Button Component
 * 
 * A flexible, accessible button component with multiple variants and sizes.
 * Designed for community platform usage with built-in loading states and accessibility.
 */

import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button visual style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Show loading state */
  loading?: boolean;
  
  /** Make button full width */
  fullWidth?: boolean;
  
  /** Icon to show before text */
  startIcon?: React.ReactNode;
  
  /** Icon to show after text */
  endIcon?: React.ReactNode;
}

/**
 * Button component with multiple variants and accessibility features
 * 
 * @example
 * ```tsx
 * import { Button } from '@semicolon/community-core';
 * 
 * // Basic usage
 * <Button>Click me</Button>
 * 
 * // With variant and size
 * <Button variant="primary" size="lg">Submit</Button>
 * 
 * // Loading state
 * <Button loading onClick={handleSubmit}>Save Changes</Button>
 * 
 * // With icons
 * <Button startIcon={<PlusIcon />}>Add New</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  disabled,
  className = '',
  children,
  ...props
}, ref) => {
  // Base classes
  const baseClasses = [
    'inline-flex items-center justify-center font-medium transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ];

  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg', 
    lg: 'px-6 py-3 text-lg rounded-lg'
  };

  // Width classes
  const widthClass = fullWidth ? 'w-full' : '';

  // Combine all classes
  const buttonClasses = [
    ...baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClass,
    className
  ].filter(Boolean).join(' ');

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg 
      className="animate-spin -ml-1 mr-2 h-4 w-4" 
      fill="none" 
      viewBox="0 0 24 24"
      aria-hidden="true"
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
  );

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && startIcon && (
        <span className="mr-2">{startIcon}</span>
      )}
      {children}
      {!loading && endIcon && (
        <span className="ml-2">{endIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;