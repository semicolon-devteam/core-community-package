/**
 * Badge Component
 * 
 * A versatile badge component for displaying status, labels, and notifications.
 * Perfect for user levels, post tags, notification counts, etc.
 */

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Badge visual variant */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Badge size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Make badge rounded/pill-shaped */
  rounded?: boolean;
  
  /** Show a dot indicator */
  dot?: boolean;
}

/**
 * Badge component for status indicators and labels
 * 
 * @example
 * ```tsx
 * import { Badge } from '@semicolon/community-core';
 * 
 * // Basic usage
 * <Badge>New</Badge>
 * 
 * // User level badge
 * <Badge variant="primary" rounded>Level 5</Badge>
 * 
 * // Notification count
 * <Badge variant="danger" size="sm">3</Badge>
 * 
 * // Status indicator with dot
 * <Badge variant="success" dot>Online</Badge>
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  rounded = false,
  dot = false,
  className = '',
  children,
  ...props
}) => {
  // Base classes
  const baseClasses = [
    'inline-flex items-center font-medium',
    rounded ? 'rounded-full' : 'rounded-md'
  ];

  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-indigo-100 text-indigo-800'
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  };

  // Dot classes
  const dotClasses = {
    primary: 'bg-blue-400',
    secondary: 'bg-gray-400',
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    danger: 'bg-red-400',
    info: 'bg-indigo-400'
  };

  // Combine all classes
  const badgeClasses = [
    ...baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  // Dot component
  const DotIndicator = () => (
    <span 
      className={`w-2 h-2 rounded-full mr-1.5 ${dotClasses[variant]}`}
      aria-hidden="true"
    />
  );

  return (
    <span className={badgeClasses} {...props}>
      {dot && <DotIndicator />}
      {children}
    </span>
  );
};

export default Badge;