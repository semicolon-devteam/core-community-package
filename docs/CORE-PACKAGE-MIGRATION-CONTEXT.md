# CORE-PACKAGE-MIGRATION-CONTEXT.md

## 🎯 마이그레이션 개요

cm-template 프로젝트의 Auth 관련 훅들을 @semicolon/community-core 패키지로 마이그레이션하기 위한 분석 및 계획 문서입니다.

## 📊 현재 패키지 Auth 구조 분석

### 기존 Auth 관련 훅 구조

#### 1. **useAuth** (`src/hooks/User/useAuth.ts`)
**현재 기능:**
- Redux 기반 인증 상태 관리
- 로그인/로그아웃 처리 (로더 통합)
- 자동 로그인 및 세션 체크
- 권한 기반 네비게이션
- Toast 알림 통합

**주요 메서드:**
```typescript
- loginWithLoader(loginData: LoginFormData)
- logoutWithLoader()
- initializeAuth()
- checkSession()
- navigateWithAuth(path, requiredLevel?, adminOnly?)
- isAdmin()
- isUser()
```

**의존성:**
- Redux store (userSlice)
- useGlobalLoader
- useRouterWithLoader
- Toast 시스템
- JWT 유틸리티

#### 2. **useAuthGuard** (`src/hooks/common/useAuthGuard.ts`)
**현재 기능:**
- 컴포넌트 레벨 권한 체크
- JWT 토큰 자동 검증 및 정리
- 다양한 권한 체크 옵션
- 에러 타입 관리

**주요 기능:**
```typescript
interface AuthGuardOptions {
  requiredLevel?: number;
  adminOnly?: boolean;
  boardPermissions?: { writeLevel?: number; readLevel?: number; };
  redirectOnError?: string;
  showToastOnError?: boolean;
}
```

**편의 훅:**
- `useAdminGuard()`: 관리자 전용 가드
- `useLevelGuard(level)`: 레벨 기반 가드
- `useBoardWriteGuard(writeLevel)`: 게시판 쓰기 권한 가드

#### 3. **지원 유틸리티**
- `authUtil.ts`: 권한 체크 헬퍼 함수
- `jwtUtil.ts`: JWT 토큰 관리
- `GlobalAuthListener.tsx`: 전역 인증 상태 리스너

## 🚀 cm-template의 신규 Auth 훅 제안

### 제안되는 신규 훅들

#### 1. **useAuthForm** (신규)
**목적:** 로그인/회원가입 폼 상태 관리 통합
```typescript
interface UseAuthFormOptions {
  mode: 'login' | 'register' | 'reset-password';
  validationRules?: ValidationRules;
  onSuccess?: (user: User) => void;
  onError?: (error: AuthError) => void;
}

const useAuthForm = (options: UseAuthFormOptions) => {
  // 폼 상태 관리
  // 유효성 검증
  // 에러 처리
  // 제출 로직
  return {
    fields,
    errors,
    isSubmitting,
    handleSubmit,
    resetForm,
  };
};
```

#### 2. **useSessionSync** (신규)
**목적:** 멀티 탭/윈도우 간 세션 동기화
```typescript
const useSessionSync = () => {
  // BroadcastChannel API 활용
  // 탭 간 로그인/로그아웃 상태 동기화
  // 토큰 갱신 동기화
  return {
    isMainTab,
    syncStatus,
    broadcastAuth,
  };
};
```

#### 3. **useAuthRedirect** (신규)
**목적:** 인증 상태 기반 자동 리다이렉션
```typescript
interface UseAuthRedirectOptions {
  protectedPath?: string;
  publicPath?: string;
  authRequiredPaths?: string[];
  publicOnlyPaths?: string[];
}

const useAuthRedirect = (options: UseAuthRedirectOptions) => {
  // 경로별 접근 권한 체크
  // 자동 리다이렉션 처리
  // 이전 페이지 기억 및 복귀
  return {
    redirectTo,
    canAccess,
    previousPath,
  };
};
```

#### 4. **usePermissionCheck** (기존 확장)
**목적:** 더 세밀한 권한 체크
```typescript
interface Permission {
  resource: string;
  action: 'read' | 'write' | 'delete' | 'admin';
  conditions?: Record<string, any>;
}

const usePermissionCheck = () => {
  return {
    can: (permission: Permission) => boolean,
    cannot: (permission: Permission) => boolean,
    permissions: Permission[],
    checkBulk: (permissions: Permission[]) => Record<string, boolean>,
  };
};
```

