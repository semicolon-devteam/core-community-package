# 📚 Framework Isolation Guide
**Storybook과 패키지에서 Next.js 의존성 문제 완전 해결 가이드**

## 🎯 문제 상황

**Storybook 에러**: `Failed to resolve module specifier "next/navigation"`
- Storybook은 Next.js 환경 밖에서 실행됨
- Next.js 전용 훅과 모듈은 브라우저 환경에서 직접 사용 불가
- 패키지 사용자가 Next.js를 사용하지 않을 수도 있음

## 🚨 금지 사항 (절대 사용 금지)

### ❌ Next.js 전용 모듈들
```typescript
// 🚫 절대 사용 금지
import { useRouter } from 'next/router';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { redirect, notFound } from 'next/navigation';
```

### ❌ Next.js 전용 API들
```typescript
// 🚫 절대 사용 금지
import { NextRequest, NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';
```

### ❌ Next.js 환경 가정
```typescript
// 🚫 Next.js 환경을 가정한 코드
if (typeof window !== 'undefined') {
  // Next.js에서만 동작하는 코드
}

// 🚫 Next.js 라우터에 의존하는 로직
const router = useRouter();
const handleClick = () => router.push('/path');
```

## ✅ 허용되는 패턴

### ✅ Props 기반 접근법
```typescript
// ✅ 올바른 방식 - Props로 받기
interface ComponentProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
  searchParams?: URLSearchParams;
}

export function Component({ onNavigate, currentPath }: ComponentProps) {
  const handleClick = () => {
    onNavigate?.('/new-path'); // 사용자가 구현한 네비게이션 함수 호출
  };
  
  return <button onClick={handleClick}>Navigate</button>;
}
```

### ✅ 콜백 패턴
```typescript
// ✅ 올바른 방식 - 콜백으로 처리
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void; // 외부에서 페이지 변경 처리
}

export function Pagination({ onPageChange }: PaginationProps) {
  return (
    <button onClick={() => onPageChange(2)}>
      Go to Page 2
    </button>
  );
}
```

### ✅ 순수 함수 유틸리티
```typescript
// ✅ 올바른 방식 - 순수 함수
export function createPageUrl(pathname: string, searchParams: URLSearchParams, page: number): string {
  const params = new URLSearchParams(searchParams);
  params.set('page', page.toString());
  return `${pathname}?${params.toString()}`;
}

// 사용자가 직접 호출
const newUrl = createPageUrl(pathname, searchParams, 3);
```

### ✅ 조건부 Import (고급)
```typescript
// ✅ 고급 패턴 - 조건부 Next.js 기능 사용
import { useRouter } from 'next/router';
import type { ComponentProps } from './types';

// Next.js 환경 감지
const isNextJS = typeof useRouter !== 'undefined';

export function Component(props: ComponentProps) {
  if (isNextJS) {
    // Next.js 환경에서만 실행되는 로직
    const router = useRouter();
    // ...
  } else {
    // 일반 React 환경에서의 폴백 로직
    // ...
  }
}
```

## 🛠️ 마이그레이션 전략

### 1. Next.js 의존성 제거 체크리스트

**🔍 검색으로 의존성 찾기**:
```bash
# 프로젝트에서 Next.js import 찾기
find lib -name "*.tsx" -o -name "*.ts" | xargs grep -l "from ['\"]next/"

# 특정 모듈 사용처 찾기  
grep -r "usePathname\|useSearchParams\|useRouter" lib/components/
```

**📝 각 파일별 수정 과정**:
1. Next.js 훅 → Props로 변경
2. Next.js 컴포넌트 → 일반 HTML 요소로 변경
3. 라우터 로직 → 콜백 함수로 위임
4. 테스트 및 검증

### 2. 컴포넌트별 마이그레이션 패턴

#### Navigation/Routing 관련
```typescript
// ❌ Before
import { useRouter, usePathname } from 'next/navigation';

function Component() {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleClick = () => router.push('/path');
  
  return <button onClick={handleClick}>Navigate</button>;
}

// ✅ After  
interface ComponentProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

function Component({ onNavigate, currentPath }: ComponentProps) {
  const handleClick = () => {
    onNavigate?.('/path');
  };
  
  return <button onClick={handleClick}>Navigate</button>;
}
```

