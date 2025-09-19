# 🏗️ @team-semicolon/community-core 아키텍처 가이드

## 📋 목차
1. [개요](#개요)
2. [설계 원칙](#설계-원칙)
3. [패키지 구조](#패키지-구조)
4. [핵심 모듈](#핵심-모듈)
5. [버저닝 전략](#버저닝-전략)
6. [기술 스택](#기술-스택)

## 🎯 개요

`@team-semicolon/community-core`는 Next.js 기반 커뮤니티 플랫폼을 위한 공통 기능 패키지입니다.

### 핵심 목표
- **UI 독립성**: UI 컴포넌트는 Next.js 앱에서 구현, 로직만 패키지에서 제공
- **백엔드 통합**: Supabase + Spring 백엔드와의 완벽한 통합
- **재사용성**: 여러 커뮤니티 프로젝트에서 공통으로 사용 가능
- **확장성**: 쉽게 확장 가능한 인터페이스 제공

## 🔧 설계 원칙

### 1. Separation of Concerns
```
UI Layer (Next.js App)
    ↓
Logic Layer (This Package)
    ↓
Data Layer (Supabase + Spring)
```

### 2. Dependency Injection
```typescript
// 패키지에서 팩토리 패턴 제공
export function createSupabaseClient(config: SupabaseConfig) {
  // 표준화된 클라이언트 생성
  return createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    ...config.options
  });
}

// Next.js 앱에서 환경변수 주입
const supabase = createSupabaseClient({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
});
```

### 3. Composable Hooks
```typescript
// 기본 훅을 조합하여 복잡한 기능 구현
export function useAuthenticatedUser() {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { permissions } = usePermissions(user?.id);

  return {
    user,
    profile,
    permissions,
    isFullyLoaded: user && profile && permissions
  };
}
```

## 📁 패키지 구조

```
src/
├── 🪝 hooks/              # React Hooks
│   ├── auth/
│   │   ├── useAuth.ts           # 인증 훅
│   │   ├── usePermission.ts     # 권한 체크
│   │   └── useSession.ts        # 세션 관리
│   ├── queries/
│   │   ├── useUser.ts           # 사용자 데이터
│   │   ├── usePosts.ts          # 게시물 조회
│   │   └── useComments.ts       # 댓글 조회
│   ├── realtime/
│   │   ├── useRealtimeChat.ts   # 실시간 채팅
│   │   ├── usePresence.ts       # 온라인 상태
│   │   └── useChannelSubscription.ts
│   └── utils/
│       ├── useDebounce.ts       # 디바운스
│       ├── useLocalStorage.ts   # 로컬 스토리지
│       └── usePrevious.ts       # 이전 값 추적
│
├── 🔧 services/           # 서비스 레이어
│   ├── base/
│   │   ├── BaseService.ts       # 기본 HTTP 서비스
│   │   └── interceptors.ts      # Axios 인터셉터
│   ├── auth/
│   │   ├── AuthService.ts       # Supabase Auth
│   │   └── TokenManager.ts      # JWT 관리
│   ├── api/
│   │   ├── PostService.ts       # 게시물 API
│   │   ├── UserService.ts       # 사용자 API
│   │   └── CommentService.ts    # 댓글 API
│   └── realtime/
│       ├── RealtimeService.ts   # Supabase Realtime
│       └── ChatService.ts       # 채팅 서비스
│
├── 🗄️ stores/            # Zustand 상태 관리
│   ├── authStore.ts      # 인증 상태
│   ├── uiStore.ts        # UI 상태 (선택적)
│   └── createStore.ts    # 스토어 팩토리
│
├── 🛠️ utils/             # 유틸리티
│   ├── formatters/
│   │   ├── date.ts              # 날짜 포맷
│   │   ├── number.ts            # 숫자 포맷
│   │   └── currency.ts          # 통화 포맷
│   ├── validators/
│   │   ├── email.ts             # 이메일 검증
│   │   ├── password.ts          # 비밀번호 검증
│   │   └── username.ts          # 사용자명 검증
│   └── helpers/
│       ├── debounce.ts          # 디바운스
│       ├── throttle.ts          # 쓰로틀
│       └── retry.ts             # 재시도 로직
│
├── 📝 types/              # TypeScript 타입
│   ├── auth.ts           # 인증 관련 타입
│   ├── api.ts            # API 응답 타입
│   ├── database.ts       # DB 스키마 타입
│   └── index.ts          # 타입 재export
│
├── 🔌 providers/          # React Providers
│   ├── CommunityProvider.tsx    # 메인 Provider
│   ├── QueryProvider.tsx        # React Query
│   └── SupabaseProvider.tsx     # Supabase Context
│
└── 📦 index.ts            # 패키지 진입점
```

## 🧩 핵심 모듈

### 1. 인증 시스템

```typescript
// Supabase Auth 통합
export const useAuth = () => {
  const supabase = useSupabase();
  const setAuth = useAuthStore(state => state.setAuth);

  const signIn = async (credentials: SignInCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (data.user) {
      setAuth(data.user);
    }
    return { data, error };
  };

  // 자동 세션 갱신
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setAuth(session.user);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);
};
```

### 2. 데이터 페칭 (React Query)

```typescript
// 표준화된 쿼리 훅
export const usePosts = (params?: PostQueryParams) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => postService.getPosts(params),
    staleTime: 5 * 60 * 1000,    // 5분
    cacheTime: 10 * 60 * 1000,   // 10분
    suspense: true,               // React 18 Suspense
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};
```

### 3. 실시간 기능

```typescript
// Supabase Realtime + React Query 통합
export const useRealtimeChat = (roomId: string) => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  // 초기 메시지 로드
  const { data: messages } = useQuery({
    queryKey: ['messages', roomId],
    queryFn: () => chatService.getMessages(roomId)
  });

  // 실시간 구독
  useEffect(() => {
    const channel = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          // React Query 캐시 업데이트
          queryClient.setQueryData(
            ['messages', roomId],
            (old: Message[]) => [...old, payload.new as Message]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  return { messages, ... };
};
```

### 4. 상태 관리 (Zustand)

```typescript
// 경량 상태 관리
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setAuth: (user) => set({
    user,
    isAuthenticated: !!user
  }),
  clearAuth: () => set({
    user: null,
    isAuthenticated: false
  })
}));
```

### 5. 에러 처리 & Suspense

```typescript
// 표준화된 에러 바운더리
export const CommunityErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Error caught:', error, errorInfo);
        // Sentry 또는 로깅 서비스로 전송
      }}
      onReset={() => window.location.reload()}
    >
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};
```

## 📦 버저닝 전략

### Gitmoji 기반 Semantic Versioning

우리는 Gitmoji를 활용한 자동화된 버저닝 시스템을 사용합니다:

#### 버전 변경 규칙

| Gitmoji | 의미 | 버전 변경 | 예시 |
|---------|------|-----------|------|
| 💥 `:boom:` | Breaking Change | **MAJOR** (X.0.0) | `💥 상태관리를 Redux에서 Zustand로 변경` |
| ✨ `:sparkles:` | 새 기능 | **MINOR** (0.X.0) | `✨ 실시간 채팅 훅 추가` |
| 🚀 `:rocket:` | 배포/성능 개선 | **MINOR** (0.X.0) | `🚀 번들 크기 50% 감소` |
| 🐛 `:bug:` | 버그 수정 | **PATCH** (0.0.X) | `🐛 인증 토큰 만료 처리 수정` |
| 🔧 `:wrench:` | 설정 변경 | **PATCH** (0.0.X) | `🔧 ESLint 규칙 업데이트` |
| 📝 `:memo:` | 문서 | **PATCH** (0.0.X) | `📝 README 예제 코드 추가` |
| ♻️ `:recycle:` | 리팩토링 | **PATCH** (0.0.X) | `♻️ 중복 코드 제거` |
| 🎨 `:art:` | 코드 구조 개선 | **PATCH** (0.0.X) | `🎨 파일 구조 정리` |

#### 자동화 설정 (.github/workflows/release.yml)

```yaml
name: Semantic Release

on:
  push:
    branches:
      - main
      - next

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build package
        run: npm run build

      - name: Semantic Release with Gitmoji
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npx semantic-release
```

#### Semantic Release 설정 (.releaserc.json)

```json
{
  "branches": ["main", "next"],
  "plugins": [
    ["@semantic-release/commit-analyzer", {
      "preset": "angular",
      "releaseRules": [
        {"emoji": "💥", "release": "major"},
        {"emoji": "✨", "release": "minor"},
        {"emoji": "🚀", "release": "minor"},
        {"emoji": "🐛", "release": "patch"},
        {"emoji": "🔧", "release": "patch"},
        {"emoji": "📝", "release": "patch"},
        {"emoji": "♻️", "release": "patch"},
        {"emoji": "🎨", "release": "patch"}
      ]
    }],
    "@semantic-release/release-notes-generator",
    ["@semantic-release/changelog", {
      "changelogFile": "docs/CHANGELOG.md"
    }],
    "@semantic-release/npm",
    ["@semantic-release/github", {
      "assets": ["docs/CHANGELOG.md", "package.json"]
    }],
    "@semantic-release/git"
  ]
}
```

#### 커밋 메시지 예시

```bash
# Major 버전 (Breaking Change)
git commit -m "💥 Zustand로 상태관리 전면 교체"

# Minor 버전 (기능 추가)
git commit -m "✨ useRealtimeChat 훅 추가"
git commit -m "🚀 React 18 Suspense 지원"

# Patch 버전 (버그 수정, 개선)
git commit -m "🐛 토큰 갱신 로직 수정"
git commit -m "📝 API 문서 업데이트"
git commit -m "♻️ 중복 코드 제거"
```

## 🔨 기술 스택

### Core Dependencies
- **React**: ^18.0.0 - Hooks, Suspense, Concurrent Features
- **TypeScript**: ^5.0.0 - 타입 안전성
- **Zustand**: ^4.5.0 - 경량 상태 관리 (8KB)
- **@tanstack/react-query**: ^5.0.0 - 서버 상태 관리
- **@supabase/supabase-js**: ^2.0.0 - 백엔드 통합
- **axios**: ^1.0.0 - HTTP 클라이언트

### Dev Dependencies
- **Rollup**: 번들링
- **Vitest**: 테스팅
- **ESLint & Prettier**: 코드 품질

### 번들 크기 최적화
```
Before (with Redux Toolkit):
- @reduxjs/toolkit: ~40KB
- react-redux: ~8KB
- Total: ~48KB

After (with Zustand):
- zustand: ~8KB
- Total: ~8KB

절감: ~40KB (83% 감소)
```

## 🔄 마이그레이션 전략

### v1.x → v2.0 마이그레이션

#### 1. Redux → Zustand
```typescript
// Before (Redux)
import { useSelector, useDispatch } from 'react-redux';
const user = useSelector(state => state.auth.user);
const dispatch = useDispatch();
dispatch(setUser(userData));

// After (Zustand)
import { useAuthStore } from '@team-semicolon/community-core';
const { user, setAuth } = useAuthStore();
setAuth(userData);
```

#### 2. UI 컴포넌트 제거
```typescript
// Before
import { Button, Card, Modal } from '@team-semicolon/community-core';

// After
// UI 컴포넌트는 Next.js 앱에서 직접 구현
import { Button } from '@/components/ui/Button';
// 로직만 패키지에서 가져오기
import { useAuth } from '@team-semicolon/community-core';
```

#### 3. 서비스 레이어 변경
```typescript
// Before
import api from '@/services/api';

// After
import { BaseService, createSupabaseClient } from '@team-semicolon/community-core';

class CustomService extends BaseService {
  // 확장 구현
}
```

## 🚀 로드맵

### Phase 1 (v2.0 - Current)
- ✅ 아키텍처 재설계
- ✅ Zustand 마이그레이션
- ✅ Supabase 통합
- ✅ 기본 훅 구현

### Phase 2 (v2.1)
- 🔄 고급 실시간 기능
- 🔄 오프라인 지원
- 🔄 낙관적 업데이트

### Phase 3 (v2.2)
- 📋 React Native 지원
- 📋 웹소켓 직접 통합
- 📋 E2E 암호화 채팅

### Phase 4 (v3.0)
- 📋 마이크로프론트엔드 지원
- 📋 Module Federation
- 📋 다중 백엔드 지원

---

이 아키텍처는 지속적으로 발전하고 있으며, 커뮤니티 피드백을 적극 반영합니다.