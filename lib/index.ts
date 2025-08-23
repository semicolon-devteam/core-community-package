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
// DEVELOPMENT EXPORTS - Available but not prominently featured
// =============================================================================

// Full category exports (for advanced usage) - commented out to reduce build warnings
// export * as Components from './components';  // All components (legacy + new)
// export * as Hooks from './hooks';         // Phase 3
// export * as Services from './services';   // Completed in Phase 2

// =============================================================================
// VERSION INFO
// =============================================================================
export const VERSION = '1.0.2';
export const PACKAGE_NAME = '@team-semicolon/community-core';