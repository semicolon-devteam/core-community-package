/**
 * @semicolon/community-core
 * Auth 관련 상수 정의
 */

// =============================================================================
// Auth 설정 상수
// =============================================================================

export const AUTH_CONFIG = {
  // 토큰 만료 시간 (15분)
  TOKEN_EXPIRY_TIME: 15 * 60 * 1000,

  // 토큰 갱신 임계점 (5분 전)
  REFRESH_THRESHOLD: 5 * 60 * 1000,

  // 세션 동기화 채널 이름
  SESSION_SYNC_CHANNEL: 'auth_session_sync',

  // 로컬 스토리지 키
  STORAGE_KEYS: {
    AUTH_STATE: 'auth_state',
    USER_PREFERENCES: 'user_preferences',
    LAST_LOGIN: 'last_login',
  },

  // 쿠키 설정
  COOKIE_OPTIONS: {
    SAME_SITE: 'lax' as const,
    SECURE: true,
    HTTP_ONLY: true,
    MAX_AGE: 7 * 24 * 60 * 60, // 7일
  },

  // OAuth 리다이렉트 경로
  OAUTH_REDIRECT_PATH: '/auth/callback',

  // 비밀번호 재설정 리다이렉트 경로
  RESET_PASSWORD_REDIRECT_PATH: '/auth/reset-password',
} as const;

// =============================================================================
// 에러 메시지 상수
// =============================================================================

export const AUTH_ERRORS = {
  // 일반 에러
  UNKNOWN_ERROR: '예기치 않은 오류가 발생했습니다.',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다.',

  // 인증 에러
  LOGIN_REQUIRED: '로그인이 필요합니다.',
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다.',
  ACCOUNT_NOT_FOUND: '계정을 찾을 수 없습니다.',
  ACCOUNT_DISABLED: '비활성화된 계정입니다.',
  EMAIL_NOT_CONFIRMED: '이메일 인증이 필요합니다.',

  // 권한 에러
  INSUFFICIENT_PERMISSION: '권한이 부족합니다.',
  ADMIN_REQUIRED: '관리자 권한이 필요합니다.',
  LEVEL_REQUIRED: '레벨이 부족합니다.',

  // 회원가입 에러
  EMAIL_ALREADY_EXISTS: '이미 사용 중인 이메일입니다.',
  NICKNAME_ALREADY_EXISTS: '이미 사용 중인 닉네임입니다.',
  WEAK_PASSWORD: '비밀번호가 너무 약합니다.',

  // 비밀번호 에러
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
  PASSWORD_TOO_SHORT: '비밀번호는 최소 6자 이상이어야 합니다.',
  PASSWORD_REQUIRED_UPPERCASE: '대문자를 포함해야 합니다.',
  PASSWORD_REQUIRED_NUMBERS: '숫자를 포함해야 합니다.',
  PASSWORD_REQUIRED_SPECIAL: '특수문자를 포함해야 합니다.',

  // OAuth 에러
  OAUTH_ERROR: 'OAuth 인증 중 오류가 발생했습니다.',
  OAUTH_CANCELLED: 'OAuth 인증이 취소되었습니다.',
  OAUTH_PROVIDER_ERROR: 'OAuth 제공자 오류가 발생했습니다.',

  // 세션 에러
  SESSION_EXPIRED: '세션이 만료되었습니다.',
  SESSION_INVALID: '유효하지 않은 세션입니다.',

  // 닉네임 에러
  NICKNAME_TOO_SHORT: '닉네임은 최소 2자 이상이어야 합니다.',
  NICKNAME_TOO_LONG: '닉네임은 최대 20자까지 가능합니다.',
  NICKNAME_INVALID_CHARS: '닉네임은 영문, 숫자, 한글, 언더스코어(_)만 사용 가능합니다.',

  // API 에러
  API_NOT_PROVIDED: 'API 함수가 제공되지 않았습니다.',
  NICKNAME_CHECK_API_NOT_SET: '닉네임 확인 API가 설정되지 않았습니다.',
} as const;

// =============================================================================
// 사용자 레벨 상수
// =============================================================================

export const USER_LEVELS = {
  GUEST: 0,        // 비회원
  BASIC: 1,        // 기본 회원
  REGULAR: 5,      // 정회원
  VIP: 10,         // VIP 회원
  MODERATOR: 50,   // 모더레이터
  ADMIN: 99,       // 관리자
  SUPER_ADMIN: 100 // 최고 관리자
} as const;

// =============================================================================
// 사용자 역할 상수
// =============================================================================

export const USER_ROLES = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
} as const;

// =============================================================================
// 권한 액션 상수
// =============================================================================

export const PERMISSIONS = {
  ACTIONS: {
    READ: 'read',
    WRITE: 'write',
    DELETE: 'delete',
    ADMIN: 'admin'
  },

  RESOURCES: {
    POSTS: 'posts',
    COMMENTS: 'comments',
    USERS: 'users',
    ADMIN_PANEL: 'admin_panel',
    SETTINGS: 'settings'
  }
} as const;

// =============================================================================
// OAuth 제공자 상수
// =============================================================================

export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  GITHUB: 'github',
  KAKAO: 'kakao'
} as const;

export const OAUTH_PROVIDER_NAMES = {
  [OAUTH_PROVIDERS.GOOGLE]: 'Google',
  [OAUTH_PROVIDERS.GITHUB]: 'GitHub',
  [OAUTH_PROVIDERS.KAKAO]: 'Kakao'
} as const;

// =============================================================================
// 세션 동기화 메시지 타입
// =============================================================================

export const SESSION_SYNC_EVENTS = {
  LOGIN: 'auth:login',
  LOGOUT: 'auth:logout',
  TOKEN_REFRESH: 'auth:token_refresh',
  USER_UPDATE: 'auth:user_update',
  TAB_FOCUS: 'auth:tab_focus',
  TAB_CLOSE: 'auth:tab_close'
} as const;

// =============================================================================
// 폼 모드 상수
// =============================================================================

export const AUTH_FORM_MODES = {
  LOGIN: 'login',
  REGISTER: 'register',
  RESET_PASSWORD: 'reset-password'
} as const;

// =============================================================================
// 쿠키 이름 상수
// =============================================================================

export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'user_id'
} as const;