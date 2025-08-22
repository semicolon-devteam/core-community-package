/**
 * @semicolon/community-core components
 * 
 * Component library organized by atomic design principles.
 * Start with atoms, build up to molecules and organisms.
 */

// =============================================================================
// NEW DESIGN SYSTEM - Modern, accessible components
// =============================================================================

// Atoms - Essential building blocks
export * from './atoms';

// =============================================================================
// LEGACY COMPONENTS - Backward compatibility during transition
// =============================================================================

// Note: These legacy components will be gradually migrated to the new design system
// For now, keeping exports for backward compatibility

// Legacy Atoms
export { default as AnimatedPoint } from './atoms/AnimatedPoint';
export { default as Captcha } from './atoms/Captcha';
export { default as Checkbox } from './atoms/Checkbox';
export { default as ClipboardButton } from './atoms/ClipboardButton';
export { default as Collapse } from './atoms/Collapse';
export { default as CustomSelect } from './atoms/CustomSelect';
export { default as DeleteButton } from './atoms/DeleteButton/DeleteButton';
export { default as EditButton } from './atoms/EditButton/EditButton';
export { default as PaginationItem } from './atoms/PaginationItem';
export { default as PointInput } from './atoms/PointInput/PointInput';
export { default as RadioButton } from './atoms/RadioButton/RadioButton';
export { default as ReportButton } from './atoms/ReportButton/ReportButton';
export { default as SaveButton } from './atoms/SaveButton/SaveButton';
export { default as Skeleton } from './atoms/Skeleton';
export { default as Toast } from './atoms/Toast';
export { default as ToastEditor } from './atoms/ToastEditor';
export { default as UserSearchInput } from './atoms/UserSearchInput/UserSearchInput';
export { default as VideoPlayer } from './atoms/VideoPlayer';
export { default as WriteButton } from './atoms/WriteButton/WriteButton';

// Column related exports
export * from './atoms/Column/BoardTableBody';
export { default as BoardTableHeader } from './atoms/Column/BoardTableHeader';

// Icon exports
export * from './atoms/Icon/BoardRefreshIcon';
export * from './atoms/Icon/BoardSearchIcon';
export * from './atoms/Icon/CommentIcon';
export * from './atoms/Icon/EyeIcon';
export * from './atoms/Icon/FirstPageIcon';
export * from './atoms/Icon/ImageIcon';
export * from './atoms/Icon/LastPageIcon';
export * from './atoms/Icon/LikeIcon';
export * from './atoms/Icon/NextPageIcon';
export * from './atoms/Icon/PrevPageIcon';
export * from './atoms/Icon/ThumbsUpIcon';
export * from './atoms/Icon/TimeIcon';
export * from './atoms/Icon/UserProfileIcon';

// Legacy Molecules
export { default as Pagination } from './molecules/Board/Pagination';
export { default as SearchBar } from './molecules/Board/SearchBar';
export { default as Tooltip } from './molecules/Tooltip';

// Legacy Organisms
export { default as AuthErrorHandler } from './organisms/AuthErrorHandler';
export { default as AuthGuard } from './organisms/AuthGuard';
export { default as GlobalLoader } from './organisms/GlobalLoader';
export { default as Navigation } from './organisms/Navigation';

// =============================================================================
// FUTURE RELEASES - Roadmap
// =============================================================================

// Phase 2: Enhanced Molecules
// export * from './molecules';

// Phase 3: Advanced Organisms  
// export * from './organisms';