#### URL Parameter 관리
```typescript
// ❌ Before
import { useSearchParams } from 'next/navigation';

function Pagination() {
  const searchParams = useSearchParams();
  
  const createUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `?${params.toString()}`;
  };
}

// ✅ After
interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  // URL 생성은 부모 컴포넌트에서 처리
}

function Pagination({ currentPage, onPageChange }: PaginationProps) {
  return (
    <button onClick={() => onPageChange(currentPage + 1)}>
      Next Page
    </button>
  );
}
```

### 3. Storybook 설정 최적화

**`.storybook/main.ts`에서 Next.js 모듈 외부화**:
```typescript
export default {
  // ...
  viteFinal: async (config) => {
    return mergeConfig(config, {
      build: {
        rollupOptions: {
          external: [
            'next/navigation',
            'next/router',
            'next/link',
            'next/image',
            'next/head',
          ],
        },
      },
    });
  },
};
```

**Vercel 배포 설정 (`vercel.json`)**:
```json
{
  "buildCommand": "npm run build-storybook",
  "outputDirectory": "storybook-static",
  "framework": null,
  "headers": [
    {
      "source": "/stories.json",
      "headers": [{"key": "Cache-Control", "value": "public, max-age=0, must-revalidate"}]
    },
    {
      "source": "/index.json", 
      "headers": [{"key": "Cache-Control", "value": "public, max-age=0, must-revalidate"}]
    }
  ]
}
```

## 🧪 테스트 가이드

### 1. 로컬 테스트
```bash
# Storybook 로컬 실행
npm run storybook

# 빌드 테스트  
npm run build-storybook

# 정적 파일 서빙 테스트
cd storybook-static && python3 -m http.server 8080
```

### 2. Next.js 의존성 검증
```bash
# 의존성 완전 제거 확인
grep -r "from ['\"]next/" lib/components/ || echo "✅ No Next.js dependencies found"

# import 구문 검증
grep -r "import.*next/" lib/components/ || echo "✅ No Next.js imports found"
```

### 3. 배포 전 체크리스트
- [ ] 로컬 Storybook에서 모든 컴포넌트 정상 로드
- [ ] 브라우저 콘솔에서 "Failed to resolve module specifier" 에러 없음
- [ ] Next.js 관련 import 구문 완전 제거
- [ ] Props 기반 API로 올바르게 변경
- [ ] 캐시 무효화를 위한 vercel.json 설정

## 📋 지속적인 관리

### 1. 개발 워크플로우에 통합
```bash
# pre-commit hook으로 자동 검증
#!/bin/sh
if grep -r "from ['\"]next/" lib/components/; then
  echo "❌ Next.js dependencies found in components!"
  echo "Please use props-based approach instead."
  exit 1
fi
```

### 2. 정기적인 검증
```bash
# 매주 실행하는 검증 스크립트
echo "🔍 Checking for Next.js dependencies..."
find lib -name "*.tsx" -o -name "*.ts" | xargs grep -l "from ['\"]next/" && echo "❌ Found dependencies" || echo "✅ Clean!"
```

### 3. 문서 업데이트
- 새 컴포넌트 추가 시 이 가이드 참조 필수
- CLAUDE.md에서 해당 규칙 강조
- 팀 온보딩 시 해당 가이드 공유

## 🎯 핵심 원칙

1. **Framework Agnostic**: 특정 프레임워크에 의존하지 않는 컴포넌트 설계
2. **Props-First**: 외부 의존성 대신 Props로 필요한 데이터와 함수 전달
3. **Callback Pattern**: 액션은 콜백으로 위임하여 외부에서 처리
4. **Pure Functions**: 사이드 이펙트 없는 순수 함수 지향
5. **Early Detection**: 개발 단계에서 의존성 문제 조기 발견

이 가이드를 준수하면 **Storybook에서 모든 컴포넌트가 정상 작동하고, 다양한 프레임워크 환경에서도 사용 가능한 진정한 재사용 컴포넌트**를 만들 수 있습니다.