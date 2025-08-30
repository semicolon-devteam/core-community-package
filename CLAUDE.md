# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Guidelines

**언어 사용**: 모든 응답은 한국어로 작성해주세요. 코드 주석이나 기술 문서는 영어로 작성하되, 설명과 대화는 한국어를 사용합니다.

## Project Overview

**@semicolon/community-core**는 세미콜론 커뮤니티 플랫폼의 핵심 기능을 재사용 가능한 React 패키지로 제공하는 라이브러리입니다. 

### 패키지 특성
- **패키지 타입**: React 컴포넌트 라이브러리 + 유틸리티 패키지
- **빌드 시스템**: Rollup (ESM + CJS 이중 빌드)
- **타입 시스템**: TypeScript 5.0+ (점진적 타입 강화 전략)
- **아키텍처**: Atomic Design + Service Layer Pattern
- **의존성 전략**: Minimal Dependencies + Peer Dependencies

## Development Commands

```bash
# Package Development
npm run dev                    # Rollup watch 모드 (패키지 개발용)
npm run build                  # 패키지 빌드 (ESM + CJS)
npm run build:lib              # Rollup 빌드만 실행
npm run clean                  # dist 디렉토리 정리
npm run type-check             # TypeScript 타입 체크

# Quality Assurance  
npm test                       # Vitest 테스트 실행
npm run lint                   # ESLint 실행 (향후 추가)

# Package Management
npm run prepublishOnly         # 배포 전 자동 빌드
npm publish --access public    # NPM에 패키지 배포

# MCP (Model Context Protocol) 설정
npm run mcp:setup              # MCP 설정 스크립트 실행
npm run mcp:check              # MCP 설정 상태 확인
```

## Package Architecture Overview

### 📦 패키지 구조 원칙

**Modular Library Design**: 모든 기능이 독립적으로 import 가능한 모듈 구조:

```typescript
// 전체 패키지 import
import { Button, useAuth, BaseService } from '@semicolon/community-core';

// 개별 모듈 import (Tree Shaking 최적화)
import { Button } from '@semicolon/community-core/components';
import { useAuth } from '@semicolon/community-core/hooks';
import { BaseService } from '@semicolon/community-core/services';
```

### 🏗️ 계층별 아키텍처

**🔧 Service Layer**: HTTP 통신 및 외부 서비스 추상화
- `BaseService`: 표준화된 HTTP 메서드 (get, post, put, delete)
- Domain Services: `UserService`, `PostService`, `BoardService` 등
- 글로벌 로딩 인디케이터 자동 처리 (Silent 메서드로 바이패스 가능)
- `CommonResponse<T>` 래퍼로 일관된 API 응답 구조

**🧩 Component Layer**: Atomic Design 기반 컴포넌트 시스템
- **atoms/**: 독립적인 기본 UI 요소 (Button, Icon, Input)
- **molecules/**: 조합된 UI 컴포넌트 (SearchBar, Pagination)
- **organisms/**: 비즈니스 로직을 포함한 복합 컴포넌트 (GlobalLoader, AuthGuard)

**🪝 Hooks Layer**: 비즈니스 로직 캡슐화
- **common/**: 범용 유틸리티 훅 (useGlobalLoader, useDeviceType)
- **queries/**: React Query 기반 데이터 페칭
- **commands/**: 데이터 변경 및 비즈니스 액션

**🏪 State Management**: 전역 상태 관리 (선택적 사용)
- **Redux Toolkit**: 사용자 인증, UI 상태, 모달 관리
- **React Query**: 서버 상태 관리 및 캐싱
- **Local State**: 컴포넌트별 UI 상태

**🔐 Authentication System**: JWT 기반 인증 시스템 (Supabase 통합)
- Axios interceptors의 자동 토큰 갱신
- 레벨 기반 권한 시스템
- 서버/클라이언트 세션 검증

### 📁 패키지 디렉토리 구조

```text
lib/                          # 패키지 소스 (src/ 대신)
├── components/               # UI 컴포넌트 (Atomic Design)
│   ├── atoms/               # 기본 UI 요소
│   ├── molecules/           # 조합된 컴포넌트
│   └── organisms/           # 비즈니스 로직 포함 컴포넌트
├── hooks/                   # Custom React 훅
│   ├── common/              # 범용 유틸리티 훅
│   ├── queries/             # React Query 데이터 페칭
│   └── commands/            # 데이터 변경 및 비즈니스 액션
├── services/                # API 서비스 레이어
├── utils/                   # 순수 함수 유틸리티
├── types/                   # TypeScript 타입 정의
├── redux/                   # Redux Toolkit (선택적)
├── config/                  # 설정 및 초기화
└── constants/               # 상수 정의

dist/                        # 빌드 출력
├── index.js                 # CommonJS 번들
├── index.esm.js             # ESM 번들
├── index.d.ts               # TypeScript 선언 파일
└── components/              # 개별 모듈 번들
    ├── index.js
    └── index.d.ts

scripts/                     # 빌드 및 배포 스크립트
├── reorganize.sh            # 파일 재구성 스크립트
└── (기타 스크립트)

.docs/                       # 패키지 문서
├── IMPLEMENTATION_STRATEGY.md
├── PACKAGING_GUIDE.md
└── (기타 문서)
```

### 🎯 Import Path 전략

패키지 사용자를 위한 명확한 import 경로:

```typescript
// ✅ 메인 패키지에서 직접 import (권장)
import { Button, useAuth } from '@semicolon/community-core';

// ✅ 카테고리별 import (Tree Shaking 최적화)
import { Button } from '@semicolon/community-core/components';
import { useAuth } from '@semicolon/community-core/hooks';
import { BaseService } from '@semicolon/community-core/services';
import { formatNumberWithComma } from '@semicolon/community-core/utils';

// ❌ 내부 경로 직접 import (지양)
import Button from '@semicolon/community-core/dist/components/atoms/Button';
```

## 🛠️ 패키지 개발 가이드라인

### 🎯 개발 우선순위 및 단계

**Phase 1: 기반 구조** (✅ 완료)
- [x] 패키지 구조 및 빌드 시스템 최적화
- [x] Tree Shaking 및 "use client" 지원
- [x] 기본 유틸리티 함수

**Phase 2: 핵심 서비스** (✅ 완료)
- [x] BaseService 클래스 - 표준화된 HTTP 통신 및 에러 핸들링
- [x] UserService, PostService, BoardService - Domain Services 완성
- [x] AuthService, PermissionService - 인증/권한 시스템 구현

**Phase 3: 훅 시스템** (✅ 완료)
- [x] useAuth, useGlobalLoader - 인증 및 로딩 관리
- [x] React Query 기반 훅들 - 43개 훅 완성
- [x] 권한 체크 훅들 - usePermission, useAuthGuard
- [x] 네비게이션 훅들 - useRouterWithLoader, useNavigation

**Phase 4: 컴포넌트 시스템** (✅ 완료)
- [x] Atoms: Button, Badge, Avatar, Input, Skeleton
- [x] Molecules: 향후 확장 예정
- [x] Organisms: 향후 확장 예정

**Phase 5: Storybook & Documentation** (✅ 완료)
- [x] Storybook 7.6+ 구현
- [x] 한국어 문서화 및 인터랙티브 가이드
- [x] Vercel 배포 준비 완료

### 📝 코딩 컨벤션

**TypeScript 우선**: 모든 새로운 코드는 TypeScript로 작성
```typescript
// ✅ 명확한 타입 정의
interface UserServiceProps {
  userId: string;
  includePermissions?: boolean;
}

// ✅ Generic 활용
export class BaseService<T = any> {
  protected async get<R = T>(url: string): Promise<CommonResponse<R>> {
    // ...
  }
}
```

**Framework Agnostic 설계**: Next.js 의존성 최소화
```typescript
// ❌ Next.js 종속적
import Link from 'next/link';

// ✅ 추상화된 인터페이스
interface NavigationProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Tree Shaking 친화적**: Named Export 우선 사용
```typescript
// ✅ Tree Shaking 지원
export const formatNumber = (num: number) => { ... };
export const formatDate = (date: Date) => { ... };

// ❌ Tree Shaking 어려움
export default { formatNumber, formatDate };
```

### 🔧 API 통합

**Use the Global Loading System**: All API calls automatically show loading indicators unless using silent methods:

```typescript
// Shows global loader
const data = await postService.getPost(params);

// No loader for background operations
const data = await baseService.getSilent("/api/background-endpoint");
```

**Loading States with Global Loader**: Use `useGlobalLoader` hook for all loading states instead of rendering custom loading UI:

```typescript
// ✅ Correct - Use global loader for async operations
import { useGlobalLoader } from "@hooks/common/useGlobalLoader";

export default function SomeComponent() {
  const { withLoader, showLoader, hideLoader } = useGlobalLoader();
  
  const fetchData = async () => {
    await withLoader(async () => {
      showLoader("데이터를 불러오는 중...");
      const response = await someService.getData();
      // Process response
    });
  };

  // For initial load, return null to show global loader
  if (isInitialLoading) {
    return null; // Global loader is shown
  }
}

// ❌ Avoid - Don't render custom loading text in UI
export default function SomeComponent() {
  if (isLoading) {
    return (
      <div>
        <span>데이터를 불러오는 중...</span> {/* Don't do this */}
      </div>
    );
  }
}
```

**Skeleton Loading for Data Fetching**: When fetching data that needs to be rendered, use skeleton loaders alongside global loaders for better UX:

```typescript
// ✅ Correct - Use skeleton loaders for content areas during pagination/updates
import { Skeleton } from "@atoms/Skeleton";
import { useGlobalLoader } from "@hooks/common/useGlobalLoader";

