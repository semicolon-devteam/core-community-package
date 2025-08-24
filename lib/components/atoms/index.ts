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
// PHASE 2.1 FORM ATOMS - New form components
// =============================================================================

export { Input, type InputProps } from './Input';
export { Select, type SelectProps, type SelectOption } from './Select';
export { Checkbox, type CheckboxProps } from './Checkbox';
export { Radio, type RadioProps } from './Radio';
export { Switch, type SwitchProps } from './Switch';
export { TextArea, type TextAreaProps } from './TextArea';

// =============================================================================
// PHASE 2.2 LOADING & FEEDBACK ATOMS - Loading states and user feedback
// =============================================================================

export { 
  Skeleton, 
  SkeletonText, 
  SkeletonAvatar, 
  SkeletonButton, 
  SkeletonCard,
  type SkeletonProps 
} from './Skeleton';

// =============================================================================
// FUTURE ATOMS - Planned for Phase 2.2+
// =============================================================================

// export { Icon, type IconProps } from './Icon';
// export { Spinner, type SpinnerProps } from './Spinner';