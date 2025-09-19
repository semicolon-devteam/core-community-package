# 🔄 마이그레이션 가이드

## 📋 목차
- [v1.x에서 v2.0으로](#v1x에서-v20으로)
- [Breaking Changes](#breaking-changes)
- [마이그레이션 단계](#마이그레이션-단계)
- [코드 예시](#코드-예시)
- [문제 해결](#문제-해결)

## v1.x에서 v2.0으로

### 🚨 Breaking Changes

#### 1. UI 컴포넌트 완전 제거

**이전 (v1.x)**:
```typescript
import { Button, Badge, Avatar } from '@team-semicolon/community-core';
import { Tooltip, AnimatedPoint } from '@team-semicolon/community-core/components';

// UI 컴포넌트 사용
<Button variant="primary" onClick={handleClick}>
  클릭하세요
</Button>
```

**현재 (v2.0)**:
```typescript
// ❌ UI 컴포넌트는 더 이상 제공하지 않습니다
// ✅ Next.js 앱에서 직접 구현하거나 다른 UI 라이브러리 사용

// shadcn/ui, MUI, Ant Design 등 사용
import { Button } from '@/components/ui/button'; // 직접 구현
```

#### 2. Redux에서 Zustand로 전환

**이전 (v1.x - Redux)**:
```typescript
import { Provider } from 'react-redux';
import { store } from '@team-semicolon/community-core/redux';
import { useAppSelector, useAppDispatch } from '@team-semicolon/community-core';

// Redux 스토어 설정
<Provider store={store}>
  <App />
</Provider>

// Redux 사용
const user = useAppSelector(state => state.auth.user);
const dispatch = useAppDispatch();
dispatch(loginAsync(credentials));
```

**현재 (v2.0 - Zustand)**:
```typescript
import { CommunityProvider } from '@team-semicolon/community-core';
import { useAuthStore } from '@team-semicolon/community-core';

// Provider 설정
<CommunityProvider
  supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL}
  supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}
>
  <App />
</CommunityProvider>

// Zustand 사용
const { user, login, logout } = useAuthStore();
await login(credentials); // 비동기 액션도 직접 호출
```

#### 3. Import 경로 변경

**이전 (v1.x)**:
```typescript
// 내부 경로 직접 참조
import { formatNumberWithComma } from '@team-semicolon/community-core/dist/utils';
import { useAuth } from '@team-semicolon/community-core/dist/hooks/auth';
import UserService from '@team-semicolon/community-core/dist/services/UserService';
```

**현재 (v2.0)**:
```typescript
// 깔끔한 import 경로
import {
  formatNumberWithComma,
  useAuth,
  UserService
} from '@team-semicolon/community-core';

// 또는 카테고리별 import
import { useAuth } from '@team-semicolon/community-core/hooks';
import { UserService } from '@team-semicolon/community-core/services';
import { formatNumberWithComma } from '@team-semicolon/community-core/utils';
```

#### 4. 서비스 클래스 초기화

**이전 (v1.x)**:
```typescript
// 싱글톤 인스턴스 직접 사용
import { userService } from '@team-semicolon/community-core';
const userData = await userService.getUser();
```

**현재 (v2.0)**:
```typescript
// 서비스 인스턴스 생성 (의존성 주입 가능)
import { UserService } from '@team-semicolon/community-core';

const userService = new UserService({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000
});

const userData = await userService.getUser();
```

### 📦 마이그레이션 단계

#### 1단계: 패키지 업데이트

```bash
# 기존 패키지 제거
npm uninstall @team-semicolon/community-core @reduxjs/toolkit react-redux

# v2.0 설치
npm install @team-semicolon/community-core@^2.0.0 zustand@^4.5.0
```

#### 2단계: Provider 교체

**app/layout.tsx** 또는 **pages/_app.tsx**:

```typescript
// 이전
import { Provider } from 'react-redux';
import { store } from '@team-semicolon/community-core/redux';

export default function RootLayout({ children }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

// 현재
import { CommunityProvider } from '@team-semicolon/community-core';

export default function RootLayout({ children }) {
  return (
    <CommunityProvider
      supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
      supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
      apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
    >
      {children}
    </CommunityProvider>
  );
}
```

#### 3단계: 상태 관리 코드 마이그레이션

```typescript
// Redux 코드 제거
- const user = useAppSelector(selectUser);
- const dispatch = useAppDispatch();
- dispatch(setUser(userData));

// Zustand로 교체
+ const { user, setUser } = useAuthStore();
+ setUser(userData);
```

#### 4단계: UI 컴포넌트 교체

```typescript
// 1. shadcn/ui 설치 (권장)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button badge avatar

// 2. 컴포넌트 import 변경
- import { Button } from '@team-semicolon/community-core';
+ import { Button } from '@/components/ui/button';

// 3. Props 매핑 (필요시)
- <Button variant="primary" loading={isLoading}>
+ <Button variant="default" disabled={isLoading}>
+   {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
```

#### 5단계: 서비스 레이어 업데이트

```typescript
// services/api.ts
import {
  BaseService,
  UserService,
  PostService,
  ChatService
} from '@team-semicolon/community-core';

// 서비스 인스턴스 생성 및 export
export const baseService = new BaseService({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

export const userService = new UserService();
export const postService = new PostService();
export const chatService = new ChatService();
```

### 💡 코드 예시

#### 인증 플로우 마이그레이션

**이전 (v1.x)**:
```typescript
import { useAuth } from '@team-semicolon/community-core';
import { useAppDispatch } from '@team-semicolon/community-core';
import { loginAsync } from '@team-semicolon/community-core/redux';

function LoginForm() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    await dispatch(loginAsync({ email, password }));
  };

  return (
    // UI 구현
  );
}
```

**현재 (v2.0)**:
```typescript
import { useAuth } from '@team-semicolon/community-core';

function LoginForm() {
  const { user, signIn, isLoading } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await signIn({ email, password });
      // 성공 처리
    } catch (error) {
      // 에러 처리
    }
  };

  return (
    // UI 구현
  );
}
```

#### 데이터 페칭 마이그레이션

**이전 (v1.x)**:
```typescript
import { useEffect, useState } from 'react';
import { postService } from '@team-semicolon/community-core';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postService.getPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  // ...
}
```

**현재 (v2.0)**:
```typescript
import { usePosts } from '@team-semicolon/community-core';

function PostList() {
  const { data: posts, isLoading, error } = usePosts({
    page: 1,
    limit: 10
  });

  if (isLoading) return null; // 글로벌 로더가 표시됨
  if (error) return <div>Error: {error.message}</div>;
  // ...
}
```

### 🔧 문제 해결

#### TypeScript 에러

```typescript
// tsconfig.json에 경로 매핑 추가
{
  "compilerOptions": {
    "paths": {
      "@team-semicolon/community-core": [
        "node_modules/@team-semicolon/community-core/dist"
      ]
    }
  }
}
```

#### 번들 크기 최적화

```typescript
// 필요한 것만 import (Tree Shaking)
import { useAuth } from '@team-semicolon/community-core/hooks';
// 전체 패키지 import 피하기
// import * as CommunityCore from '@team-semicolon/community-core';
```

#### Supabase 연결 문제

```typescript
// 환경 변수 확인
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Provider에서 직접 클라이언트 전달
import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

<CommunityProvider supabaseClient={supabaseClient}>
  {children}
</CommunityProvider>
```

### 📚 추가 리소스

- [v2.0 API 문서](./API_REFERENCE.md)
- [사용 예제](./USAGE_EXAMPLES.md)
- [아키텍처 가이드](./ARCHITECTURE.md)
- [GitHub Discussions](https://github.com/team-semicolon/community-core/discussions)

### ⏰ 지원 일정

- **v1.x 지원 종료**: 2025년 12월 31일
- **보안 패치만**: 2025년 7월 1일부터
- **v2.0 LTS**: 2027년 12월 31일까지

### 🆘 도움이 필요하신가요?

마이그레이션 중 문제가 발생하면:

1. [GitHub Issues](https://github.com/team-semicolon/community-core/issues)에 `migration` 태그로 이슈 생성
2. 팀 Slack 채널: #community-core-migration
3. 이메일: support@team-semicolon.com

---

> 💡 **팁**: 대규모 프로젝트의 경우 점진적 마이그레이션을 권장합니다. 새로운 기능부터 v2.0을 적용하고, 기존 코드는 천천히 마이그레이션하세요.