#### 5. **useAuthProviders** (신규)
**목적:** 소셜 로그인 통합 관리
```typescript
type Provider = 'google' | 'github' | 'kakao' | 'naver';

const useAuthProviders = () => {
  return {
    availableProviders: Provider[],
    loginWithProvider: (provider: Provider) => Promise<User>,
    linkProvider: (provider: Provider) => Promise<void>,
    unlinkProvider: (provider: Provider) => Promise<void>,
    linkedProviders: Provider[],
  };
};
```

## 📋 마이그레이션 가능성 평가

### ✅ 즉시 마이그레이션 가능한 항목

1. **useAuthForm** - 독립적인 폼 관리 로직
2. **usePermissionCheck** - 기존 authUtil 확장
3. **useAuthRedirect** - 라우터 래퍼로 구현 가능

### ⚠️ 추가 고려사항이 필요한 항목

1. **useSessionSync**
   - BroadcastChannel API 브라우저 호환성 체크 필요
   - 폴리필 고려

2. **useAuthProviders**
   - Supabase Auth 의존성 확인 필요
   - 각 소셜 로그인 프로바이더 설정 필요

### 🔧 기존 훅 개선사항

1. **useAuth 개선안:**
   - 에러 타입 표준화
   - 재시도 로직 추가
   - 토큰 리프레시 자동화 강화

2. **useAuthGuard 개선안:**
   - 캐싱 전략 추가
   - 권한 체크 성능 최적화
   - 커스텀 권한 규칙 지원

## 🗓️ 마이그레이션 계획

### Phase 1 (즉시 구현 가능)
- [ ] useAuthForm 구현
- [ ] useAuthRedirect 구현
- [ ] usePermissionCheck 구현
- [ ] 기존 useAuth 에러 타입 표준화

### Phase 2 (추가 설계 필요)
- [ ] useSessionSync 구현 (폴리필 포함)
- [ ] useAuthProviders 구현 (Supabase 통합)
- [ ] 권한 시스템 확장

### Phase 3 (테스트 및 문서화)
- [ ] 단위 테스트 작성
- [ ] 통합 테스트
- [ ] Storybook 스토리 추가
- [ ] API 문서 업데이트

## 🏗️ 구현 우선순위

1. **High Priority (1주차)**
   - useAuthForm: 모든 프로젝트에서 즉시 활용 가능
   - useAuthRedirect: 보안 강화 및 UX 개선

2. **Medium Priority (2주차)**
   - usePermissionCheck: 세밀한 권한 관리
   - useAuth 개선: 안정성 향상

3. **Low Priority (3주차)**
   - useSessionSync: 멀티 탭 환경 지원
   - useAuthProviders: 소셜 로그인 확장

## 📝 기술적 고려사항

### 의존성 관리
- Redux Toolkit 유지 (현재 구조와 호환)
- React Query 통합 고려 (서버 상태 관리)
- Supabase Auth 직접 통합 vs 추상화 레이어

### 타입 안정성
- 모든 새 훅은 완전한 TypeScript 타입 정의
- Generic 타입 활용으로 유연성 확보
- 엄격한 타입 체크 적용

### 성능 최적화
- 메모이제이션 적극 활용
- 불필요한 리렌더링 방지
- 권한 체크 결과 캐싱

### 하위 호환성
- 기존 API 유지하며 점진적 마이그레이션
- Deprecated 마킹으로 단계적 전환
- 마이그레이션 가이드 제공

## 🎯 예상 효과

1. **개발 생산성 향상**
   - 표준화된 Auth 패턴으로 개발 시간 단축
   - 재사용 가능한 컴포넌트 증가

2. **보안 강화**
   - 중앙 집중식 권한 관리
   - 자동화된 토큰 관리
   - 세션 동기화로 보안 허점 제거

3. **유지보수성 개선**
   - 단일 진실 공급원 (Single Source of Truth)
   - 테스트 커버리지 향상
   - 문서화 개선

## 📚 참고 자료

- 현재 패키지 구조: `/src/hooks/`
- Redux 상태 구조: `/src/redux/Features/User/`
- 유틸리티: `/src/util/authUtil.ts`, `/src/util/jwtUtil.ts`
- 컴포넌트: `/src/component/common/GlobalAuthListener.tsx`

---

*이 문서는 cm-template 프로젝트와 @semicolon/community-core 패키지 간의 Auth 기능 마이그레이션을 위한 기술 분석 및 실행 계획입니다.*