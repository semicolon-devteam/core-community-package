# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 레포지토리의 코드를 작업할 때 참조하는 가이드입니다.

## 🌟 프로젝트 개요

**@team-semicolon/community-core v2.0**는 Next.js 커뮤니티 플랫폼을 위한 훅, 유틸리티, 서비스 레이어를 제공하는 코어 패키지입니다.

### 핵심 특징 (v2.0 - 2025.01.19 개편)
- **UI 독립적**: 모든 UI 컴포넌트는 Next.js 앱에서 직접 구현
- **백엔드 통합**: Supabase + Spring 백엔드와 완벽한 통합
- **상태 관리**: Zustand 기반 경량 상태 관리 (Redux 제거)
- **타입 안전성**: TypeScript 5.0+ 완전 지원
- **실시간 기능**: Supabase Realtime 통합

## 🏗️ 아키텍처 (v2.0)

```
@team-semicolon/community-core/
├── 🪝 hooks/              # React Hooks
│   ├── auth/             # 인증 관련 (useAuth, usePermission)
│   ├── queries/          # React Query 데이터 페칭
│   ├── realtime/         # Supabase Realtime 훅
│   └── utils/            # 유틸리티 훅
├── 🔧 services/           # API 서비스 레이어
│   ├── base/             # BaseService (axios interceptors)
│   └── domain/           # 도메인별 서비스
├── 🗄️ stores/            # Zustand 상태 관리
├── 🛠️ utils/             # 유틸리티 함수
├── 📝 types/              # TypeScript 타입 정의
└── 🔌 providers/          # React Context Providers
```

## 📦 개발 명령어

```bash
# 개발
npm run dev                # Rollup watch 모드
npm run type-check          # TypeScript 타입 체크

# 빌드
npm run build              # 패키지 빌드
npm run clean              # dist 정리

# 테스트
npm test                   # Vitest 실행

# 배포
npm version [major|minor|patch]  # 버전 업데이트
npm publish --access public       # NPM 배포
```

## 🎯 Gitmoji 버저닝 규칙

| Gitmoji | 의미 | 버전 변경 |
|---------|------|-----------|
| 💥 `:boom:` | Breaking Change | **MAJOR** |
| ✨ `:sparkles:` | 새로운 기능 | **MINOR** |
| 🚀 `:rocket:` | 성능 개선 | **MINOR** |
| 🐛 `:bug:` | 버그 수정 | **PATCH** |
| 📝 `:memo:` | 문서 업데이트 | **PATCH** |
| ♻️ `:recycle:` | 리팩토링 | **PATCH** |

## 💻 코딩 컨벤션

### TypeScript
```typescript
// ✅ 명시적 타입 정의
interface UserData {
  id: string;
  name: string;
  email?: string;
}

// ✅ Const Assertion 사용
export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];
```

### Hooks
```typescript
// ✅ use 접두사, 객체 반환
export function useAuth() {
  return {
    user,
    signIn,
    signOut,
    isLoading,
  };
}
```

### Services
```typescript
// ✅ BaseService 확장, 타입 안전성
export class UserService extends BaseService {
  async getUser(id: string): Promise<CommonResponse<User>> {
    return this.get(`/users/${id}`);
  }
}
```

### Zustand Store
```typescript
// ✅ create + devtools + persist
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
      }),
      { name: 'auth-storage' }
    )
  )
);
```

## 📚 Import 전략

```typescript
// ✅ 권장: 메인 패키지에서 import
import { useAuth, UserService, formatDate } from '@team-semicolon/community-core';

// ✅ Tree-shaking 최적화
import { useAuth } from '@team-semicolon/community-core/hooks';
import { UserService } from '@team-semicolon/community-core/services';
```

## 🚀 주요 기능 (v2.0)

### 🪝 Hooks
- **인증**: `useAuth`, `usePermission`, `useAuthGuard`
- **데이터**: `useUser`, `usePosts`, `useComments`, `useInfiniteScroll`
- **실시간**: `useRealtimeChat`, `useRealtimePresence`, `useRealtimeUpdates`
- **유틸리티**: `useDebounce`, `useThrottle`, `useLocalStorage`, `useMediaQuery`

