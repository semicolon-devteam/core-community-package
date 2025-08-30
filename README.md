# @team-semicolon/community-core

<div align="center">

[![npm version](https://img.shields.io/npm/v/@team-semicolon/community-core.svg)](https://www.npmjs.com/package/@team-semicolon/community-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Storybook](https://img.shields.io/badge/Storybook-Available-ff4785.svg)](https://semicolon-community-core.vercel.app)

세미콜론 커뮤니티 플랫폼을 위한 재사용 가능한 React 컴포넌트 라이브러리

> **Version 1.8.1** | 완전한 커뮤니티 기능 구현

</div>

## 🚀 특징

- **🏗️ 모듈화된 아키텍처**: Atomic Design 기반의 컴포넌트 시스템
- **⚡ Tree Shaking 지원**: 사용하는 기능만 번들에 포함
- **🔒 완전한 TypeScript 지원**: 타입 안전성과 개발자 경험 극대화
- **🌐 Framework Agnostic**: Next.js 의존성 최소화로 범용 사용 가능
- **📱 반응형 디자인**: 모바일 퍼스트 디자인 지원
- **♿ 접근성**: WCAG 2.1 AA 준수

## 📦 설치

```bash
npm install @semicolon/community-core
```

또는 yarn을 사용하는 경우:

```bash
yarn add @semicolon/community-core
```

## 🎯 빠른 시작

### 기본 사용법

```typescript
// 컴포넌트 import
import { Button, Input, Skeleton } from '@team-semicolon/community-core';

// 훅 import
import { useAuth, useGlobalLoader } from '@team-semicolon/community-core';

// 서비스 import
import { UserService, PostService } from '@team-semicolon/community-core';

// 유틸리티 import
import { formatNumberWithComma, timeAgo } from '@team-semicolon/community-core';
```

### 카테고리별 Import (Tree Shaking 최적화)

```typescript
import { Button, Skeleton } from '@team-semicolon/community-core/components';
import { useAuth } from '@team-semicolon/community-core/hooks';
import { UserService } from '@team-semicolon/community-core/services';
```

### 컴포넌트 사용 예시

```tsx
function MyComponent() {
  const { user, isLoggedIn, loginWithLoader } = useAuth();
  
  return (
    <div>
      {isLoggedIn ? (
        <Button variant="primary" size="lg">
          환영합니다, {user.name}!
        </Button>
      ) : (
        <Button onClick={loginWithLoader} loading>
          로그인
        </Button>
      )}
    </div>
  );
}
```

## 📚 주요 기능

### 🧩 컴포넌트
- **Button** - 5가지 variant, 4가지 size, 로딩 상태
- **Input** - 라벨, 에러, 아이콘 지원
- **Badge** - 상태 표시, dot 인디케이터
- **Avatar** - 온라인 상태, 폴백 이미지
- **Skeleton** - 로딩 플레이스홀더

### 🪝 React Hooks
- **useAuth** - 인증 상태 관리
- **useGlobalLoader** - 전역 로딩 상태
- **usePermission** - 권한 체크
- **usePostQuery** - 게시글 데이터 페칭
- **useUserQuery** - 사용자 데이터 페칭

### 🔧 서비스 레이어
- **UserService** - 사용자 관련 API
- **PostService** - 게시글 관련 API
- **BoardService** - 게시판 관련 API
- **AuthService** - 인증/인가 처리

### 🛠️ 유틸리티
- **formatNumberWithComma** - 숫자 포맷팅
- **formatDate** - 날짜 포맷팅
- **timeAgo** - 상대 시간 표시
- **isAdmin** - 관리자 권한 체크

## 🏗️ 아키텍처

```
@team-semicolon/community-core/
├── lib/                # 소스 코드
│   ├── components/     # UI 컴포넌트 (Atomic Design)
│   ├── hooks/          # React Hooks
│   ├── services/       # API 서비스
│   ├── utils/          # 유틸리티 함수
│   ├── types/          # TypeScript 타입
│   └── constants/      # 상수 정의
├── dist/               # 빌드 출력
├── storybook/          # Storybook 문서
└── docs/               # 프로젝트 문서
```

## 🔧 개발 환경 설정

### Next.js 프로젝트에서 사용

```javascript
// next.config.js
module.exports = {
  transpilePackages: ['@semicolon/community-core'],
  // ... 기타 설정
};
```

### TailwindCSS 설정

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@semicolon/community-core/**/*.{js,ts,jsx,tsx}',
  ],
  // ... 기타 설정
};
```



## 🛠️ 개발

```bash
# 개발 서버 실행
npm run dev

# Storybook 실행
npm run storybook

# 테스트 실행
npm test

# 빌드
npm run build
```

## 🤝 기여하기

기여를 환영합니다! [Contributing Guide](./CONTRIBUTING.md)를 읽고 개발 프로세스를 확인해주세요.

### 기여 방법
1. 이슈 생성 또는 기존 이슈 확인
2. Fork & Clone
3. 브랜치 생성 (`feature/your-feature`)
4. 변경사항 커밋
5. Pull Request 생성

## 📋 요구사항

- React 18.0.0+ 또는 19.0.0+
- TypeScript 5.0.0+
- Node.js 18.0.0+

## 📖 문서

- [📚 API Reference](./docs/API_REFERENCE.md) - 전체 API 문서
- [💡 사용 예제](./docs/USAGE_EXAMPLES.md) - 실제 사용 예시
- [🏗️ 아키텍처](./docs/ARCHITECTURE.md) - 패키지 구조 및 설계
- [🚀 개발 가이드](./docs/DEVELOPMENT.md) - 개발 환경 설정
- [🔄 마이그레이션](./docs/MIGRATION.md) - 버전 업그레이드 가이드
- [🎨 Storybook](https://semicolon-community-core.vercel.app) - 컴포넌트 플레이그라운드

## 📝 라이선스

MIT © Semicolon Dev Team

## 🔗 링크

- [NPM 패키지](https://www.npmjs.com/package/@team-semicolon/community-core)
- [GitHub 레포지토리](https://github.com/semicolon-devteam/community-core)
- [Storybook](https://semicolon-community-core.vercel.app)
- [이슈 트래커](https://github.com/semicolon-devteam/community-core/issues)