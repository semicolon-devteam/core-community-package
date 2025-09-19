# @team-semicolon/community-core

<div align="center">

[![npm version](https://img.shields.io/npm/v/@team-semicolon/community-core.svg)](https://www.npmjs.com/package/@team-semicolon/community-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

Next.js 커뮤니티 플랫폼을 위한 공통 기능 패키지

> **Version 2.0.0** | 훅, 유틸리티, 서비스 레이어 중심 설계

</div>

## 🎯 개요

`@team-semicolon/community-core`는 Next.js 기반 커뮤니티 플랫폼에서 재사용 가능한 핵심 기능을 제공하는 패키지입니다.

- ✅ **UI 독립적**: UI 컴포넌트는 Next.js 앱에서 직접 구현
- ✅ **백엔드 통합**: Supabase + Spring 백엔드와 완벽한 통합
- ✅ **타입 안전성**: 완전한 TypeScript 지원
- ✅ **경량화**: Zustand 기반 상태 관리로 번들 크기 최소화

## ✨ 주요 기능

### 🪝 React Hooks
```typescript
// 인증 & 권한
import { useAuth, usePermission } from '@team-semicolon/community-core';

// 데이터 페칭 (React Query)
import { useUser, usePosts, useComments } from '@team-semicolon/community-core';

// 실시간 기능
import { useRealtimeChat, useRealtimePresence } from '@team-semicolon/community-core';

// 유틸리티 훅
import { useDebounce, useLocalStorage, usePrevious } from '@team-semicolon/community-core';
```

### 🔧 서비스 레이어
```typescript
// 확장 가능한 API 서비스
import { BaseService, AuthService, ChatService } from '@team-semicolon/community-core';

// Supabase 클라이언트 팩토리
import { createSupabaseClient } from '@team-semicolon/community-core';
```

### 🛠️ 유틸리티
```typescript
// 포맷터
import { formatDate, formatNumber, formatCurrency } from '@team-semicolon/community-core';

// 검증
import { validateEmail, validatePassword, validateUsername } from '@team-semicolon/community-core';

// 헬퍼
import { debounce, throttle, retry } from '@team-semicolon/community-core';
```

### 🗄️ 상태 관리 (Zustand)
```typescript
// 전역 상태 스토어
import { useAuthStore, useUIStore } from '@team-semicolon/community-core';
```

## 📦 설치

```bash
npm install @team-semicolon/community-core
# or
yarn add @team-semicolon/community-core
# or
pnpm add @team-semicolon/community-core
```

### Peer Dependencies
```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0",
  "next": ">=13.0.0"
}
```

## 🚀 빠른 시작

### 1. Provider 설정
```tsx
// app/layout.tsx 또는 _app.tsx
import { CommunityProvider } from '@team-semicolon/community-core';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CommunityProvider
          supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL}
          supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}
          apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
        >
          {children}
        </CommunityProvider>
      </body>
    </html>
  );
}
```

### 2. 인증 훅 사용
```tsx
import { useAuth } from '@team-semicolon/community-core';

function LoginButton() {
  const { user, signIn, signOut, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return user ? (
    <button onClick={() => signOut()}>
      {user.email} - 로그아웃
    </button>
  ) : (
    <button onClick={() => signIn({ email, password })}>
      로그인
    </button>
  );
}
```

### 3. 데이터 페칭
```tsx
import { usePosts } from '@team-semicolon/community-core';

function PostList() {
  const { data, isLoading, error, refetch } = usePosts({
    page: 1,
    limit: 10,
    category: 'notice'
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  );
}
```

### 4. 실시간 채팅
```tsx
import { useRealtimeChat } from '@team-semicolon/community-core';

function ChatRoom({ roomId }) {
  const {
    messages,
    sendMessage,
    isConnected,
    typingUsers
  } = useRealtimeChat(roomId);

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>
          <strong>{msg.user}:</strong> {msg.text}
        </div>
      ))}

      {typingUsers.length > 0 && (
        <div>{typingUsers.join(', ')}님이 입력 중...</div>
      )}

      <input
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            sendMessage(e.target.value);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}
```

## 🏗️ 아키텍처

```
@team-semicolon/community-core/
├── 🪝 hooks/              # React Hooks
│   ├── auth/             # 인증 관련
│   ├── queries/          # 데이터 페칭 (React Query)
│   ├── realtime/         # 실시간 기능 (Supabase Realtime)
│   └── utils/            # 유틸리티 훅
├── 🔧 services/           # API 서비스 레이어
│   ├── base/             # BaseService (axios interceptors)
│   ├── auth/             # 인증 서비스
│   ├── api/              # REST API 서비스
│   └── realtime/         # 실시간 서비스
├── 🗄️ stores/            # Zustand 상태 관리
│   ├── auth/             # 인증 상태
│   └── ui/               # UI 상태
├── 🛠️ utils/             # 유틸리티 함수
│   ├── formatters/       # 포맷팅 함수
│   ├── validators/       # 검증 함수
│   └── helpers/          # 헬퍼 함수
├── 📝 types/              # TypeScript 타입 정의
└── 🔌 providers/          # React Context Providers
```

## 📊 성능 최적화

### 번들 크기
- Redux Toolkit 제거로 ~32KB 절감
- Zustand 채택으로 ~8KB만 사용
- Tree-shaking 완벽 지원

### React 18 최적화
- Suspense 지원
- Concurrent Features 활용
- Automatic Batching 지원

## 🔐 보안

- Supabase RLS (Row Level Security) 활용
- JWT 토큰 자동 갱신
- XSS/CSRF 보호
- 환경 변수 기반 설정

## 📚 문서

- [아키텍처 가이드](./docs/ARCHITECTURE.md)
- [API 레퍼런스](./docs/API_REFERENCE.md)
- [사용 예제](./docs/USAGE_EXAMPLES.md)
- [마이그레이션 가이드](./docs/MIGRATION.md)

## 🤝 기여

기여를 환영합니다! [기여 가이드](./CONTRIBUTING.md)를 참고해주세요.

## 📄 라이선스

MIT License - [LICENSE](./LICENSE) 파일을 참고하세요.

## 🆕 v2.0.0 주요 변경사항

### Breaking Changes
- 🚨 모든 UI 컴포넌트 제거 (Next.js 앱으로 이동)
- 🚨 Redux Toolkit → Zustand 마이그레이션
- 🚨 패키지 구조 전면 개편

### New Features
- ✨ Supabase Realtime 통합
- ✨ 확장 가능한 서비스 레이어
- ✨ React 18 Suspense 지원
- ✨ 자동 에러 바운더리

### Improvements
- ⚡ 번들 크기 75% 감소
- ⚡ 초기 로딩 속도 2배 향상
- ⚡ TypeScript 타입 추론 개선

자세한 내용은 [CHANGELOG](./docs/CHANGELOG.md)를 참고하세요.

---

Made with ❤️ by Team Semicolon