### 🔧 Services
- `BaseService`: HTTP 통신 추상화 (자동 토큰 갱신)
- `AuthService`: 인증/인가
- `UserService`: 사용자 관리
- `PostService`: 게시물 CRUD
- `ChatService`: 채팅 기능
- `NotificationService`: 알림 처리

### 🗄️ Stores (Zustand)
- `useAuthStore`: 인증 상태
- `useUIStore`: UI 상태 (모달, 토스트)
- `useAppStore`: 앱 전역 상태
- `useRealtimeStore`: 실시간 연결 상태

### 🛠️ Utils
- **포맷터**: `formatDate`, `formatNumber`, `formatCurrency`
- **검증**: `validateEmail`, `validatePassword`, `validateUsername`
- **헬퍼**: `debounce`, `throttle`, `retry`, `memoize`

## 🔄 마이그레이션 가이드 (v1 → v2)

### Breaking Changes
1. **UI 컴포넌트 제거**: 모든 UI 컴포넌트는 Next.js 앱에서 구현
2. **Redux → Zustand**: 상태 관리 시스템 변경
3. **Import 경로 변경**: `/dist/` 경로 제거

### 빠른 마이그레이션
```bash
# 1. 패키지 업데이트
npm uninstall @team-semicolon/community-core @reduxjs/toolkit react-redux
npm install @team-semicolon/community-core@^2.0.0 zustand

# 2. Provider 교체
- <Provider store={store}>
+ <CommunityProvider supabaseUrl={...} supabaseAnonKey={...}>

# 3. 상태 관리 코드 수정
- const user = useAppSelector(selectUser);
+ const { user } = useAuthStore();

# 4. UI 컴포넌트 교체
- import { Button } from '@team-semicolon/community-core';
+ import { Button } from '@/components/ui/button'; // shadcn/ui 등 사용
```

자세한 내용은 [MIGRATION.md](./docs/MIGRATION.md) 참조

## 🛠️ 개발 가이드

### 새로운 Hook 추가
```bash
# 1. Hook 파일 생성
touch lib/hooks/auth/useNewAuth.ts

# 2. 테스트 작성
touch lib/hooks/auth/__tests__/useNewAuth.test.ts

# 3. Export 추가
echo "export { useNewAuth } from './auth/useNewAuth';" >> lib/hooks/index.ts

# 4. 빌드 확인
npm run build
```

### 새로운 Service 추가
```typescript
// lib/services/domain/NewService.ts
import { BaseService } from '../base/BaseService';

export class NewService extends BaseService {
  async getData(id: string) {
    return this.get(`/api/new/${id}`);
  }
}
```

### Zustand Store 추가
```typescript
// lib/stores/newStore.ts
import { create } from 'zustand';

interface NewState {
  data: any[];
  fetchData: () => Promise<void>;
}

export const useNewStore = create<NewState>()((set) => ({
  data: [],
  fetchData: async () => {
    // 구현
  },
}));
```

## 🐛 문제 해결

### TypeScript 에러
```bash
rm -rf dist
npm run type-check
```

### 빌드 실패
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Supabase 연결
```typescript
// 환경 변수 확인
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

## 🤝 기여 방법

1. Feature 브랜치 생성 (`feature/hook-name`)
2. Gitmoji 커밋 메시지 사용
3. 테스트 추가 및 통과 확인
4. Pull Request 생성

## 📞 지원

- **Issues**: [GitHub Issues](https://github.com/team-semicolon/community-core/issues)
- **Discussions**: [GitHub Discussions](https://github.com/team-semicolon/community-core/discussions)
- **Email**: dev@team-semicolon.com

## 📋 버전 히스토리

### v2.0.0 (2025-01-19)
- 💥 모든 UI 컴포넌트 제거
- 💥 Redux → Zustand 마이그레이션
- ✨ Supabase Realtime 훅 추가
- ✨ 서비스 레이어 재설계
- 🚀 번들 크기 75% 감소

### v1.9.0 (2024-12-01)
- ✨ Tooltip, AnimatedPoint 컴포넌트 추가

### v1.0.0 (2024-08-22)
- 🎉 초기 릴리스

---

> 📝 v2.0.0 | UI 독립적 아키텍처 | Zustand 기반 상태 관리