export default function SomeDataComponent() {
  const { withLoader } = useGlobalLoader();
  const [data, setData] = useState([]);
  const [isPaginating, setIsPaginating] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchData = async (page: number) => {
    if (isInitialLoad) {
      // Initial load - use global loader
      await withLoader(async () => {
        const response = await someService.getData(page);
        setData(response.data);
        setIsInitialLoad(false);
      });
    } else {
      // Pagination - use skeleton loader
      setIsPaginating(true);
      const response = await someService.getData(page);
      setData(response.data);
      setIsPaginating(false);
    }
  };

  // Initial loading - return null to show global loader
  if (isInitialLoad) {
    return null;
  }

  return (
    <div>
      {isPaginating ? (
        // Show skeleton during pagination
        <SomeDataSkeleton />
      ) : (
        // Show actual data
        data.map(item => <SomeDataItem key={item.id} item={item} />)
      )}
    </div>
  );
}

// Skeleton component example
function SomeDataSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="border rounded p-4">
          <Skeleton className="w-32 h-6 mb-2" />
          <Skeleton className="w-full h-4 mb-1" />
          <Skeleton className="w-3/4 h-4" />
        </div>
      ))}
    </div>
  );
}

// ❌ Avoid - Don't render loading text during pagination
export default function SomeComponent() {
  if (isPaginating) {
    return <div>페이지를 불러오는 중...</div>; // Don't do this
  }
}
```

**Navigation with Loading**: Use `useRouterWithLoader` for page transitions with loading indicators:

```typescript
import { useRouterWithLoader } from "@hooks/common";
const router = useRouterWithLoader();
router.push("/some-page"); // Shows loader during navigation
```

**User Information Access**: Use the appropriate method based on component type:

```typescript
// ✅ Server Component - Use UserServiceByServerSide
import UserServiceByServerSide from "@services/userServiceByServerSide";

export default async function SomePage() {
  const { data } = await UserServiceByServerSide.getUserInfoDirect();
  const user = data?.user;
}

// ✅ Client Component - Use Redux userSlice
import { useAppSelector } from "@hooks/common";
import { selectUserInfo } from "@redux/Features/User/userSlice";

export default function SomeClientComponent() {
  const { userInfo } = useAppSelector(selectUserInfo);
  const userId = userInfo?.user_id;
}

// ❌ Avoid - Don't make additional API calls for user data that's already available
const userIdResponse = await userService.getUserUuid(); // Unnecessary API call
```

### Component Development

**Follow Atomic Design Principles**:

- Keep atoms stateless and dependency-free
- Use molecules for composite UI without business logic
- Place all business logic and state in organisms
- Use consistent TypeScript interfaces for props

**Page Component Structure**: Keep pages as server components and extract client-side logic:

```typescript
// ✅ Correct - app/[...]/page.tsx as server component
export default async function SomePage() {
  const { data } = await UserServiceByServerSide.getUserInfoDirect();
  
  return (
    <div className="container">
      <SomeContainer initialData={data} />
    </div>
  );
}

// ✅ Correct - components/organisms/SomeContainer/index.tsx as client component
'use client';
export default function SomeContainer({ initialData }) {
  // Client-side logic here
}

// ❌ Avoid - Don't make page.tsx a client component directly
'use client'; // Don't add this to page.tsx files
export default function SomePage() {
  // Client logic in page component
}
```

**Permission Integration**: Use the unified permission system:

- Wrap pages with `AuthGuard` for admin-only access
- Wrap pages with `LoginGuard` for authenticated access
- Use `usePermission` hook for level-based content access

**Error Handling**: Use common hooks and components for consistent error handling:

```typescript
// ✅ Client Component - Use useAuth and useAuthGuard hooks
import { useAuth } from "@hooks/User/useAuth";
import { useAuthGuard } from "@hooks/common/useAuthGuard";
import AuthErrorHandler from "@organisms/AuthErrorHandler";

export default function SomeClientComponent() {
  const { user, isLoggedIn } = useAuth();
  const { hasPermission, errorType, isLoading } = useAuthGuard({
    requiredLevel: 0, // Minimum level required
    adminOnly: false, // Admin only access
  });

  // Handle auth errors with common component
  if (errorType) {
    return <AuthErrorHandler errorType={errorType} redirectTo="/" />;
  }

  // Handle loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }
}

