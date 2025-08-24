/**
 * Button Component
 * 
 * A flexible, accessible button component with multiple variants and sizes.
 * Designed for community platform usage with built-in loading states and accessibility.
 */

'use client';

import React, { forwardRef } from 'react';
import { useTheme } from '../../../theme/ThemeProvider';
import { createCSSVariable, createColorVariable, createSpacingVariable, createFontSizeVariable } from '../../../theme/utils/cssVariables';

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
  style,
  ...props
}, ref) => {
  const { theme } = useTheme();
  
  // Base styles using theme
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: createCSSVariable('font-family-sans'),
    fontWeight: createCSSVariable('font-weight-medium'),
    transitionProperty: 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
    transitionDuration: createCSSVariable('duration-200'),
    transitionTimingFunction: createCSSVariable('timing-in-out'),
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    ...style,
  };

  // Size-based styles
  const sizeStyles = {
    sm: {
      padding: theme.components.button.padding.xs,
      fontSize: createFontSizeVariable(theme.components.button.fontSize.xs),
      borderRadius: createCSSVariable(`border-radius-${theme.components.button.borderRadius}`),
      height: theme.components.button.height.xs,
    },
    md: {
      padding: theme.components.button.padding.base,
      fontSize: createFontSizeVariable(theme.components.button.fontSize.base),
      borderRadius: createCSSVariable(`border-radius-${theme.components.button.borderRadius}`),
      height: theme.components.button.height.base,
    },
    lg: {
      padding: theme.components.button.padding.lg,
      fontSize: createFontSizeVariable(theme.components.button.fontSize.lg),
      borderRadius: createCSSVariable(`border-radius-${theme.components.button.borderRadius}`),
      height: theme.components.button.height.lg,
    }
  };

  // Variant-based styles
  const variantStyles = {
    primary: {
      backgroundColor: createColorVariable('primary', '600'),
      color: createCSSVariable('text-inverse'),
      ':hover': {
        backgroundColor: createColorVariable('primary', '700'),
      },
      ':focus': {
        boxShadow: `0 0 0 2px ${createColorVariable('primary', '500')}`,
      }
    },
    secondary: {
      backgroundColor: createColorVariable('secondary', '600'),
      color: createCSSVariable('text-inverse'),
      ':hover': {
        backgroundColor: createColorVariable('secondary', '700'),
      },
      ':focus': {
        boxShadow: `0 0 0 2px ${createColorVariable('secondary', '500')}`,
      }
    },
    outline: {
      backgroundColor: 'transparent',
      border: `2px solid ${createCSSVariable('border-primary')}`,
      color: createCSSVariable('text-primary'),
      ':hover': {
        backgroundColor: createCSSVariable('background-secondary'),
      },
      ':focus': {
        boxShadow: `0 0 0 2px ${createColorVariable('primary', '500')}`,
      }
    },
    ghost: {
      backgroundColor: 'transparent',
      color: createCSSVariable('text-primary'),
      ':hover': {
        backgroundColor: createCSSVariable('background-tertiary'),
      },
      ':focus': {
        boxShadow: `0 0 0 2px ${createColorVariable('primary', '500')}`,
      }
    },
    danger: {
      backgroundColor: createColorVariable('error', '600'),
      color: createCSSVariable('text-inverse'),
      ':hover': {
        backgroundColor: createColorVariable('error', '700'),
      },
      ':focus': {
        boxShadow: `0 0 0 2px ${createColorVariable('error', '500')}`,
      }
    }
  };

  // Disabled styles
  const disabledStyle = {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none' as const,
  };

  // Width style
  const widthStyle = fullWidth ? { width: '100%' } : {};

  // Combine all styles
  const combinedStyle: React.CSSProperties = {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...(disabled || loading ? disabledStyle : {}),
    ...widthStyle,
  };

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
      className={className}
      style={combinedStyle}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && startIcon && (
        <span style={{ marginRight: createSpacingVariable('2') }}>{startIcon}</span>
      )}
      {children}
      {!loading && endIcon && (
        <span style={{ marginLeft: createSpacingVariable('2') }}>{endIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;