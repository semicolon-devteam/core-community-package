# @semicolon/community-core

[![npm version](https://img.shields.io/npm/v/@semicolon/community-core.svg)](https://www.npmjs.com/package/@semicolon/community-core)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-green.svg)]()

세미콜론 커뮤니티 플랫폼을 위한 **종합 React 패키지**입니다. 현대적인 UI 컴포넌트, 유틸리티 함수, 타입 정의, 설정 도구를 제공합니다.

> **Version 1.0.0** | **Phase 1 완료** - 기본 유틸리티와 핵심 컴포넌트 구현

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
import { formatNumberWithComma } from '@semicolon/community-core';

const formatted = formatNumberWithComma(1234567);
console.log(formatted); // "1,234,567"
```

### 패키지 초기화 (권장)

```typescript
import { initializeCommunityCore } from '@semicolon/community-core';

// 앱 시작 시 한 번 호출
initializeCommunityCore({
  apiUrl: process.env.REACT_APP_API_URL,
  supabaseUrl: process.env.REACT_APP_SUPABASE_URL,
  supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
});
```

### 개별 모듈 import

```typescript
// 전체 import
import { Button, useAuth, BaseService } from '@semicolon/community-core';

// 카테고리별 import (번들 크기 최적화)
import { Button } from '@semicolon/community-core/components';
import { useAuth } from '@semicolon/community-core/hooks';
import { BaseService } from '@semicolon/community-core/services';
```

## 📚 현재 구현된 기능 (Phase 1)

### ✅ Core Utilities
필수 유틸리티 함수들

```typescript
import { 
  formatNumberWithComma,  // 숫자에 천 단위 쉼표 추가
  formatDate,            // 날짜를 한국어 형식으로 포맷팅  
  timeAgo,              // 상대적 시간 표시 ("2시간 전")
  isAdmin               // 사용자 관리자 권한 체크
} from '@semicolon/community-core';
```

### ✅ Essential Components  
Atomic Design 기반 핵심 컴포넌트

```typescript
import { 
  Button,    // 완전한 기능의 버튼 (5가지 variant, 로딩 상태, 아이콘)
  Badge,     // 상태/레벨/태그 표시 뱃지
  Avatar     // 사용자 프로필 이미지 (폴백, 상태 표시)
} from '@semicolon/community-core';
```

### ✅ Core Types
TypeScript 타입 정의

```typescript
import type { 
  User,             // 사용자 정보 인터페이스
  CommonResponse,   // API 응답 표준 형식
  ButtonProps,      // Button 컴포넌트 Props
  BadgeProps,       // Badge 컴포넌트 Props  
  AvatarProps       // Avatar 컴포넌트 Props
} from '@semicolon/community-core';
```

### ✅ Configuration System
패키지 설정 및 초기화

```typescript
import { 
  initializeCommunityCore,  // 패키지 전역 설정
  getPackageConfig         // 현재 설정 조회
} from '@semicolon/community-core';
```

## 🏗️ 아키텍처

```
@semicolon/community-core/
├── components/          # UI 컴포넌트
│   ├── atoms/          # 기본 UI 요소
│   ├── molecules/      # 조합된 UI 컴포넌트
│   └── organisms/      # 복합 비즈니스 컴포넌트
├── hooks/              # React 훅
│   ├── common/         # 범용 훅
│   ├── queries/        # 데이터 페칭
│   └── commands/       # 데이터 변경
├── services/           # API 서비스
├── utils/             # 유틸리티 함수
├── types/             # TypeScript 타입
└── config/            # 설정 관리
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

### 스타일 import

```typescript
// _app.tsx 또는 layout.tsx
import '@semicolon/community-core/styles';
```

## 📊 번들 크기 최적화

이 패키지는 Tree Shaking을 지원하여 사용하는 모듈만 번들에 포함됩니다.

```typescript
// ✅ 최적화된 import (권장)
import { formatNumberWithComma } from '@semicolon/community-core/utils';

// ❌ 전체 패키지 import (비권장)
import * as CommunityCore from '@semicolon/community-core';
```

## 🧪 개발 모드

패키지 개발 시 watch 모드를 사용할 수 있습니다:

```bash
npm run dev  # Rollup watch 모드
```

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

자세한 기여 가이드라인은 [CONTRIBUTING.md](.docs/CONTRIBUTING.md)를 참조하세요.

## 📋 요구사항

- React 18.0.0+ 또는 19.0.0+
- TypeScript 5.0.0+
- Node.js 18.0.0+

## 📖 문서

- **[API Reference](./API_REFERENCE.md)** - 완전한 API 문서 및 사용 가이드
- **[Usage Examples](./USAGE_EXAMPLES.md)** - 실제 사용 예제 및 통합 시나리오
- **[Changelog](./CHANGELOG.md)** - 버전별 변경사항 및 릴리스 노트
- **[개발 가이드](./CLAUDE.md)** - 개발자를 위한 상세 가이드라인

### 추가 문서
- [구현 전략](.docs/IMPLEMENTATION_STRATEGY.md)
- [패키징 가이드](.docs/PACKAGING_GUIDE.md)

## 🐛 이슈 리포트

버그를 발견했거나 기능 요청이 있으시면 [GitHub Issues](https://github.com/semicolon-devteam/community-core/issues)를 통해 알려주세요.

## 📄 라이센스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 확인하세요.

---

Made with ❤️ by Semicolon Community