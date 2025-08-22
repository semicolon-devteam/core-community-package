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
- [x] 패키지 구조 및 빌드 시스템
- [x] 기본 유틸리티 함수

**Phase 2: 핵심 서비스** (🔄 진행중)
- [ ] BaseService 클래스
- [ ] UserService, PostService 등
- [ ] 인증/권한 시스템

**Phase 3: 훅 시스템**
- [ ] useAuth, useGlobalLoader
- [ ] React Query 기반 훅들
- [ ] 권한 체크 훅들

**Phase 4: 컴포넌트 시스템**
- [ ] Atoms: Button, Icon, Input
- [ ] Molecules: Pagination, SearchBar
- [ ] Organisms: GlobalLoader, AuthGuard

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

### ✅ Phase 1: 현재 구현된 기능

**🔧 Core Utilities** (필수 유틸리티)
```typescript
// 숫자 포맷팅
import { formatNumberWithComma } from '@semicolon/community-core';
formatNumberWithComma(1234567); // "1,234,567"

// 날짜 포맷팅
import { formatDate, timeAgo } from '@semicolon/community-core';
formatDate("2024-01-15T10:30:00"); // "2024.01.15. 10:30:00"
timeAgo("2024-01-15T10:30:00"); // "2시간 전"

// 권한 체크
import { isAdmin } from '@semicolon/community-core';
isAdmin(user); // boolean
```

**🧩 Essential Components** (핵심 컴포넌트)
```typescript
// Button 컴포넌트 (5가지 variant, 로딩 상태, 아이콘 지원)
import { Button, type ButtonProps } from '@semicolon/community-core';
<Button variant="primary" size="lg" loading={isSubmitting}>저장</Button>

// Badge 컴포넌트 (상태 표시, 레벨, 태그)
import { Badge, type BadgeProps } from '@semicolon/community-core';
<Badge variant="success" dot>온라인</Badge>

// Avatar 컴포넌트 (프로필 이미지, 상태 표시, 폴백)
import { Avatar, type AvatarProps } from '@semicolon/community-core';
<Avatar src="/profile.jpg" name="김철수" size="lg" status="online" />
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
// ✅ 메인 패키지에서 직접 import (권장)
import { Button, formatNumberWithComma, isAdmin } from '@semicolon/community-core';

// ✅ 카테고리별 import (Tree Shaking 최적화)
import { Button } from '@semicolon/community-core/components';
import { formatNumberWithComma } from '@semicolon/community-core/utils';

// ✅ 네임스페이스 import (고급 사용)
import { Utils, Constants } from '@semicolon/community-core';
const formatted = Utils.formatNumberWithComma(12345);
```

### 🚧 Phase 2: 계획된 기능 (구현 예정)

**Form Components**:
- Input, Select, Checkbox, RadioButton 컴포넌트
- Form validation 및 상태 관리

**React Query Hooks**:
- useAuth, useUserData, usePostData 등
- 서버 상태 관리 및 캐싱

**API Service Layer**:
- BaseService, UserService, PostService
- 표준화된 HTTP 통신 및 에러 핸들링

### 🔮 Phase 3: 향후 기능 (로드맵)

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

## Important Notes

- Never commit sensitive information (API keys, tokens)
- Use TypeScript strictly - all components and functions should be properly typed
- Follow the existing code patterns and architectural decisions
- The global loading system is automatic - don't create duplicate loading states
- Permission checks are centralized - don't implement custom authorization logic
- All API responses follow the `CommonResponse<T>` pattern
- **새로운 기능 추가 시 반드시 위의 업데이트 관리 규칙을 준수할 것**
- **문서와 코드의 동기화를 위해 체크리스트를 활용할 것**

# 미디어 프로세서 API 사용 가이드 (v2.0)

## 📌 서비스 개요
미디어 프로세서는 코인톡 커뮤니티 플랫폼의 이미지/비디오 파일에 워터마크를 자동으로 추가하고 Supabase 스토리지에 업로드하는 마이크로서비스입니다. 단일
  파일뿐만 아니라 **다중 파일 업로드**와 **게시글 단위 관리** 기능을 지원합니다.

## 🔗 API 엔드포인트
- **Base URL**: `https://your-media-processor-api.com`
- **Health Check**: `GET /api/health`
- **진단**: `GET /api/media/diagnose`

## 📚 주요 API 엔드포인트

