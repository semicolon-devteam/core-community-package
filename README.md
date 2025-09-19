# @team-semicolon/community-core

<div align="center">

[![npm version](https://img.shields.io/npm/v/@team-semicolon/community-core.svg)](https://www.npmjs.com/package/@team-semicolon/community-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

cm-template 기반 Auth 훅 패키지 - 커뮤니티 플랫폼 인증 시스템

> **Version 2.0.0** | 완전히 새로운 Auth 중심 설계

</div>

## 🎯 개요

`@team-semicolon/community-core`는 cm-template 프로젝트를 기반으로 완전히 재설계된 React Auth 훅 패키지입니다. 커뮤니티 플랫폼에서 필요한 인증, 권한 관리, 세션 동기화 등의 기능을 제공합니다.

## ✨ 주요 기능

### 🔐 Auth 훅
- **useAuth**: 로그인/로그아웃, 세션 관리
- **useAuthForm**: 폼 상태 관리 및 유효성 검증
- **usePermissionCheck**: 세밀한 권한 체크 시스템
- **useAuthRedirect**: 인증 기반 자동 리다이렉션
- **useSessionSync**: 멀티 탭 세션 동기화

### 🛠️ 유틸리티
- 권한 체크 함수들
- 토큰 관리 및 JWT 처리
- 스토리지 관리
- 비밀번호 검증

### 📝 타입 시스템
- 완전한 TypeScript 지원
- 세밀한 타입 정의
- Generic 타입 지원

## 📦 설치

```bash
npm install @team-semicolon/community-core
# or
yarn add @team-semicolon/community-core
# or
pnpm add @team-semicolon/community-core
```

## 🚀 사용법

### 기본 인증

```tsx
import { useAuth } from '@team-semicolon/community-core';

function LoginComponent() {
  const {
    user,
    isAuthenticated,
    login,
    logout,
    isLoading
  } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        email: 'user@example.com',
        password: 'password123'
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### 폼 관리

```tsx
import { useAuthForm } from '@team-semicolon/community-core';

function SignupForm() {
  const {
    fields,
    errors,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useAuthForm({
    mode: 'register',
    validationRules: {
      email: { required: true },
      password: {
        required: true,
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true
      },
      confirmPassword: {
        required: true,
        matchField: 'password'
      },
    },
    onSuccess: async (data) => {
      console.log('Registration successful:', data);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={fields.email.value}
        onChange={(e) => handleChange('email', e.target.value)}
        onBlur={() => handleBlur('email')}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email}</span>}

      <input
        type="password"
        value={fields.password.value}
        onChange={(e) => handleChange('password', e.target.value)}
        onBlur={() => handleBlur('password')}
        placeholder="Password"
      />
      {errors.password && <span>{errors.password}</span>}

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

### 권한 체크

```tsx
import { usePermissionCheck } from '@team-semicolon/community-core';

function AdminPanel() {
  const {
    can,
    hasLevel,
    isAdmin,
    checkAllPermissions
  } = usePermissionCheck();

  const canCreatePost = can({
    resource: 'post',
    action: 'write'
  });

  const canDeleteComment = can({
    resource: 'comment',
    action: 'delete',
    conditions: { authorId: 'current-user-id' }
  });

  if (!isAdmin) {
    return <div>Access denied</div>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      {canCreatePost && <button>Create Post</button>}
      {canDeleteComment && <button>Delete Comment</button>}
      {hasLevel(10) && <button>VIP Feature</button>}
    </div>
  );
}
```

### 자동 리다이렉션

```tsx
import { useAuthRedirect } from '@team-semicolon/community-core';

function ProtectedPage() {
  const {
    canAccess,
    isRedirecting,
    redirectTo
  } = useAuthRedirect({
    authRequiredPaths: ['/dashboard', '/profile'],
    publicOnlyPaths: ['/login', '/register'],
    protectedPath: '/dashboard',
    publicPath: '/login'
  });

  const currentPath = window.location.pathname;

  if (isRedirecting) {
    return <div>Redirecting...</div>;
  }

  if (!canAccess(currentPath)) {
    return <div>Access denied</div>;
  }

  return <div>Protected content</div>;
}
```

### 세션 동기화

```tsx
import { useSessionSync } from '@team-semicolon/community-core';

function App() {
  const {
    isMainTab,
    syncStatus,
    broadcast,
    tabCount
  } = useSessionSync({
    enabled: true,
    onSessionChange: (message) => {
      console.log('Session changed:', message);
    },
    onMainTabChange: (isMain) => {
      console.log('Main tab status:', isMain);
    }
  });

  return (
    <div>
      <p>Sync Status: {syncStatus}</p>
      <p>Is Main Tab: {isMainTab ? 'Yes' : 'No'}</p>
      <p>Open Tabs: {tabCount}</p>
    </div>
  );
}
```

## 📚 API 참조

### Import 전략

```typescript
// ✅ 메인 패키지에서 직접 import (권장)
import {
  useAuth,
  useAuthForm,
  usePermissionCheck,
  useAuthRedirect,
  useSessionSync,
  isAuthenticated,
  validatePassword,
  storage
} from '@team-semicolon/community-core';

// ✅ 카테고리별 import (Tree Shaking 최적화)
import { useAuth } from '@team-semicolon/community-core/hooks';
import { isAuthenticated } from '@team-semicolon/community-core/utils';
import { AUTH_CONFIG } from '@team-semicolon/community-core/constants';
import type { User, Permission } from '@team-semicolon/community-core/types';

// ✅ 세부 모듈별 import
import { useAuth, useAuthForm } from '@team-semicolon/community-core/hooks/auth';
```

### 주요 타입

```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  nickname?: string;
  avatar?: string;
  level?: number;
  permissionType?: 'user' | 'admin' | 'super_admin';
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, any>;
}

interface Permission {
  resource: string;
  action: 'read' | 'write' | 'delete' | 'admin';
  conditions?: Record<string, any>;
}

interface AuthError {
  code: string;
  message: string;
  details?: any;
}
```

### 상수

```typescript
import { AUTH_CONFIG, AUTH_ERRORS, USER_LEVELS } from '@team-semicolon/community-core';

// 설정값
console.log(AUTH_CONFIG.TOKEN_EXPIRY_TIME); // 15분
console.log(AUTH_CONFIG.REFRESH_THRESHOLD); // 5분

// 에러 코드
console.log(AUTH_ERRORS.LOGIN_REQUIRED);
console.log(AUTH_ERRORS.INSUFFICIENT_PERMISSION);

// 사용자 레벨
console.log(USER_LEVELS.ADMIN); // 99
console.log(USER_LEVELS.VIP); // 10
```

## 🏗️ 아키텍처

```
@team-semicolon/community-core/
├── src/                  # 소스 코드
│   ├── hooks/           # React Hooks
│   │   └── auth/        # Auth 관련 훅들
│   ├── utils/           # 유틸리티 함수
│   ├── types/           # TypeScript 타입
│   └── constants/       # 상수 정의
├── dist/                # 빌드 출력
└── docs/                # 문서
```

## 🔧 개발

### 요구사항

- Node.js >= 18.0.0
- React >= 18.0.0
- TypeScript >= 5.0.0

### 스크립트

```bash
# 패키지 빌드
npm run build

# 타입 체크
npm run type-check

# 테스트 실행
npm test

# 개발 모드 (watch)
npm run dev
```

## 🆕 v2.0.0 변경사항

- **Breaking Change**: 완전히 새로운 Auth 중심 설계
- 기존 UI 컴포넌트, 서비스, Redux 코드 제거
- cm-template 기반 모던 Auth 훅 시스템 도입
- TypeScript 타입 시스템 강화
- Tree Shaking 최적화
- 브라우저 호환성 개선

## 📄 라이선스

MIT License

## 🤝 기여

기여를 환영합니다! 이슈나 풀 리퀘스트를 자유롭게 제출해 주세요.

## 📞 지원

- GitHub Issues: [https://github.com/semicolon-devteam/community-core/issues](https://github.com/semicolon-devteam/community-core/issues)
- 팀 세미콜론: [Team Semicolon](https://github.com/semicolon-devteam)

---

Made with ❤️ by Team Semicolon