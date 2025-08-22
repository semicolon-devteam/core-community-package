# @semicolon/community-core API Reference

## 📋 Overview

`@semicolon/community-core`는 커뮤니티 플랫폼 개발을 위한 종합 패키지입니다. React 컴포넌트, 유틸리티 함수, 타입 정의, 설정 도구를 제공합니다.

**Version**: 1.0.0  
**License**: MIT  
**TypeScript**: Full Support  

## 🚀 Quick Start

### Installation

```bash
npm install @semicolon/community-core
```

### Basic Setup

```typescript
import { initializeCommunityCore } from '@semicolon/community-core';

// 앱 시작 시 초기화 (권장)
initializeCommunityCore({
  apiUrl: process.env.REACT_APP_API_URL,
  supabase: {
    url: process.env.REACT_APP_SUPABASE_URL,
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
  },
  locale: 'ko-KR',
  development: process.env.NODE_ENV === 'development'
});
```

## 📦 Main Exports

### Essential Utilities

```typescript
import { 
  formatNumberWithComma,
  formatDate,
  timeAgo,
  isAdmin 
} from '@semicolon/community-core';
```

### Core Components

```typescript
import { 
  Button,
  Badge,
  Avatar 
} from '@semicolon/community-core';
```

### Types

```typescript
import type { 
  User,
  CommonResponse,
  ButtonProps,
  BadgeProps,
  AvatarProps 
} from '@semicolon/community-core';
```

## 🧩 Components API

### Button Component

완전한 기능을 갖춘 버튼 컴포넌트입니다.

#### Props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}
```

#### Examples

```typescript
// 기본 사용법
<Button>클릭하세요</Button>

// 스타일과 크기
<Button variant="primary" size="lg">저장</Button>

// 로딩 상태
<Button loading={isSubmitting} onClick={handleSubmit}>
  제출하기
</Button>

// 아이콘과 함께
<Button startIcon={<PlusIcon />} variant="secondary">
  새로 만들기
</Button>

// 전체 너비
<Button fullWidth variant="outline">
  전체 너비 버튼
</Button>
```

#### Accessibility

- ARIA 속성 자동 설정
- 키보드 네비게이션 지원
- Screen reader 호환
- Focus 상태 시각화

---

### Badge Component

상태, 레벨, 태그 표시용 뱃지 컴포넌트입니다.

#### Props

```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  dot?: boolean;
}
```

#### Examples

```typescript
// 사용자 레벨
<Badge variant="primary" rounded>Level 5</Badge>

// 상태 표시
<Badge variant="success" dot>온라인</Badge>

// 알림 개수
<Badge variant="danger" size="sm">3</Badge>

// 태그
<Badge variant="info">개발자</Badge>
```

---

### Avatar Component

사용자 프로필 이미지 표시 컴포넌트입니다.

#### Props

```typescript
interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  square?: boolean;
}
```

#### Examples

```typescript
// 기본 아바타
<Avatar src="/profile.jpg" name="김철수" />

// 크기와 상태
<Avatar 
  src="/profile.jpg" 
  name="김철수" 
  size="lg"
  status="online" 
/>

// 이미지 없을 때 이니셜 표시
<Avatar name="김철수" size="xl" />

// 정사각형 (브랜드 로고용)
<Avatar src="/logo.jpg" name="회사명" square />
```

#### Features

- 자동 이미지 최적화 (Supabase 통합)
- 이미지 로드 실패 시 이니셜 폴백
- 상태 표시 인디케이터
- 다양한 크기 지원

## 🛠️ Utilities API

### Number Formatting

#### `formatNumberWithComma(value)`

숫자에 천 단위 쉼표를 추가합니다.

```typescript
formatNumberWithComma(1234567); // "1,234,567"
formatNumberWithComma("98765");  // "98,765"
formatNumberWithComma(null);     // ""
```

**Parameters:**
- `value: number | string | null` - 포맷할 숫자

**Returns:** `string` - 포맷된 문자열

---

### Date Utilities

#### `formatDate(dateString, isSimple?)`

날짜를 한국어 형식으로 포맷팅합니다.

```typescript
formatDate("2024-01-15T10:30:00");        // "2024.01.15. 10:30:00"
formatDate("2024-01-15T10:30:00", true);  // "2024.01.15"
```

**Parameters:**
- `dateString: string` - ISO 날짜 문자열
- `isSimple?: boolean` - 시간 제외 여부

**Returns:** `string` - 포맷된 날짜 문자열

#### `timeAgo(dateString, isSimple?)`

상대적 시간을 반환합니다.

```typescript
timeAgo("2024-01-15T10:30:00"); // "2시간 전"
```

**Parameters:**
- `dateString: string` - ISO 날짜 문자열  
- `isSimple?: boolean` - 간단한 형식 여부

**Returns:** `string` - 상대적 시간 문자열

---

### Authentication Utilities

#### `isAdmin(user)`

사용자가 관리자인지 확인합니다.

```typescript
const user = { is_admin: true, level: 10 };
isAdmin(user); // true
```

**Parameters:**
- `user: any` - 사용자 객체

**Returns:** `boolean` - 관리자 여부

## 🔧 Configuration API

### `initializeCommunityCore(config)`

패키지를 초기화하고 전역 설정을 적용합니다.

```typescript
interface CommunityPackageConfig {
  apiUrl?: string;
  supabase?: {
    url?: string;
    anonKey?: string;
  };
  locale?: string;
  development?: boolean;
}

