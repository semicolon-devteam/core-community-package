/**
 * @semicolon/community-core
 * cm-template 기반 Auth 패키지
 *
 * Version: 2.0.0
 * Description: Supabase 기반 인증 시스템 with React Hooks
 */

// =============================================================================
// Version Information
// =============================================================================
export const VERSION = '2.0.0';

// =============================================================================
// Types
// =============================================================================
export type {
  // Core Auth Types
  AuthError,
  AuthResponse,
  ActionResponse,

  // Login Types
  LoginCredentials,
  UseLoginReturn,

  // Register Types
  RegisterData,
  NicknameCheckResult,
  UseRegisterReturn,

  // Profile Types
  ProfileData,
  UseProfileReturn,

  // Auth Context Types
  AuthContextType,
  AuthProviderProps,

  // Supabase Auth Types
  UseSupabaseAuthReturn,

  // Permission Types
  UsePermissionReturn,
} from './types/auth.types';

// Re-export Supabase types for convenience
export type { User, Session } from '@supabase/supabase-js';

// =============================================================================
// Providers
// =============================================================================
export { AuthProvider, useAuth } from './providers/auth-provider';

// =============================================================================
// Hooks
// =============================================================================
export { useSupabaseAuth, usePermission } from './hooks/use-supabase-auth';
export { useLogin } from './hooks/auth/useLogin';
export { useRegister } from './hooks/auth/useRegister';
export { useProfile } from './hooks/auth/useProfile';

// =============================================================================
// Services
// =============================================================================
export { SupabaseAuthClientAdapter } from './services/adapters/auth.client.adapter';

// =============================================================================
// Utilities
// =============================================================================
export {
  // User utilities
  isAuthenticated,
  isAdmin,
  getUserLevel,
  getUserNickname,
  getUserProfile,

  // Permission utilities
  checkLevelPermission,
  checkRolePermission,
  checkResourcePermission,

  // Validation utilities
  validateEmail,
  validatePassword,
  validateNickname,

  // Storage utilities
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
} from './utils/auth.utils';

// =============================================================================
// Constants
// =============================================================================
export {
  AUTH_CONFIG,
  AUTH_ERRORS,
  USER_LEVELS,
  USER_ROLES,
  PERMISSIONS,
  OAUTH_PROVIDERS,
  OAUTH_PROVIDER_NAMES,
  SESSION_SYNC_EVENTS,
  AUTH_FORM_MODES,
  COOKIE_NAMES,
} from './constants/auth.constants';