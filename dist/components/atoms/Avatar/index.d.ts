/**
 * Avatar Component
 *
 * User avatar component with fallback support and multiple sizes.
 * Integrates with community platform user system and image optimization.
 */
import React from 'react';
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
export declare const Avatar: React.FC<AvatarProps>;
export default Avatar;