// ❌ Avoid - Don't implement custom auth/error logic
export default function SomeComponent() {
  const [error, setError] = useState("");
  
  if (!userInfo) {
    setError("로그인이 필요합니다"); // Don't do this
  }
}
```

### State Management

**Redux Usage**: For global state that persists across page navigations:

- User authentication state
- UI settings (theme, mobile menu state)
- Global modals and popups

**React Query Usage**: For all server data with automatic caching:

- Use query hooks in `/hooks/queries/` for data fetching
- Use mutation hooks in `/hooks/commands/` for data modifications
- Leverage built-in caching, background refetching, and error handling

**Data Fetching Architecture**: Follow the server-first approach with React Query integration:

```typescript
// ✅ Correct - Server component fetches initial data
export default async function SomePage() {
  const { data: userData } = await UserServiceByServerSide.getUserInfoDirect();
  
  // Fetch domain-specific initial data on server
  let initialSomeData = null;
  try {
    const response = await someService.getSomeData(userData.user.user_id.toString(), 1, 10);
    if (response.successOrNot === 'Y' && response.data) {
      initialSomeData = response.data;
    }
  } catch (error) {
    console.error('서버사이드 데이터 조회 실패:', error);
  }

  return (
    <div className="container">
      <SomeContainer 
        initialData={userData}
        initialSomeData={initialSomeData}
        userId={userData.user.user_id.toString()}
      />
    </div>
  );
}

// ✅ Correct - Client component uses React Query with initialData
'use client';
import { useSomeDataQuery } from "@hooks/queries/useSomeQuery";

