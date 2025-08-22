/**
 * Button Component
 *
 * A flexible, accessible button component with multiple variants and sizes.
 * Designed for community platform usage with built-in loading states and accessibility.
 */
import React from 'react';
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
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export default Button;