initializeCommunityCore({
  apiUrl: 'https://api.example.com',
  supabase: {
    url: 'https://project.supabase.co',
    anonKey: 'your-anon-key'
  },
  locale: 'ko-KR',
  development: true
});
```

### `getPackageConfig()`

현재 설정을 조회합니다.

```typescript
const config = getPackageConfig();
console.log(config.apiUrl); // 'https://api.example.com'
```

## 🎯 Advanced Usage

### Namespace Imports

카테고리별 import로 번들 크기를 최적화할 수 있습니다.

```typescript
import { Utils, Constants } from '@semicolon/community-core';

// 유틸리티 사용
const formatted = Utils.formatNumberWithComma(12345);
const isUserAdmin = Utils.AuthUtils.isAdmin(user);

// 상수 사용 (향후 추가)
const breakpoint = Constants.BREAKPOINTS?.md;
```

### Tree Shaking Optimization

```typescript
// ✅ 권장: 필요한 것만 import
import { Button, formatNumberWithComma } from '@semicolon/community-core';

// ✅ 좋음: 카테고리별 import
import { Button } from '@semicolon/community-core/components';
import { formatNumberWithComma } from '@semicolon/community-core/utils';

// ❌ 비권장: 전체 패키지 import
import * as CommunityCore from '@semicolon/community-core';
```

### Framework Integration

#### Next.js Setup

```javascript
// next.config.js
module.exports = {
  transpilePackages: ['@semicolon/community-core'],
  // ... other config
};
```

#### TypeScript Integration

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "types": ["@semicolon/community-core"]
  }
}
```

## 📏 Type Definitions

### Core Types

#### `User`

```typescript
interface User {
  id: string;
  name: string;
  email?: string;
  level?: number;
  is_admin?: boolean;
  profileImage?: string;
  // ... other properties
}
```

#### `CommonResponse<T>`

API 응답의 표준 형식입니다.

```typescript
interface CommonResponse<T> {
  successOrNot: string;
  statusCode: number;
  status?: number;
  message?: string;
  data: T | null;
}
```

## 🔄 Version History

### v1.0.0 (Current)

**새로운 기능:**
- ✨ Button, Badge, Avatar 컴포넌트 추가
- 🛠️ 핵심 유틸리티 함수 제공
- ⚙️ 패키지 초기화 시스템
- 📝 완전한 TypeScript 지원

**개선사항:**
- 🎨 접근성 준수 컴포넌트
- 📱 반응형 디자인 지원
- 🔧 Tree Shaking 최적화

## 🐛 Troubleshooting

### 공통 문제 해결

#### 1. TypeScript 경고

```typescript
// 문제: 타입을 찾을 수 없음
import { Button } from '@semicolon/community-core';

// 해결책: 패키지 재설치
npm install @semicolon/community-core
```

#### 2. 스타일이 적용되지 않음

```typescript
// 문제: CSS 클래스가 작동하지 않음

// 해결책: Tailwind CSS 설정 확인
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@semicolon/community-core/**/*.{js,ts,jsx,tsx}',
  ],
}
```

#### 3. 빌드 에러

```bash
# 문제: 빌드 시 모듈을 찾을 수 없음

# 해결책: Next.js 설정 추가
# next.config.js
module.exports = {
  transpilePackages: ['@semicolon/community-core'],
}
```

## 🔮 Roadmap

### Phase 2 (계획중)

- 🔤 Input, Select, Form 컴포넌트
- 🪝 React Query 통합 훅들
- 🌐 API 서비스 레이어

### Phase 3 (향후)

- 📊 DataTable, Calendar 고급 컴포넌트  
- 🎨 테마 시스템
- 🌍 다국어 지원
- 🧪 Storybook 통합

## 📞 Support

- **GitHub Issues**: [Report bugs and feature requests](https://github.com/semicolon-community/community-core/issues)
- **Documentation**: [Full documentation](https://semicolon-community.github.io/community-core)
- **Email**: support@semicolon-community.com

---

**Made with ❤️ by Semicolon Community**