export default function SomeContainer({ initialData, initialSomeData, userId }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaginating, setIsPaginating] = useState(false);
  const pageSize = 10;

  // React Query with server-side initial data
  const {
    data: someData,
    error: queryError,
    isLoading: isQueryLoading,
  } = useSomeDataQuery({
    userId,
    page: currentPage,
    pageSize,
    enabled: hasPermission && !authLoading,
    initialData: initialSomeData, // Server-side data as initial data
  });

  // Handle pagination with skeleton loading
  const handlePageChange = async (page: number) => {
    if (page !== currentPage) {
      setIsPaginating(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      setCurrentPage(page);
      setTimeout(() => setIsPaginating(false), 300);
    }
  };

  return (
    <>
      {isPaginating ? (
        <SomeDataSkeleton />
      ) : (
        <SomeDataList data={someData?.items || []} />
      )}
      
      <Pagination 
        currentPage={currentPage}
        totalPages={someData?.totalPages || 0}
        onPageChange={handlePageChange}
      />
    </>
  );
}
```

**Query Hook Naming Convention**: Use consistent naming for domain-specific query hooks:

```typescript
// ✅ Correct - Domain-specific query hook naming
// File: /hooks/queries/use{DomainName}Query.ts
export const use{DomainName}Query = ({ userId, page, pageSize, enabled, initialData }) => {
  return useQuery({
    queryKey: ['{domainName}', userId, page, pageSize],
    queryFn: async () => {
      const response = await {domainName}Service.get{DomainName}(userId, page, pageSize);
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '{DomainName} 조회 중 오류가 발생했습니다.');
    },
    enabled: enabled && !!userId,
    initialData: page === 1 && initialData ? initialData : undefined,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// Examples:
// usePointQuery (for point-related data)
// usePostQuery (for post-related data)  
// useUserQuery (for user-related data)
// useBoardQuery (for board-related data)
```

**Data Flow Rules**:

1. **Server-Side Initial Rendering**: Always fetch initial data on server components using domain services
2. **React Query Integration**: Use `use{DomainName}Query` hooks for all data fetching with initialData from server
3. **Client-Side Interactions**: Handle pagination, filtering, and user interactions dynamically on client with React Query
4. **Loading States**: Use global loader for initial load, skeleton loaders for pagination/updates

### Testing

Tests use Vitest with React Testing Library. Run tests before committing:

- Components should have corresponding `.test.tsx` files
- Focus on user interactions and behavior rather than implementation details
- Use the configured path aliases in test files

### Image Optimization

The project includes a Supabase Image Transformation utility (`@util/imageUtil`):

- Use `transformSupabaseImageUrl()` for automatic image optimization
- Leverage `generateImageSrcSet()` for responsive images
- Integrate with Next.js Image component using `supabaseImageLoader()`

### Authentication & Permissions

**Permission Levels**:

- Level 0 (`'free'`): Open access for all users
- Level 1+: Restricted based on user level
- Admin: Special `adminOnly` checks

**Implementation**:

- Page-level protection in `layout.tsx` files using `AuthGuard`/`LoginGuard`
- Component-level checks using `usePermission` hook
- Server-side validation in middleware and API routes

## Branch Management

- **main**: Production releases only
- **dev**: Development integration branch  
- **task-[number]**: Feature development branches
- **fix/***: Bug fix branches

Always create PRs from task branches to dev, then from dev to main.

## 📋 @semicolon/community-core 사용가능한 기능 명세

### ✅ Phase 1-5: 현재 구현된 기능 (v1.3.0)

**🔧 Core Utilities** (완전 구현 ✅)
```typescript
// 숫자 포맷팅
import { formatNumberWithComma } from '@team-semicolon/community-core';
formatNumberWithComma(1234567); // "1,234,567"

// 날짜 포맷팅  
import { formatDate, timeAgo } from '@team-semicolon/community-core';
formatDate("2024-01-15T10:30:00"); // "2024.01.15. 10:30:00"
timeAgo("2024-01-15T10:30:00"); // "2시간 전"

// 권한 체크
import { isAdmin, checkPermission } from '@team-semicolon/community-core';
isAdmin(user); // boolean
checkPermission(user, 'write', 5); // level-based permission
```

**🧩 Essential Components** (완전 구현 ✅)
```typescript
// Button 컴포넌트 (5가지 variant, 4가지 size, 로딩 상태)
import { Button, type ButtonProps } from '@team-semicolon/community-core';
<Button variant="primary" size="lg" loading={isSubmitting}>저장</Button>

// Badge 컴포넌트 (5가지 variant, 3가지 size, dot 표시)
import { Badge, type BadgeProps } from '@team-semicolon/community-core';
<Badge variant="success" dot>온라인</Badge>

// Avatar 컴포넌트 (5가지 size, 3가지 shape, 온라인 상태)
import { Avatar, type AvatarProps } from '@team-semicolon/community-core';
<Avatar src="/profile.jpg" name="김철수" size="lg" status="online" />

// Input 컴포넌트 (4가지 variant, 3가지 size, 아이콘 지원)
import { Input, type InputProps } from '@team-semicolon/community-core';
<Input label="이메일" error="오류 메시지" leftIcon={<SearchIcon />} />

// Skeleton 컴포넌트 (4가지 variant, 미리 정의된 컴포넌트들)
import { Skeleton, SkeletonCard, SkeletonText } from '@team-semicolon/community-core';
<SkeletonCard /> // 완전한 카드 스켈레톤
```

**🪝 Advanced Hooks** (완전 구현 ✅)
```typescript
// 인증 및 권한 관리
import { useAuth, usePermission, useAuthGuard } from '@team-semicolon/community-core';
const { user, isLoggedIn, login, logout } = useAuth();
const { hasPermission, loading } = usePermission({ requiredLevel: 5 });

// 로딩 상태 관리  
import { useGlobalLoader } from '@team-semicolon/community-core';
const { withLoader, showLoader, hideLoader } = useGlobalLoader();

// React Query 통합 (43개 훅)
import { 
  usePostQuery, useUserQuery, useBoardQuery,
  usePostCommand, useUserCommand 
} from '@team-semicolon/community-core';

// 네비게이션 및 라우팅
import { useRouterWithLoader, useNavigation } from '@team-semicolon/community-core';
const router = useRouterWithLoader();
router.push('/path'); // 로딩과 함께 페이지 이동
```

**📐 Core Types** (필수 타입 정의)
```typescript
import type { User, CommonResponse } from '@semicolon/community-core';

interface User {
  id: string;
  name: string;
  email?: string;
  level?: number;
  is_admin?: boolean;
  profileImage?: string;
}

interface CommonResponse<T> {
  successOrNot: string;
  statusCode: number;
  message?: string;
  data: T | null;
}
```

**⚙️ Package Configuration** (패키지 설정)
```typescript
import { initializeCommunityCore } from '@semicolon/community-core';

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

**📦 Import Strategies** (최적화된 import 방식)
```typescript
// ✅ 메인 패키지에서 직접 import (권장) - v1.3.0
import { 
  // Components
  Button, Skeleton, SkeletonText,
  // Hooks  
  useAuth, useGlobalLoader, usePostQuery,
  // Services
  UserService, PostService,
  // Utils
  formatNumberWithComma, isAdmin 
} from '@semicolon/community-core';

// ✅ 카테고리별 import (Tree Shaking 최적화)  
import { Button, Skeleton } from '@semicolon/community-core/components';
import { useAuth, useGlobalLoader } from '@semicolon/community-core/hooks';
import { formatNumberWithComma } from '@semicolon/community-core/utils';

// ✅ 네임스페이스 import (고급 사용)
import { Utils, Constants } from '@semicolon/community-core';
const formatted = Utils.formatNumberWithComma(12345);
```

### ✅ Phase 2: 구현 완료 기능

**🔧 Service Layer** (완전한 API 서비스 레이어)
```typescript
// 모던 클래스 기반 API (권장)
import { BaseService, UserService, PostService, BoardService, AuthService, PermissionService } from '@semicolon/community-core';

// 기본 서비스 사용
const userService = new UserService();
const user = await userService.getMyInfo();

// 커스텀 설정으로 서비스 생성
const customPostService = new PostService({
  baseUrl: '/api/custom/posts',
  defaultHeaders: { 'X-Custom': 'header' }
});

// 레거시 함수형 API (하위 호환)
import { userService, postService, authService } from '@semicolon/community-core';
const user = await userService.getMyInfo();
```

**🛡️ Authentication & Authorization** (완전한 인증/권한 시스템)
```typescript
// 인증 서비스 사용
import { AuthService, PermissionService } from '@semicolon/community-core';

const authService = new AuthService();
const permissionService = new PermissionService();

// 로그인/회원가입
await authService.login({ userId: 'user123', password: 'password' });
await authService.register({ userId: 'newuser', password: 'password', nickname: 'NewUser', agreeToTerms: true, agreeToPrivacy: true });

// 권한 체크
const canWrite = await permissionService.checkBoardAccess(boardId, 'write');
const isAdmin = await permissionService.checkAdminAccess('users');
```

**📊 Advanced API Features** (고급 API 기능)
```typescript
// 비동기 파일 업로드
const postService = new PostService();
const draftPost = await postService.createDraftPost({ title, content, boardId });
await postService.startAsyncFileUpload(draftPost.id, files);
const progress = await postService.getUploadProgress(draftPost.id);

// 게시판 관리
const boardService = new BoardService();
const boards = await boardService.getBoards({ page: 1, searchText: '자유' });
await boardService.addToFavorites(boardId);

// 사용자 관리
const userService = new UserService();
const users = await userService.searchUsers('김철수', 1, 10);
await userService.updateUserProfile({ nickname: 'NewNickname' });
```

### ✅ Phase 3: 완료된 기능 (v1.3.0 신규 추가)

**🪝 Hooks System** (완전한 React Hooks 생태계)
```typescript
// Authentication & State Management
import { useAuth, useGlobalLoader, usePermission, useAuthGuard } from '@semicolon/community-core';

const { loginWithLoader, logoutWithLoader, isAdmin, isUser } = useAuth();
const { withLoader, showLoader, hideLoader } = useGlobalLoader();
const { hasPermission } = usePermission({ requiredLevel: 1 });
const { isAuthorized, errorType } = useAuthGuard({ adminOnly: true });

// React Query Data Fetching
import { 
  useUserPointQuery, 
  usePostQuery, 
  useBoardQuery, 
  useCommentQuery 
} from '@semicolon/community-core';

const { data: userPoints } = useUserPointQuery(userId);
const { data: posts } = usePostQuery({ boardId, page, pageSize });

// Utility Hooks
import { useDeviceType, useRouterWithLoader } from '@semicolon/community-core';
const deviceType = useDeviceType(); // 'mobile' | 'tablet' | 'desktop'
const router = useRouterWithLoader(); // 로딩과 함께 페이지 이동
```

**🎨 Enhanced Components** (고도화된 UI 컴포넌트)
```typescript
// 강력한 Skeleton 시스템
import { 
  Skeleton, 
  SkeletonText, 
  SkeletonAvatar, 
  SkeletonButton, 
  SkeletonCard 
} from '@semicolon/community-core';

// 다양한 variant와 커스터마이징
<Skeleton variant="circular" width="3rem" height="3rem" />
<SkeletonText lines={3} />
<SkeletonCard /> // 완성형 카드 스켈레톤
```

### 🔮 Phase 4: 향후 기능 (로드맵)

**Advanced Components**:
- DataTable, Calendar, Chart 컴포넌트
- Modal, Drawer, Notification 시스템

**Theme System**:
- 다크모드, 커스텀 테마 지원
- CSS-in-JS 또는 CSS Variables 활용

**Internationalization**:
- 다국어 지원 (ko, en 등)
- 지역별 날짜/숫자 포맷팅

## 🔄 기능 업데이트 관리 규칙

### 📝 CLAUDE.md 갱신 규칙

**새로운 기능이 추가될 때마다 다음 사항을 필수로 업데이트해야 합니다:**

1. **기능 명세 업데이트** (`📋 @semicolon/community-core 사용가능한 기능 명세` 섹션)
   - 새 컴포넌트/유틸리티를 해당 Phase에 추가
   - 완성된 기능은 Phase 1로 이동
   - 실제 import 문과 사용 예제 포함

2. **Package Version 확인**
   ```bash
   # package.json의 version을 확인하고 업데이트
   npm version patch  # 버그 수정
   npm version minor  # 새로운 기능 추가  
   npm version major  # 호환성 변경
   ```

### 📊 버전 관리 규칙 (Semantic Versioning)

**@team-semicolon/community-core 패키지의 버전 관리 전략:**

#### 🎯 버전 번호 체계: `MAJOR.MINOR.PATCH`

**Major 버전 (X.0.0)**
- **기준**: 호환성을 깨는 변경사항 또는 완전한 아키텍처 재설계
- **예시**: 
  - v2.0.0: 오늘 분석한 내용의 모든 기능 완료 (메시징, 실시간, React Native 지원 등)
  - API 인터페이스 변경으로 기존 코드 수정 필요
  - 주요 의존성 업그레이드로 인한 Breaking Changes

**Minor 버전 (1.X.0)**
- **기준**: 새로운 기능 추가 (하위 호환성 유지)
- **예시**:
  - v1.7.0: 알림 시스템 (NotificationService + 훅 + Storybook) 추가
  - v1.8.0: 메시징 시스템 추가 예정
  - v1.9.0: Supabase Realtime 통합 예정
- **포함 작업**:
  - 새로운 서비스, 훅, 컴포넌트 추가
  - 새로운 export 추가
  - Storybook 새 스토리 추가

**Patch 버전 (1.7.X)**
- **기준**: 버그 수정, 문서 개선, 기존 기능 보완
- **예시**:
  - v1.7.1: CLAUDE.md 버전 관리 규칙 문서화
  - v1.7.2: NotificationService의 에러 핸들링 개선
  - v1.7.3: Storybook 스토리 설명 보완
- **포함 작업**:
  - 문서 추가/수정
  - 버그 수정
  - 기존 기능의 성능 개선
  - 타입 정의 보완
  - 테스트 추가

#### 🏷️ 현재 로드맵

```
v1.7.0 ✅ 알림 시스템 완료 (NotificationService + 훅 + Storybook)
v1.8.0 🔄 메시징 시스템 (MessageService + 채팅 UI + Storybook)
v1.9.0 📋 Supabase Realtime 통합 (RealtimeService + 실시간 훅)
v1.10.0 📋 React Native 지원 (모바일 컴포넌트 + 푸시 알림)
v2.0.0 🎯 모든 공통 기능 완료 (완전한 커뮤니티 코어 패키지)
```

#### 📝 버전 업데이트 체크리스트

**Minor 버전 업데이트 시:**
1. 새 기능의 완전한 구현 확인
2. Storybook 동기화 완료
3. package.json 버전 업데이트
4. lib/index.ts VERSION 상수 업데이트
5. CLAUDE.md 기능 명세 업데이트
6. Git 태그와 함께 커밋
7. NPM 배포 (선택사항)

**Patch 버전 업데이트 시:**
1. 문서 또는 버그 수정 완료
2. 기존 기능 영향도 검증
3. 필요시 타입 체크 및 빌드 검증
4. 버전 업데이트 및 커밋

3. **Documentation 동기화**
   - `API_REFERENCE.md`: 상세한 API 문서 업데이트
   - `USAGE_EXAMPLES.md`: 실제 사용 예제 추가
   - `CHANGELOG.md`: 변경사항 기록 (없으면 생성)

4. **Build 및 Export 검증**
   ```bash
   # 빌드가 성공하는지 확인
   npm run build
   
   # 타입 체크 통과 확인
   npm run type-check
   
   # 새로운 export가 정상 작동하는지 확인
   node -e "console.log(require('./dist/index.js'))"
   ```

### 🏷️ 기능 분류 및 상태 태그

**기능 상태 표시 방법:**
- ✅ **구현 완료**: Phase 1에 포함, 프로덕션 사용 가능
- 🔄 **개발 중**: Phase 2에 포함, 구현 진행 중
- 📋 **계획됨**: Phase 3에 포함, 향후 개발 예정
- ⚠️ **실험적**: 베타 기능, 변경 가능성 있음
- 🚫 **지원 중단**: 더 이상 권장하지 않는 기능

### 📅 업데이트 체크리스트 템플릿

**새로운 기능을 추가할 때 사용할 체크리스트:**

```markdown
## 기능 업데이트 체크리스트

### 📋 구현 완료 확인
- [ ] 컴포넌트/유틸리티 구현 완료
- [ ] TypeScript 타입 정의 완료
- [ ] 단위 테스트 작성 및 통과
- [ ] 빌드 및 export 검증 완료

### 📝 문서화 완료 확인
- [ ] CLAUDE.md 기능 명세 섹션 업데이트
- [ ] API_REFERENCE.md 상세 문서 추가
- [ ] USAGE_EXAMPLES.md 사용 예제 추가
- [ ] 실제 import 문과 사용법 검증
- [ ] **Storybook 스토리 추가 및 동기화** (필수 🚨)

### 🚀 배포 준비 확인
- [ ] package.json 버전 업데이트
- [ ] CHANGELOG.md 변경사항 기록
- [ ] lib/index.ts export 추가
- [ ] Tree shaking 최적화 확인

### 🧪 품질 검증 확인
- [ ] eslint 및 prettier 규칙 준수
- [ ] 기존 기능 회귀 테스트
- [ ] 메모리 누수 및 성능 검증
- [ ] 접근성(a11y) 가이드라인 준수 (UI 컴포넌트만)
```

### 🔍 정기 검토 및 유지보수

**월간 검토 사항:**
- Phase 1 기능의 사용성 피드백 수집
- Phase 2 개발 진행도 점검 및 우선순위 조정
- Phase 3 로드맵 검토 및 업데이트
- 의존성 업데이트 및 보안 취약점 점검

**분기별 검토 사항:**
- 전체 아키텍처 및 디자인 패턴 일관성 검토
- 번들 사이즈 최적화 및 Tree shaking 효율성 분석
- 사용자 피드백 기반 API 개선사항 도출
- 경쟁 라이브러리 분석 및 차별화 포인트 강화

### 📞 기능 관련 문의 및 지원

**기능 요청 및 버그 리포트:**
- GitHub Issues 활용하여 체계적 관리
- 템플릿 기반 이슈 생성으로 정보 표준화
- 라벨링 시스템으로 우선순위 및 카테고리 관리

**커뮤니티 기여 가이드:**
- 새로운 기능 제안 시 RFC(Request for Comments) 프로세스
- 기여자 가이드라인 및 코딩 컨벤션 문서화
- 코드 리뷰 기준 및 승인 프로세스 명시

## 📚 Storybook 동기화 규칙 (필수)

### 🚨 핵심 원칙: 코어 패키지와 Storybook 완전 동기화

**모든 새로운 컴포넌트나 기능 추가 시 Storybook 동기화는 필수사항입니다.**

### 📋 Storybook 동기화 체크리스트

#### 새 컴포넌트 추가 시 (100% 필수)
- [ ] **Storybook 스토리 파일 생성**: `storybook/src/stories/{category}/{ComponentName}.stories.tsx`
- [ ] **기본 스토리 구성**: Default, 변형 버전들, 상호작용 예시
- [ ] **컴포넌트 문서화**: JSDoc 스타일 설명과 사용법 가이드
- [ ] **Props 인터랙티브 제어**: argTypes를 통한 모든 props 제어 가능
- [ ] **사용 예시 다양화**: 최소 3-5개의 실제 사용 시나리오
- [ ] **접근성 검증**: Storybook a11y addon으로 검증 완료

#### 기존 컴포넌트 수정 시 (100% 필수)
- [ ] **기존 스토리 업데이트**: 변경된 Props나 기능에 맞춰 스토리 수정
- [ ] **새로운 변형 추가**: 추가된 기능이나 옵션에 대한 스토리 추가
- [ ] **문서 동기화**: 변경사항에 맞춰 컴포넌트 설명 업데이트
- [ ] **타입 정보 확인**: TypeScript 타입 변경사항 반영
- [ ] **예제 코드 검증**: 모든 예제가 실제로 작동하는지 확인

#### 품질 기준
- [ ] **Visual 회귀 테스트**: 스토리북에서 모든 스토리 정상 렌더링
- [ ] **반응형 테스트**: 다양한 뷰포트에서 컴포넌트 동작 확인
- [ ] **상호작용 테스트**: 클릭, 호버, 포커스 등 상호작용 동작 확인
- [ ] **Dark Mode 지원**: 테마별 렌더링 상태 확인
- [ ] **Loading State**: 로딩 상태 및 에러 상태 스토리 제공

### 🗂️ Storybook 파일 구조 규칙

```
storybook/src/stories/
├── atoms/           # 기본 UI 요소
├── molecules/       # 조합된 컴포넌트
├── organisms/       # 비즈니스 로직 포함 복합 컴포넌트
├── forms/           # 폼 관련 컴포넌트
├── hooks/           # 커스텀 훅 예시
└── theme/           # 테마 시스템 관련
```

### 🔄 동기화 검증 명령어

```bash
# Storybook 실행 및 검증
npm run storybook

# 모든 스토리가 정상 렌더링되는지 확인
npm run storybook:test  # (향후 추가 예정)

# 패키지 빌드 후 Storybook에서 import 테스트
npm run build && npm run storybook
```

### 🚨 Storybook Import 에러 방지 가이드

**가장 흔한 에러**: `Failed to fetch dynamically imported module`

#### ✅ 올바른 Import 방식

**스토리에서 컴포넌트 import 시 직접 소스 참조 사용:**

```typescript
// ✅ 올바른 방식 - 직접 소스 경로 사용
import Board from '../../../../lib/components/molecules/Board';
import BoardContainer from '../../../../lib/components/molecules/Board/Container';
import type { BoardCategory } from '../../../../lib/components/molecules/Board/types';

// ❌ 피해야 할 방식 - 패키지 이름 사용 (개발 환경에서 에러 발생)
import { Board, BoardContainer } from '@team-semicolon/community-core';
```

#### 📝 Import 경로 규칙

1. **Storybook 스토리에서만**: 직접 소스 경로 사용 (`../../../../lib/...`)
2. **실제 프로젝트에서**: 패키지 이름 사용 (`@team-semicolon/community-core`)
3. **타입 import**: 항상 소스에서 직접 import

#### 🔧 Storybook 설정 최적화

**`.storybook/main.ts` 설정:**

```typescript
viteFinal: async (config) => {
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@team-semicolon/community-core': '../lib',
        '@': '../lib',
      },
    },
    // ... 기타 설정
  });
},
```

#### ⚠️ 에러 발생 시 체크리스트

**`Failed to fetch dynamically imported module` 에러 발생 시:**

1. **Import 경로 확인**
   ```bash
   # 파일 존재 여부 확인
   ls -la lib/components/molecules/Board/
   ```

2. **상대 경로 검증**
   ```typescript
   // storybook/src/stories/molecules/Board.stories.tsx에서
   // ../../../../lib/components/molecules/Board 경로가 정확한지 확인
   ```

3. **Storybook 서버 재시작**
   ```bash
   # Storybook 서버 재시작
   npm run storybook
   ```

4. **캐시 클리어**
   ```bash
   # 캐시 클리어 후 재시작
   rm -rf node_modules/.vite storybook/node_modules/.vite
   npm run storybook
   ```

5. **패키지 빌드 상태 확인**
   ```bash
   # 패키지가 제대로 빌드되었는지 확인
   npm run build
   ls -la dist/
   ```

#### 🎯 예방 조치

**새 컴포넌트 스토리 작성 시 필수 확인사항:**

1. **Import 경로**: 반드시 상대 경로로 소스 직접 참조
2. **타입 Import**: 타입도 소스에서 직접 import
3. **경로 검증**: 실제 파일이 해당 경로에 존재하는지 확인
4. **Storybook 테스트**: 스토리 작성 후 즉시 브라우저에서 확인

**스토리 템플릿:**

```typescript
import type { Meta, StoryObj } from '@storybook/react';

// ✅ 컴포넌트 직접 import
import YourComponent from '../../../../lib/components/{category}/{ComponentName}';
import type { YourComponentProps } from '../../../../lib/components/{category}/{ComponentName}/types';

const meta = {
  title: '{Category}/{ComponentName}',
  component: YourComponent,
  // ... 설정
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // props 설정
  },
};
```

#### 🔄 문제 해결 워크플로우

1. **에러 발생** → Import 경로 재확인
2. **경로 수정** → 상대 경로로 직접 소스 참조
3. **Storybook 재시작** → 캐시 문제 해결
4. **브라우저 테스트** → 정상 렌더링 확인
5. **문서 업데이트** → README 또는 가이드에 추가

#### 💡 개발 팁

- **IDE 자동완성 활용**: VS Code에서 경로 자동완성으로 오타 방지
- **파일 구조 일관성**: 모든 컴포넌트가 동일한 구조를 따르도록 유지
- **정기적인 검증**: 새 스토리 추가 시마다 즉시 브라우저에서 확인

### 📖 스토리 작성 가이드라인

#### 필수 포함 요소
1. **Meta 정보**: title, component, parameters 올바르게 설정
2. **기본 스토리**: 가장 일반적인 사용 사례
3. **Props 제어**: argTypes으로 모든 props 인터랙티브 제어
4. **문서화**: 컴포넌트와 각 스토리에 대한 상세 설명
5. **다양한 상태**: 로딩, 에러, 빈 상태, 성공 상태 등
6. **🚨 실제 구현 코드 예시**: Hook이나 복잡한 컴포넌트의 경우 반드시 실제 사용 코드 예시 포함

#### 스토리 명명 규칙
```typescript
// ✅ 올바른 스토리 명명
export const Default: Story = { ... };           // 기본 상태
export const WithIcons: Story = { ... };         // 아이콘이 있는 상태
export const LoadingState: Story = { ... };      // 로딩 상태
export const ErrorState: Story = { ... };        // 에러 상태
export const MobileView: Story = { ... };        // 모바일 뷰

// ❌ 피해야 할 명명
export const Story1: Story = { ... };            // 의미 없는 이름
export const test: Story = { ... };              // 소문자 시작
export const 한글이름: Story = { ... };           // 한글 이름
```

#### Hook 스토리 특별 가이드라인 🪝

**Hook 스토리는 단순한 UI 데모를 넘어서 실제 구현 방법을 반드시 포함해야 합니다.**

##### 1. 실제 구현 코드 예시 필수 포함
```typescript
// ✅ 올바른 Hook 스토리 구조
export const AuthExample: Story = {
  render: () => {
    // UI 데모 구현...
  },
  parameters: {
    docs: {
      description: {
        story: `useAuth 훅을 사용한 인증 상태 관리 예시입니다.

## 실제 구현 코드

### 기본 사용법
\\\`\\\`\\\`tsx
import { useAuth } from '@team-semicolon/community-core';

function LoginComponent() {
  const { user, isLoggedIn, loginWithLoader, logoutWithLoader } = useAuth();
  
  const handleLogin = async () => {
    try {
      const result = await loginWithLoader({
        email: 'user@example.com',
        password: 'password123'
      });
      
      if (result.success) {
        console.log('로그인 성공:', result.user);
      }
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };
  
  return (
    <div>
      {isLoggedIn ? (
        <button onClick={() => logoutWithLoader()}>로그아웃</button>
      ) : (
        <button onClick={handleLogin}>로그인</button>
      )}
    </div>
  );
}
\\\`\\\`\\\`

### 조건부 렌더링 예시
\\\`\\\`\\\`tsx
function ProtectedComponent() {
  const { isLoggedIn, isAdmin } = useAuth();
  
  if (!isLoggedIn) {
    return <LoginPrompt />;
  }
  
  return (
    <div>
      <h1>보호된 콘텐츠</h1>
      {isAdmin() && <AdminPanel />}
    </div>
  );
}
\\\`\\\`\\\``,
      },
    },
  },
};
```

##### 2. 다양한 사용 사례 포함
- **기본 사용법**: 가장 일반적인 사용 방법
- **고급 사용법**: 옵션과 조건부 로직 활용
- **에러 처리**: 실패 상황 대응 방법
- **다른 훅과의 조합**: 실제 프로젝트에서의 활용 예시

##### 3. Hook별 필수 예시 유형

**인증/권한 훅 (`useAuth`, `usePermission`)**:
- 로그인/로그아웃 플로우
- 조건부 렌더링 패턴
- 권한 기반 UI 제어

**데이터 페칭 훅 (`usePostQuery`, `useUserQuery`)**:
- 기본 데이터 조회
- 페이지네이션 구현
- 조건부 쿼리 실행
- 에러 처리 및 재시도

**상태 관리 훅 (`useGlobalLoader`)**:
- 자동 로딩 처리 (`withLoader`)
- 수동 로딩 제어 (`showLoader/hideLoader`)
- 다른 훅과의 조합 사용

**유틸리티 훅 (`useDeviceType`, `useRouterWithLoader`)**:
- 반응형 UI 구현
- 네비게이션 처리
- 성능 최적화 예시

##### 4. Hook 스토리 완료 체크리스트

**📋 Hook 스토리 작성 완료 기준**:
- [ ] **UI 데모**: 인터랙티브한 Hook 동작 시연
- [ ] **기본 사용법 코드**: `import` 부터 기본 활용까지 완전한 예시
- [ ] **고급 사용법 코드**: 옵션, 조건부 로직, 에러 처리 포함
- [ ] **실제 프로젝트 예시**: 다른 훅과 조합한 실용적 사용 사례
- [ ] **타입 정보**: TypeScript 타입과 인터페이스 정보 포함
- [ ] **주의사항**: 일반적인 실수나 주의할 점 명시
- [ ] **관련 훅**: 함께 사용하면 좋은 다른 훅들 언급

**🚨 중요**: Hook 스토리는 개발자가 실제로 복사-붙여넣기해서 바로 사용할 수 있는 수준의 완전한 코드 예시를 제공해야 합니다.

### 🚀 자동화 및 CI/CD 통합 (향후 계획)

```yaml
# GitHub Actions 예시 (향후 구현)
- name: Storybook 빌드 검증
  run: npm run storybook:build
  
