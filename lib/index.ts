// @semicolon/community-core v1.0.0
// Community platform core components and utilities

// =============================================================================
// MAIN EXPORTS - Most commonly used items
// =============================================================================

// Essential Utilities (most frequently used)
export { formatNumberWithComma } from './utils/numberUtil';
export { formatDate, timeAgo } from './utils/dateUtil';
export { isAdmin } from './utils/authUtil';

// Core Types (essential for TypeScript users)
export type { User } from './types/User';
export type { CommonResponse } from './types/common';

// =============================================================================
// CATEGORY EXPORTS - Organized by domain
// =============================================================================

// All utilities
export * as Utils from './utils';

// All types (commented out due to build complexity)
// export * as Types from './types';

// Constants will be added in Phase 2
// export * as Constants from './constants';

// =============================================================================
// INITIALIZATION
// =============================================================================

// Package initialization function
export { initializeCommunityCore } from './config/init';

// Configuration utilities
export { getPackageConfig } from './config/init';

// =============================================================================
// COMPONENT EXPORTS - New design system components
// =============================================================================

// Essential components (Phase 1)
export { Button, Badge, Avatar } from './components/atoms';
export type { ButtonProps, BadgeProps, AvatarProps } from './components/atoms';

// Phase 2.1 Form Components
export { 
  Input, 
  Select, 
  Checkbox, 
  Radio, 
  Switch, 
  TextArea 
} from './components/atoms';
export type { 
  InputProps, 
  SelectProps, 
  SelectOption,
  CheckboxProps, 
  RadioProps, 
  SwitchProps, 
  TextAreaProps 
} from './components/atoms';

// Phase 2.2 Loading & Feedback Components
export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard
} from './components/atoms';
export type { SkeletonProps } from './components/atoms';

// =============================================================================  
// SERVICE LAYER EXPORTS - Phase 2 Complete
// =============================================================================

// Service Classes (Modern API)
export { 
  BaseService, 
  UserService, 
  PostService, 
  BoardService,
  AuthService,
  PermissionService
} from './services';

// Legacy Service Objects (backward compatibility)
export {
  baseService,
  userService, 
  postService,
  boardService,
  authService,
  permissionService
} from './services';

// Service Types
export type {
  RequestOptions,
  HttpMethod,
  UserServiceOptions,
  UserPermission,
  UserUpdateData,
  UserSearchOptions,
  PostServiceOptions,
  PostListOptions,
  PostCreateData,
  PostUpdateData,
  PostDownloadHistory,
  DraftPostRequest,
  DraftPostResponse,
  AsyncUploadConfig,
  UploadStartResponse,
  UploadProgressResponse,
  BoardServiceOptions,
  BoardListOptions,
  BoardCreateData,
  BoardUpdateData,
  BoardCategoryCreateData,
  BoardStats,
  AuthServiceOptions,
  LoginCredentials,
  RegisterData,
  AuthTokens,
  AuthResponse,
  PasswordResetData,
  PasswordChangeData,
  SessionInfo,
  PermissionServiceOptions,
  PermissionCheck,
  PermissionResult,
  UserPermissions,
  LevelInfo,
  RoleInfo,
  PermissionGrant
} from './services';

// =============================================================================
// HOOKS LAYER EXPORTS - Phase 3 Complete ✅
// =============================================================================

// Authentication & State Management Hooks
export { useAuth } from './hooks/User/useAuth';
export { useGlobalLoader } from './hooks/common/useGlobalLoader';
export { usePermission } from './hooks/common/usePermission';
export { useAuthGuard } from './hooks/common/useAuthGuard';

// React Query Data Fetching Hooks
export { useUserPointQuery, useUserPointHistoryQuery } from './hooks/queries/useUserQuery';
export { usePostQuery, usePostBookmarkQuery, useDraftPostQuery } from './hooks/queries/usePostQuery';
export { useBoardQuery } from './hooks/queries/useBoardQuery';
export { useCommentQuery } from './hooks/queries/useCommentQuery';

// Common Utility Hooks
export { useDeviceType } from './hooks/common/useDeviceType';
export { useRouterWithLoader } from './hooks/common/useRouterWithLoader';

// =============================================================================
// DEVELOPMENT EXPORTS - Available but not prominently featured
// =============================================================================

// Full category exports (for advanced usage) - commented out to reduce build warnings
// export * as Components from './components';  // All components (legacy + new)
// export * as Hooks from './hooks';         // Phase 3
// export * as Services from './services';   // Completed in Phase 2

// =============================================================================
// THEME SYSTEM EXPORTS - Phase 4 Complete ✅
// =============================================================================

// Theme Provider and Hooks
export { 
  ThemeProvider, 
  useTheme, 
  useThemeColors, 
  useThemeTypography,
  useThemeSpacing,
  useThemeMode,
  useCSSVariable 
} from './theme';

// Theme Creation and Customization
export {
  createCustomTheme,
  createColorPalette,
  createSemanticColors,
  createTypographyConfig,
  createComponentConfig,
  createQuickTheme
} from './theme';

// Default Themes
export {
  defaultLightTheme,
  defaultDarkTheme,
  koreanLightTheme,
  koreanDarkTheme,
  getThemePreset,
  getThemeByMode
} from './theme';

// CSS Variables and Utilities
export {
  generateCSSVariables,
  createCSSVariable,
  createColorVariable,
  createSpacingVariable,
  createFontSizeVariable,
  validateThemeOverride,
  extractThemePreview
} from './theme';

// Theme Types
export type {
  Theme,
  ThemeConfig,
  ThemeOverride,
  ColorPalette,
  SemanticColors,
  SystemColors,
  Typography,
  ComponentTokens,
  ComponentVariant,
  ComponentSize
} from './theme';

// =============================================================================
// VERSION INFO
// =============================================================================
export const VERSION = '1.3.2';
export const PACKAGE_NAME = '@team-semicolon/community-core';