### 1. 단일 파일 처리

#### 동기 처리 (즉시 응답)
```http
POST /api/media/process
Content-Type: multipart/form-data

비동기 처리 (백그라운드)

POST /api/media/process-async
Content-Type: multipart/form-data

공통 파라미터:
- file (필수): 업로드할 미디어 파일
- userId (필수): 사용자 UUID
- watermarkPosition (선택): 워터마크 위치 (기본값: bottom-right)
- watermarkOpacity (선택): 투명도 0-1 (기본값: 0.7)
- needWatermark (선택): 워터마크 적용 여부 (기본값: true)
- needThumbnailExtract (선택): 썸네일 추출 여부 (기본값: false)

2. 다중 파일 처리 (신규 🆕)

게시글용 다중 파일 업로드

POST /api/media/upload-async
Content-Type: multipart/form-data

파라미터:
- files (필수): 업로드할 파일들 (최대 10개)
- postId (필수): 게시글 ID (정수)
- userId (필수): 사용자 UUID
- needWatermark (선택): 워터마크 적용 여부 (기본값: true)
- watermarkPosition (선택): 워터마크 위치 (기본값: bottom-right)
- watermarkOpacity (선택): 투명도 (기본값: 0.7)

3. 업로드 상태 관리

게시글 업로드 진행률 조회

GET /api/media/upload-progress/:postId

실패한 파일 재시도

POST /api/media/retry-upload/:postId
Content-Type: application/json

{
  "userId": "user-uuid",
  "failedFileUuids": ["file-uuid-1", "file-uuid-2"]
}

업로드 취소

DELETE /api/media/cancel-upload/:postId
Content-Type: application/json

{
  "userId": "user-uuid"
}

4. 기존 API (단일 파일용)

작업 상태 확인

GET /api/media/status/:jobId

작업 결과 조회

GET /api/media/result/:jobId

작업 취소

DELETE /api/media/cancel/:jobId

🎯 사용 예시

1. 단일 파일 업로드 (기존 방식)

async function uploadSingleFile(file, userId) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);
  formData.append('needWatermark', 'true');

  const response = await fetch('/api/media/process', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  return result.data.url;
}

2. 게시글용 다중 파일 업로드 (신규 🆕)

async function uploadPostFiles(files, postId, userId) {
  const formData = new FormData();

  // 파일들 추가
  files.forEach(file => {
    formData.append('files', file);
  });

  formData.append('postId', postId.toString());
  formData.append('userId', userId);
  formData.append('needWatermark', 'true');

  const response = await fetch('/api/media/upload-async', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  return result.data; // { uploadId, postId, queuedFiles, failedFiles }
}

3. 업로드 진행률 모니터링

async function monitorUploadProgress(postId) {
  const checkProgress = async () => {
    const response = await fetch(`/api/media/upload-progress/${postId}`);
    const result = await response.json();

    if (result.successOrNot === 'Y') {
      const progress = result.data;
      console.log('진행률:', progress);

      // UI 업데이트
      updateProgressUI(progress);

      // 완료 확인
      if (progress.status === 'completed') {
        return progress;
      }

      // 실패한 파일이 있으면 재시도 옵션 제공
      if (progress.failedFiles?.length > 0) {
        handleFailedFiles(postId, progress.failedFiles);
      }
    }

    return null;
  };

  // 폴링 시작
  let completed = false;
  while (!completed) {
    const result = await checkProgress();
    if (result) {
      completed = true;
      return result;
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

4. 실패한 파일 재시도

async function retryFailedFiles(postId, userId, failedFileUuids) {
  const response = await fetch(`/api/media/retry-upload/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: userId,
      failedFileUuids: failedFileUuids
    })
  });

  const result = await response.json();

  if (result.successOrNot === 'Y') {
    console.log('재시도 시작됨:', result.data.retriedFiles);

    // 다시 진행률 모니터링 시작
    return monitorUploadProgress(postId);
  } else {
    throw new Error(result.message);
  }
}

5. 완전한 게시글 생성 워크플로우