- name: Visual 회귀 테스트  
  run: npm run storybook:test
  
- name: 컴포넌트-스토리 동기화 검증
  run: npm run verify:storybook-sync
```

### 📝 Storybook 작성 예시

```typescript
// 올바른 스토리 구조 예시
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@team-semicolon/community-core';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '재사용 가능한 버튼 컴포넌트입니다. 다양한 variant와 size를 지원합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'outline', 'danger'],
      description: '버튼의 시각적 스타일 변형',
    },
    size: {
      control: 'select', 
      options: ['sm', 'md', 'lg', 'xl'],
      description: '버튼의 크기',
    },
    loading: {
      control: 'boolean',
      description: '로딩 상태 표시 여부',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '기본 버튼',
    variant: 'primary',
    size: 'md',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 variant를 보여주는 예시입니다.',
      },
    },
  },
};
```

### 🔍 동기화 검증 방법

1. **패키지 빌드 후 Storybook 실행**
   ```bash
   npm run build
   npm run storybook
   ```

2. **모든 import가 정상 동작하는지 확인**
   - Console 에러 없음
   - 모든 컴포넌트 정상 렌더링
   - Props 제어 정상 동작

3. **문서화 품질 확인**
   - 각 스토리에 적절한 설명 있음
   - 사용 예시가 실제 사용법과 일치
   - 타입 정보가 정확히 표시됨

### ⚠️ 주의사항

- **Storybook 없이는 PR 승인 불가**: 새로운 컴포넌트나 주요 변경사항은 반드시 Storybook 포함
- **문서화 품질 기준**: 단순히 스토리 파일만 있는 것이 아니라 사용자가 이해할 수 있는 품질의 문서화 필요
- **실제 사용법과 일치**: Storybook의 예시는 실제 프로젝트에서 사용하는 방법과 동일해야 함
- **지속적 업데이트**: 컴포넌트 변경 시 관련 스토리도 반드시 함께 업데이트

**📢 중요**: Storybook은 단순한 문서화 도구가 아니라 **컴포넌트 개발,테스트, 품질 관리의 핵심 도구**입니다. 모든 팀원이 Storybook을 통해 컴포넌트의 동작을 이해하고 테스트할 수 있어야 합니다.

## 🎯 Hook Stories 전용 가이드라인

### 📋 Hook Story 작성 원칙

**핵심 원칙**: Hook Stories는 단순한 UI 데모가 아닌, **실제 구현 코드 예시를 포함한 완전한 개발 가이드**여야 합니다.

#### ✅ 필수 요구사항

1. **개별 문서화**: 각 Hook 카테고리별로 전용 `.md` 파일 생성
   ```
   storybook/src/stories/hooks/
   ├── LoaderHooks.md        # useAuth, useGlobalLoader, usePermission 등
   ├── MessageHooks.md       # useMessagesQuery, useSendMessageCommand 등  
   ├── NotificationHooks.md  # useNotificationsQuery, useMarkNotificationReadCommand 등
   └── HooksExamples.stories.tsx  # 기본 훅 예시 (기존 유지)
   ```

2. **완전한 구현 예시**: 각 문서에는 복사해서 바로 사용할 수 있는 완전한 컴포넌트 예시 포함
   ```tsx
   // ✅ 완전한 예시 - LoaderHooks.md에서
   import { useAuth, useGlobalLoader } from '@team-semicolon/community-core';
   
   function LoginComponent() {
     const { loginWithLoader } = useAuth();
     const { withLoader } = useGlobalLoader();
     const [credentials, setCredentials] = useState({ userId: '', password: '' });
     
     const handleLogin = async (e) => {
       e.preventDefault();
       await withLoader(async () => {
         await loginWithLoader(credentials);
         alert('로그인 성공!');
       });
     };
     
     return (
       <form onSubmit={handleLogin}>
         {/* 완전한 JSX 구현 */}
       </form>
     );
   }
   ```

3. **사용 팁 및 주의사항**: 각 문서 말미에 실무 팁과 주의사항 포함

#### ❌ 금지사항

```tsx
// ❌ 단순한 UI만 보여주는 예시 (기존 방식)
export const BasicLoader: Story = {
  render: () => {
    const { isLoading } = useGlobalLoader();
    return <div>{isLoading ? '로딩 중' : '완료'}</div>;
  }
};
```

### 🗂️ Hook 문서 구조 템플릿

각 Hook 문서는 다음 구조를 따라야 합니다:

```markdown
# {HookName} 사용 가이드

