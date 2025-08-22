/**
 * @semicolon/community-core atoms
 * 
 * Fundamental UI building blocks. These components are:
 * - Stateless and pure
 * - Highly reusable
 * - Focused on single responsibility
 * - Framework-agnostic (when possible)
 */

// =============================================================================
// ESSENTIAL ATOMS - Most commonly used basic components
// =============================================================================

export { Button, type ButtonProps } from './Button';
export { Badge, type BadgeProps } from './Badge';
export { Avatar, type AvatarProps } from './Avatar';

// =============================================================================
// LEGACY ATOMS - Available but with build warnings (gradual migration)
// =============================================================================

// Note: Legacy components are available but may produce build warnings
// They will be gradually refactored to match the new design system

// =============================================================================
// FUTURE ATOMS - Planned for Phase 2
// =============================================================================

// export { Input, type InputProps } from './Input';
// export { Checkbox, type CheckboxProps } from './Checkbox';
// export { RadioButton, type RadioButtonProps } from './RadioButton';
// export { Icon, type IconProps } from './Icon';
// export { Spinner, type SpinnerProps } from './Spinner';