async function createPostWithFiles(postData, files) {
  try {
    // 1. 게시글 먼저 생성 (미디어 없이)
    const post = await createPost({
      title: postData.title,
      content: postData.content,
      userId: postData.userId,
      status: 'uploading' // 업로드 중 상태
    });

    if (files && files.length > 0) {
      // 2. 파일 업로드 시작
      const uploadResult = await uploadPostFiles(files, post.id, postData.userId);

      // 3. 업로드 진행률 모니터링
      const finalResult = await monitorUploadProgress(post.id);

      // 4. 게시글 상태 업데이트 (완료)
      await updatePost(post.id, {
        status: 'published',
        mediaCount: finalResult.completedFiles?.length || 0
      });

      return {
        post: post,
        mediaUrls: finalResult.completedFiles?.map(f => f.url) || []
      };
    } else {
      // 파일이 없으면 바로 게시
      await updatePost(post.id, { status: 'published' });
      return { post: post, mediaUrls: [] };
    }

  } catch (error) {
    console.error('게시글 생성 실패:', error);
    throw error;
  }
}

6. 업로드 취소

async function cancelUpload(postId, userId) {
  const response = await fetch(`/api/media/cancel-upload/${postId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId })
  });

  const result = await response.json();
  return result.successOrNot === 'Y';
}

📋 응답 형식

다중 파일 업로드 응답

{
  "data": {
    "uploadId": "uuid-string",
    "postId": 123,
    "totalFiles": 5,
    "queuedFiles": [
      {
        "uuid": "file-uuid-1",
        "fileName": "image1.jpg",
        "fileSize": 1024000,
        "fileType": "image/jpeg",
        "status": "pending",
        "jobId": "job-uuid-1"
      }
    ],
    "failedFiles": [
      {
        "uuid": "file-uuid-2",
        "fileName": "invalid.txt",
        "status": "failed",
        "error": "지원하지 않는 파일 형식입니다"
      }
    ]
  },
  "successOrNot": "Y",
  "statusCode": 200,
  "message": "다중 파일 비동기 업로드가 시작되었습니다."
}

업로드 진행률 응답

{
  "data": {
    "postId": 123,
    "uploadId": "uuid-string",
    "status": "processing", // pending, processing, completed, failed
    "progress": {
      "completed": 3,
      "failed": 1,
      "pending": 1,
      "total": 5
    },
    "files": [
      {
        "uuid": "file-uuid-1",
        "fileName": "image1.jpg",
        "status": "completed",
        "url": "https://...image1.jpg",
        "jobId": "job-uuid-1"
      },
      {
        "uuid": "file-uuid-2",
        "fileName": "video1.mp4",
        "status": "failed",
        "error": "처리 중 오류 발생",
        "jobId": "job-uuid-2"
      }
    ],
    "completedFiles": [
      {
        "uuid": "file-uuid-1",
        "fileName": "image1.jpg",
        "url": "https://...image1.jpg",
        "thumbnailUrl": null
      }
    ],
    "failedFiles": [
      {
        "uuid": "file-uuid-2",
        "fileName": "video1.mp4",
        "error": "처리 중 오류 발생"
      }
    ]
  },
  "successOrNot": "Y",
  "statusCode": 200,
  "message": "업로드 진행률 조회가 완료되었습니다."
}

⚡ 성능 최적화 팁

다중 파일 업로드 권장사항

- 파일 수 제한: 한 번에 최대 10개 파일
- 총 용량 제한: 게시글당 총 2GB 권장
- 동시 처리: 자동으로 최적화된 동시 처리 적용
- 재시도 로직: 실패한 파일만 선별적으로 재시도

게시글 생성 워크플로우

1. 게시글 먼저 생성: 미디어 업로드와 독립적으로 게시글 생성
2. 백그라운드 업로드: 사용자는 업로드 진행률 확인 가능
3. 점진적 완성: 파일이 처리되는 대로 게시글에 반영
4. 에러 복구: 일부 파일 실패 시에도 성공한 파일은 유지

처리 시간 예상 (다중 파일)

- 이미지 5개 (각 2MB): 5-15초
- 이미지 + 비디오 (총 50MB): 30초-2분
- 대용량 비디오 여러 개: 2-10분

🔧 환경 변수 설정

# 미디어 프로세서 API URL
MEDIA_PROCESSOR_API_URL=https://your-media-processor-api.com

# Supabase 설정
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 워터마크 텍스트
DEFAULT_WATERMARK_TEXT=CoinTalk Community

📦 지원 파일 형식

이미지

- JPEG/JPG (image/jpeg)
- PNG (image/png)
- GIF (image/gif) - 애니메이션 유지
- WebP (image/webp)

비디오

- MP4 (video/mp4)
- AVI (video/avi)
- MOV (video/mov, video/quicktime)

🚨 주의사항

1. 게시글 소유권: 모든 다중 파일 API는 게시글 소유권 검증 필수
2. 파일 제한: 단일 파일 최대 200MB, 게시글당 최대 10개 파일
3. 동시 업로드: 한 사용자당 동시에 하나의 다중 파일 업로드만 권장
4. 에러 처리: 부분 실패 시 성공한 파일은 유지, 실패한 파일만 재시도 가능
5. 리소스 정리: 업로드 취소 시 Supabase에서 자동으로 첨부파일 정리

🔍 디버깅 및 모니터링

Supabase 연결 진단

GET /api/media/diagnose

성능 통계

GET /api/media/stats

병목점 분석

GET /api/media/bottleneck

💡 통합 예제 - 코인톡 게시글 에디터

class PostMediaUploader {
  constructor(postId, userId) {
    this.postId = postId;
    this.userId = userId;
    this.uploadId = null;
    this.isUploading = false;
  }

  async uploadFiles(files) {
    if (this.isUploading) {
      throw new Error('이미 업로드가 진행 중입니다.');
    }

    this.isUploading = true;

    try {
      // 1. 업로드 시작
      const uploadResult = await uploadPostFiles(files, this.postId, this.userId);
      this.uploadId = uploadResult.uploadId;

      // 2. 진행률 모니터링
      const finalResult = await this.monitorProgress();

      return finalResult;
    } finally {
      this.isUploading = false;
    }
  }

  async monitorProgress() {
    return new Promise((resolve, reject) => {
      const checkProgress = async () => {
        try {
          const response = await fetch(`/api/media/upload-progress/${this.postId}`);
          const result = await response.json();

          if (result.successOrNot === 'Y') {
            const progress = result.data;

            // 진행률 UI 업데이트
            this.onProgressUpdate?.(progress);

            // 완료 확인
            if (progress.status === 'completed') {
              resolve(progress);
              return;
            }

            // 실패한 파일 처리
            if (progress.failedFiles?.length > 0) {
              this.onFailure?.(progress.failedFiles);
            }

            // 다음 체크 스케줄
            setTimeout(checkProgress, 2000);
          } else {
            reject(new Error(result.message));
          }
        } catch (error) {
          reject(error);
        }
      };

      checkProgress();
    });
  }

  async retryFailedFiles(failedFileUuids) {
    if (!this.isUploading) {
      this.isUploading = true;

      try {
        await retryFailedFiles(this.postId, this.userId, failedFileUuids);
        return await this.monitorProgress();
      } finally {
        this.isUploading = false;
      }
    }
  }

  async cancel() {
    if (this.isUploading) {
      await cancelUpload(this.postId, this.userId);
      this.isUploading = false;
    }
  }
}

// 사용 예시
const uploader = new PostMediaUploader(postId, userId);

uploader.onProgressUpdate = (progress) => {
  console.log(`진행률: ${progress.progress.completed}/${progress.progress.total}`);
  updateProgressBar(progress.progress.completed / progress.progress.total * 100);
};

uploader.onFailure = (failedFiles) => {
  console.log('실패한 파일:', failedFiles);
  showRetryOption(failedFiles);
};

// 파일 업로드 시작
uploader.uploadFiles(selectedFiles)
  .then(result => {
    console.log('업로드 완료:', result);
    displayCompletedFiles(result.completedFiles);
  })
  .catch(error => {
    console.error('업로드 실패:', error);
  });

📞 문의 및 지원

- Supabase 연결 문제: /api/media/diagnose 엔드포인트로 진단
- 성능 이슈: /api/media/stats 및 /api/media/bottleneck 활용
- API 상태 확인: /api/health 엔드포인트 모니터링
- 사용자 정보를 저장할때는, @src/model/User/index.ts 의 User타입에 맞게 저장되도록 할 것..
- 프로젝트 전역적으로 페이지네이션 구현은 @src/component/molecules/Board/Pagination/index.tsx 컴포넌트를 사용 할 것.
- 로그인한 사용자 정보를 얻을 땐 다음 방법 사용; - 서버사이드 컴포넌트: @src/services/userServiceByServerSide.ts:getUserInfoDirect() - 클라이언트 사이드 컴포넌트 : @src/redux/Features/User/userSlice.ts:selectUserInfo()