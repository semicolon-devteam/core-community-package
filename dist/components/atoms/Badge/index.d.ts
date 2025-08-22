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
export declare const Badge: React.FC<BadgeProps>;
export default Badge;
