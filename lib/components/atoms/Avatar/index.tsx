/**
 * Avatar Component
 * 
 * User avatar component with fallback support and multiple sizes.
 * Integrates with community platform user system and image optimization.
 */

import React, { useState } from 'react';
import { normalizeImageSrc } from '../../../utils/imageUtil';

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** User's display name for fallback text */
  name?: string;
  
  /** Avatar size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  /** Show online status indicator */
  status?: 'online' | 'offline' | 'away' | 'busy';
  
  /** Make avatar square instead of circular */
  square?: boolean;
}

/**
 * Avatar component for user profile pictures
 * 
 * @example
 * ```tsx
 * import { Avatar } from '@semicolon/community-core';
 * 
 * // Basic usage
 * <Avatar src="/avatar.jpg" name="김철수" />
 * 
 * // With status indicator
 * <Avatar 
 *   src="/avatar.jpg" 
 *   name="김철수" 
 *   status="online"
 *   size="lg" 
 * />
 * 
 * // Square avatar for brand logos
 * <Avatar src="/logo.jpg" name="Company" square />
 * ```
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = '',
  size = 'md',
  status,
  square = false,
  className = '',
  alt,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Size classes
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-14 h-14 text-xl',
    '2xl': 'w-16 h-16 text-2xl'
  };

  // Status indicator classes
  const statusClasses = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    away: 'bg-yellow-400',
    busy: 'bg-red-400'
  };

  // Status indicator size based on avatar size
  const statusSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4'
  };

  // Base classes
  const baseClasses = [
    'inline-block relative',
    square ? 'rounded-lg' : 'rounded-full',
    'bg-gray-100 overflow-hidden',
    'ring-2 ring-white',
    sizeClasses[size]
  ];

  // Generate fallback initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Optimize image src
  const optimizedSrc = src ? normalizeImageSrc(src) : undefined;

  // Combine classes
  const avatarClasses = [...baseClasses, className].filter(Boolean).join(' ');

  return (
    <div className={avatarClasses}>
      {optimizedSrc && !imageError ? (
        <img
          src={optimizedSrc}
          alt={alt || name}
          className="w-full h-full object-cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
          {...props}
        />
      ) : (
        // Fallback with initials
        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-medium">
          {getInitials(name) || '?'}
        </div>
      )}
      
      {/* Status indicator */}
      {status && (
        <span 
          className={`absolute bottom-0 right-0 block ${statusSizeClasses[size]} ${statusClasses[status]} rounded-full ring-2 ring-white`}
          title={`Status: ${status}`}
          aria-label={`User status: ${status}`}
        />
      )}
    </div>
  );
};

export default Avatar;