**@team-semicolon/community-core**의 {HookName}는 {기능 설명}을 제공합니다.

## 📋 제공하는 훅들
- 각 훅의 간단한 설명 목록

## 🚀 실제 구현 예시

### 1. 기본 사용법
```tsx
// 완전한 컴포넌트 구현 예시
import { useHook } from '@team-semicolon/community-core';

function ExampleComponent() {
  // 실제 훅 사용법
  // 완전한 로직 구현
  // JSX 반환
}
```

### 2. 고급 사용법
// 더 복잡한 실제 사용 사례들...

## 💡 사용 팁
// 실무에서 유용한 팁들

## ⚠️ 주의사항  
// 주의해야 할 점들

## 🔗 관련 훅들
// 연관된 다른 훅들
```

### 🔄 Hook Story 업데이트 워크플로우

**새로운 Hook 추가 시:**

1. **해당 카테고리 문서 업데이트**
   ```bash
   # 예: 새 알림 훅 추가 시
   vi storybook/src/stories/hooks/NotificationHooks.md
   ```

2. **완전한 구현 예시 추가**
   - 기본 사용법부터 고급 패턴까지
   - 에러 처리 및 로딩 상태 관리 포함
   - 실제 프로덕션에서 사용 가능한 수준의 코드

3. **Story 파일에 참조 링크 추가**
   ```tsx
   parameters: {
     docs: {
       description: {
         story: `자세한 사용법은 [NotificationHooks.md](./NotificationHooks.md)를 참고하세요.`
       }
     }
   }
   ```

**기존 Hook 수정 시:**
1. 해당 문서의 예시 코드 업데이트
2. 변경된 API에 맞춰 모든 예시 수정
3. 새로운 기능이나 옵션에 대한 예시 추가

### 📚 문서화 품질 기준

**각 Hook 문서는 다음 기준을 만족해야 합니다:**

- ✅ **완전성**: 복사해서 바로 실행 가능한 코드
- ✅ **실용성**: 실제 프로덕션에서 사용할 수 있는 패턴
- ✅ **포괄성**: 기본 사용법부터 고급 패턴까지 모두 다룸
- ✅ **최신성**: 현재 패키지 버전과 일치하는 API 사용
- ✅ **교육성**: 왜 그렇게 사용해야 하는지 설명 포함

### 🎯 앞으로의 구현 지침

**모든 Hook 및 Service 레이어 구현 시:**

1. **개별 문서화 우선**: 통합 문서보다는 카테고리별 전용 문서 작성
2. **예시 중심 작성**: 설명보다는 실제 동작하는 코드 예시 우선
3. **점진적 복잡도**: 기본 → 중급 → 고급 순서로 예시 배치
4. **실무 적용성**: 토이 프로젝트가 아닌 실제 서비스에서 사용 가능한 수준

**Other Layers (Services, Utils 등)도 동일하게:**
- 각 레이어별 전용 문서 생성
- 완전한 구현 예시 포함  
- 실무 적용 가능한 패턴 제시

### 📌 Docs 스토리 순서 및 스타일 규칙

**✅ 필수 준수 사항:**

1. **Docs 스토리 최상단 배치**: 모든 카테고리에서 `Docs` 스토리를 첫 번째 export로 배치
   ```tsx
   export default meta;
   type Story = StoryObj;

   // 문서 스토리 (최상단 배치)
   export const Docs: Story = { ... };

   // 다른 예시 스토리들
   export const BasicExample: Story = { ... };
   ```

2. **주황색 문서 아이콘 통일**: Docs는 Examples의 Docs와 동일한 📄 주황색 아이콘으로 표시

3. **완전한 가이드 제공**: 각 Docs 스토리는 다음 구조를 포함해야 함:
   ```tsx
   // 문서 스토리 구조
   export const Docs: Story = {
     render: () => (
       <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
         <h1>{CategoryName} 사용 가이드</h1>
         <h2>📋 제공하는 훅들</h2>
         <h3>📚 완전한 사용 가이드</h3>
         <h3>🚀 주요 패턴</h3>
         <h3>💡 주요 특징</h3>
       </div>
     ),
     parameters: {
       docs: {
         description: {
           story: '완전한 {CategoryName} 사용 가이드입니다.'
         }
       }
     }
   };
   ```

4. **중복 제거**: 파일 하단에 중복된 Docs 스토리가 있으면 반드시 제거

### 🔄 Docs 스토리 업데이트 체크리스트

**새로운 Hook 카테고리 추가 시:**
- [ ] 첫 번째 export로 `Docs` 스토리 추가
- [ ] 주황색 문서 아이콘으로 표시 확인
- [ ] 완전한 가이드 구조 포함
- [ ] 외부 .md 파일 링크 추가
- [ ] 주요 패턴 3-5개 코드 예시 포함
- [ ] 특징 및 장점 설명 추가
- [ ] 파일 하단 중복 스토리 제거 확인

**기존 Hook 수정 시:**
- [ ] Docs 스토리의 훅 목록 업데이트
- [ ] 새로운 기능에 대한 패턴 예시 추가
- [ ] 변경된 API 반영하여 코드 수정
- [ ] 주의사항이나 특징 업데이트


## Important Notes

- Never commit sensitive information (API keys, tokens, MCP credentials)
- Use TypeScript strictly - all components and functions should be properly typed
- Follow the existing code patterns and architectural decisions
- The global loading system is automatic - don't create duplicate loading states
- Permission checks are centralized - don't implement custom authorization logic
- All API responses follow the `CommonResponse<T>` pattern
- **새로운 기능 추가 시 반드시 위의 업데이트 관리 규칙을 준수할 것**
- **문서와 코드의 동기화를 위해 체크리스트를 활용할 것**
- **🚨 Storybook 동기화 없이는 어떤 컴포넌트도 완성된 것으로 간주하지 않음**