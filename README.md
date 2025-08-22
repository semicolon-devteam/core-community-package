# 커뮤니티 서비스

Next.js 15.1.4 기반의 커뮤니티 웹 서비스 프론트엔드 프로젝트입니다.

## 기술 스택

- **프레임워크**: Next.js 15.1.4 (React 19.0.0)
- **언어**: TypeScript
- **상태 관리**: Redux(@reduxjs/toolkit), React Query(@tanstack/react-query)
- **스타일링**: TailwindCSS
- **인증 및 데이터베이스**: Supabase
- **HTTP 클라이언트**: Axios
- **에디터**: Toast UI Editor

## 프로젝트 구조

```
fe-client/
├── public/                # 정적 파일
├── src/
│   ├── app/               # Next.js 앱 라우터
│   │   ├── api/           # API 라우트
│   │   ├── board/         # 게시판 페이지
│   │   ├── join/          # 회원가입 페이지
│   │   ├── partner/       # 파트너 페이지
│   │   ├── post/          # 게시글 페이지
│   │   ├── layout.tsx     # 루트 레이아웃
│   │   └── page.tsx       # 홈페이지
│   ├── component/         # 컴포넌트 (Atomic Design)
│   │   ├── atoms/         # 기본 UI 컴포넌트
│   │   ├── molecules/     # 복합 UI 컴포넌트
│   │   └── organisms/     # 상태를 가진 컴포넌트
│   ├── config/            # 설정 파일
│   │   ├── Supabase/      # Supabase 설정
│   │   └── axios.ts       # Axios 인스턴스 설정
│   ├── hooks/             # 커스텀 훅
│   ├── middleware.ts      # Next.js 미들웨어
│   ├── model/             # 데이터 모델
│   ├── redux/             # Redux 설정
│   │   ├── Features/      # Redux 기능별 슬라이스
│   │   ├── reducers/      # 리듀서
│   │   └── stores/        # 스토어 설정
│   ├── services/          # API 서비스 레이어
│   ├── templates/         # 페이지 템플릿
│   └── util/              # 유틸리티 함수
├── .env.local             # 환경 변수
├── next.config.ts         # Next.js 설정
├── package.json           # 패키지 의존성
└── tsconfig.json          # TypeScript 설정
```

## 폴더별 상세 설명

### `/src/app`

Next.js 13+ 버전의 App Router 구조를 사용합니다. 각 폴더는 라우트를 의미하며, 해당 폴더 내 `page.tsx` 파일이 실제 페이지 컴포넌트입니다.

- **`layout.tsx`**: 공통 레이아웃 정의, 서버 컴포넌트
- **`client-wrapper.tsx`**: 서버에서 클라이언트로 데이터를 전달하는 래퍼 컴포넌트
- **`client.tsx`**: 클라이언트 레이아웃 및 상태 관리 설정
- **`providers.tsx`**: Redux, React-Query 등 프로바이더 설정
- **`/board`**: 게시판 관련 페이지
- **`/post`**: 게시글 상세 페이지
- **`/join`**: 회원가입 페이지
- **`/partner`**: 파트너 관련 페이지

### `/src/component`

Atomic Design 패턴을 적용한 컴포넌트 구조:

- **`/atoms`**: 기본 UI 요소 (버튼, 입력필드, 아이콘 등)

  - 상태를 가지지 않음
  - 다른 컴포넌트에 종속되지 않음
  - 예: Button, Input, Icon

- **`/molecules`**: 여러 Atoms를 조합한 복합 컴포넌트

  - 상태를 가지지 않음
  - 다른 컴포넌트에 종속됨
  - 예: SearchBar, FormGroup, Card

- **`/organisms`**: 상태를 가진 복잡한 컴포넌트
  - 상태 관리 로직 포함
  - 다른 컴포넌트에 종속됨
  - 예: Navigation, Header, SideBar

### `/src/hooks`

재사용 가능한 커스텀 훅을 모아둔 디렉토리:

- API 호출 관련 훅 (useQuery 래핑)
- 유틸리티 훅 (useResponsive, useDebounce 등)
- UI 상태 관련 훅 (useModal, useForm 등)

### `/src/model`

타입스크립트 타입 정의 및 인터페이스:

- **`/User`**: 사용자 관련 모델
- **`/board`**: 게시판 관련 모델
- **`/post`**: 게시글 관련 모델
- **`/common`**: 공통 모델 (응답 형식 등)
- **`/menu`**: 메뉴 관련 모델

### `/src/services`

API 통신 로직을 추상화한 서비스 레이어:

- **`baseService.ts`**: 기본 HTTP 요청 메서드(get, post, put 등)
- **`boardService.ts`**: 게시판 관련 API 요청
- **`postService.ts`**: 게시글 관련 API 요청
- **`homeService.ts`**: 홈 화면 관련 API 요청
- **`menuService.ts`**: 메뉴 관련 API 요청

#### 전역 로딩 시스템

API 요청과 라우트 변경 시 자동으로 로딩 스피너가 표시되는 시스템을 구축했습니다.

**주요 기능:**

- 모든 API 요청 시 자동 글로벌 로더 표시
- Router.push/replace 호출 시 자동 로더 표시  
- 중복 요청 시 카운터로 관리
- 완료/에러 시 자동 로더 숨김

**사용 방법:**

```typescript
// 1. Router 사용 (자동 로더)
import { useRouterWithLoader } from "@hooks/common";

const router = useRouterWithLoader();
router.push("/some-page"); // 🔄 자동 로더 표시

// 2. API 사용 (자동 로더)  
import postService from "@services/postService";

await postService.getPost(params); // 🔄 자동 로더 표시

// 3. Silent 모드 (로더 없음)
import baseService from "@services/baseService";

await baseService.getSilent("/api/background"); // 로더 없음
```

**지원 서비스:**

- `postService`, `commentService`, `userService`
- `boardService`, `fileService`, `reportService`  
- `bannerService`, `homeService`, `menuService`, `noticeService`

### `/src/redux`

Redux 관련 설정 및 로직:

- **`/Features`**: 기능별 슬라이스 (userSlice, themeSlice 등)
- **`/reducers`**: 루트 리듀서 설정
- **`/stores`**: 스토어 구성 및 미들웨어 설정

### `/src/config`

프로젝트 설정 파일:

- **`/Supabase`**: Supabase 클라이언트 설정
  - **`client.ts`**: 클라이언트 사이드 Supabase 설정
  - **`server.ts`**: 서버 사이드 Supabase 설정
- **`axios.ts`**: Axios 인스턴스 및 인터셉터 설정

### `/src/middleware.ts`

Next.js 미들웨어 - 인증 체크 및 리다이렉트 로직

### `/src/templates`

페이지 레이아웃 템플릿

### `/src/util`

유틸리티 함수 모음

#### 이미지 최적화 유틸리티 (`imageUtil.ts`)

Supabase Storage의 Image Transformation 기능을 활용한 이미지 최적화 유틸리티입니다.

**주요 기능:**

- 이미지 사이즈 최적화 및 캐싱
- URL 자동 변환 (`/object/` → `/render/image/`)
- 반응형 이미지 지원
- Next.js Image 컴포넌트 통합

**사용 예시:**

```typescript
import {
  transformSupabaseImageUrl,
  IMAGE_SIZE,
  generateImageSrcSet,
} from '@util/imageUtil';

// 기본 사용법
const originalUrl =
  'https://supabase.semi-colon.space/storage/v1/object/public/public-bucket/image.png';
const optimizedUrl = transformSupabaseImageUrl(originalUrl, 'md', 80); // 240px, 80% 품질

// 여러 사이즈 생성 (srcSet용)
const srcSet = generateImageSrcSet(originalUrl, ['sm', 'md', 'lg']);

// Next.js Image 컴포넌트와 함께 사용
import { supabaseImageLoader } from '@util/imageUtil';

<Image
  src="public-bucket/path/to/image.jpg"
  width={300}
  height={200}
  loader={supabaseImageLoader}
  alt="최적화된 이미지"
/>;
```

**사이즈 상수:**

```typescript
export const IMAGE_SIZE = {
  sm: 120, // 작은 이미지 (프로필 등)
  md: 240, // 중간 이미지 (썸네일 등)
  lg: 480, // 큰 이미지 (게시글 등)
  xl: 720, // 매우 큰 이미지
  xxl: 960, // 최대 크기
};
```

**성능 이점:**

- 자동 WebP 변환으로 파일 크기 감소
- 디바이스별 최적화된 이미지 제공
- 캐싱을 통한 로딩 속도 향상
- 대역폭 사용량 절약

## 아키텍처 패턴

### 컴포넌트 구조 (Atomic Design)

- **atoms**: 상태를 가지지 않는 단일 컴포넌트
- **molecules**: 상태를 가지지 않는 다중 컴포넌트, 다른 컴포넌트에 종속됨
- **organisms**: 상태를 가지는 다중 컴포넌트, 다른 컴포넌트에 종속됨

### 데이터 흐름

```
컴포넌트 -> 커스텀 훅(useXXXQuery) -> 서비스 레이어 -> API -> Supabase
```

### 권한 시스템 아키텍처

본 프로젝트는 통합된 권한 관리 시스템을 사용합니다:

#### 핵심 컴포넌트

- **AuthGuard**: 관리자 권한 체크
- **LoginGuard**: 로그인 여부 체크  
- **usePermission**: 레벨 기반 권한 체크 훅

#### JWT 기반 하이브리드 시스템

```
JWT 토큰 (우선순위) + Redux 상태 (백업) 조합
```

- JWT 토큰에서 user_id, permission_type, nickname 등을 직접 추출
- 복잡한 DB 조회 없이 권한 확인 가능
- JWT 토큰이 없거나 만료된 경우 Redux 상태로 백업

#### 권한 체크 방식

1. **페이지 레벨 권한 체크** (권장):

   ```tsx
   // layout.tsx에서 처리
   export default function Layout({ children }: { children: React.ReactNode }) {
     return (
       <LoginGuard>  {/* 로그인 필요 */}
         <AuthGuard adminOnly={true}>  {/* 관리자만 */}
           {children}
         </AuthGuard>
       </LoginGuard>
     );
   }
   ```

2. **컴포넌트 레벨 권한 체크**:

   ```tsx
   import { usePermission } from '@hooks/common/usePermission';
   
   function Component() {
     const { checkPermission, showAccessDeniedToast } = usePermission();
     
     const canRead = checkPermission(post.readLevel);
     const canComment = checkPermission(post.commentLevel);
     
     if (!canRead) {
       showAccessDeniedToast();
       return <ErrorHandler />;
     }
     
     return (
       <div>
         {/* 컨텐츠 */}
         {canComment && <CommentForm />}
       </div>
     );
   }
   ```

#### 권한 레벨 시스템

- **레벨 0** (`'free'`): 자유 게시판, 모든 사용자 접근 가능
- **레벨 1~**: 사용자 레벨에 따른 접근 제한
- **관리자**: `adminOnly` 옵션으로 별도 체크

#### 리팩토링 완료 사항

✅ **통합 권한 시스템 적용**:

- 개별 컴포넌트의 권한 체크 로직을 AuthGuard로 대체
- MyPageContainer의 로그인 체크를 LoginGuard로 변경  
- AdminChecker를 AuthGuard의 adminOnly 옵션으로 대체
- PostTemplate, PostDetailTemplate에 통합 권한 체크 적용

✅ **레거시 코드 정리**:

- 중복된 권한 체크 컴포넌트 제거
- 불필요한 콘솔 로그 정리
- 타입 안전성 개선 (`User | null` 일관성)

## 개발자 가이드

### 서버/클라이언트 컴포넌트 구분

Next.js 13+ 앱 라우터에서는 기본적으로 모든 컴포넌트가 서버 컴포넌트입니다. 클라이언트 컴포넌트로 지정하려면 파일 상단에 `"use client"` 지시어를 추가해야 합니다.

```tsx
// 서버 컴포넌트 (기본값)
export default function ServerComponent() {
  return <div>서버에서 렌더링됨</div>;
}

// 클라이언트 컴포넌트
('use client');
export default function ClientComponent() {
  const [state, setState] = useState(false);
  return <div>클라이언트에서 렌더링됨</div>;
}
```

#### 서버 컴포넌트 사용 지침

- 데이터베이스, 파일 시스템 등 서버 리소스에 직접 접근해야 할 때
- 민감한 정보(API 키, 토큰 등)를 다룰 때
- 대규모 의존성이 있거나 무거운 계산이 필요할 때

#### 클라이언트 컴포넌트 사용 지침

- 상태(useState)를 사용해야 할 때
- 이벤트 리스너(onClick 등)을 사용해야 할 때
- 라이프사이클 훅(useEffect)을 사용해야 할 때
- 브라우저 전용 API를 사용해야 할 때

### 서비스 레이어 및 API 호출 가이드

#### 전역 로딩 시스템 상세 가이드

본 프로젝트는 API 요청과 라우트 변경 시 자동으로 로딩 스피너가 표시되는 시스템을 구축했습니다.

**🚀 주요 특징:**

1. **API 자동 로더**: 모든 API 요청 시 자동으로 글로벌 로더 표시
2. **Router 자동 로더**: `useRouterWithLoader` 훅을 통한 페이지 이동 시 로더 표시
3. **중복 요청 처리**: 동시 다중 요청 시 카운터로 관리
4. **에러 안전성**: API 에러 발생 시에도 로더가 정상적으로 숨겨짐

**📝 사용 방법:**

```tsx
// 1. 페이지 이동 (자동 로더)
import { useRouterWithLoader } from "@hooks/common";

function MyComponent() {
  const router = useRouterWithLoader();
  
  const handleNavigation = () => {
    router.push("/some-page"); // 🔄 자동 로더 시작 → ✅ 페이지 로드 완료 시 종료
  };
  
  return <button onClick={handleNavigation}>페이지 이동</button>;
}

// 2. API 호출 (자동 로더)
import postService from "@services/postService";

const fetchPosts = async () => {
  try {
    // 🔄 자동 로더 시작
    const result = await postService.getPost({
      boardId: 1,
      page: 1,
      pageSize: 10
    });
    // ✅ 성공 시 자동 로더 종료
  } catch (error) {
    // ❌ 에러 시에도 자동 로더 종료
    console.error(error);
  }
};

// 3. Silent 모드 (로더 없음) - 백그라운드 처리용
import baseService from "@services/baseService";

const silentFetch = async () => {
  // 로더 없이 조용히 실행
  const result = await baseService.getSilent<SomeType>("/api/background-data");
};
```

**🛠️ Silent 모드 메서드:**

```tsx
// 로더 없이 각종 HTTP 메서드 사용
await baseService.getSilent<T>("/api/endpoint");
await baseService.postSilent<T, D>("/api/endpoint", data);
await baseService.putSilent<T, D>("/api/endpoint", data);
await baseService.deleteSilent<T>("/api/endpoint");
```

**💡 사용 팁:**

- **사용자 액션**: 버튼 클릭 등 명시적 작업 → 기본 메서드 (로더 O)
- **백그라운드 작업**: 폴링, 실시간 업데이트 → Silent 메서드 (로더 X)
- **페이지 이동**: `useRouterWithLoader` 사용 (로더 O)
- **조용한 이동**: 기본 `useRouter` 사용 (로더 X)

#### 서버 사이드 데이터 호출

서버 컴포넌트에서는 `fetch` API를 사용하여 데이터를 호출합니다.

```tsx
// 서버 컴포넌트 예시
export default async function ServerComponent() {
  const data = await fetch('https://api.example.com/data');
  const json = await data.json();

  return <ClientComponent data={json} />;
}
```

#### 클라이언트 사이드 데이터 호출

클라이언트 컴포넌트에서는 다음과 같은 방법으로 데이터를 호출합니다:

1. **React Query와 서비스 레이어 사용** (권장):

```tsx
// 커스텀 훅 예시 (hooks/usePostQuery.ts)
export function usePostQuery(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPost(id), // 🔄 자동 로더 적용
  });
}

// 컴포넌트에서 사용 예시
function PostComponent({ id }) {
  const { data, isLoading, error } = usePostQuery(id);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return <PostDisplay post={data} />;
}
```

2. **직접 서비스 호출**:

```tsx
import postService from '@services/postService';

const fetchData = async () => {
  // 🔄 자동 로더 표시됨
  const response = await postService.getPost(params);
  setData(response.data);
};
```

### 상태 관리 가이드

#### Redux 사용 케이스

다음과 같은 경우 Redux를 사용합니다:

- 전역적으로 접근해야 하는 상태 (사용자 정보, 테마 설정 등)
- 여러 컴포넌트에서 공유하는 상태
- 앱 레벨의 설정이나 사용자 선호도

```tsx
// Redux 사용 예시
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '@redux/Features/themeSlice';

function ThemeToggle() {
  const theme = useSelector(state => state.theme.value);
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(toggleTheme())}>현재 테마: {theme}</button>
  );
}
```

#### React Query 사용 케이스

다음과 같은 경우 React Query를 사용합니다:

- 서버 상태 관리 (API 호출 결과)
- 데이터 캐싱이 필요한 경우
- 데이터 리로딩, 폴링, 무효화 등이 필요한 경우

```tsx
// React Query 사용 예시
import { useQuery, useMutation } from '@tanstack/react-query';
import { postService } from '@services/postService';

function PostList() {
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: postService.getPosts,
  });

  // 나머지 컴포넌트 로직
}
```

#### 로컬 상태 사용 케이스

컴포넌트 내부에서만 사용되는 상태는 React의 `useState`를 사용합니다:

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
}
```

### 인증 처리

Supabase를 통한 인증을 사용합니다:

```tsx
// 로그인 예시
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

const login = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('로그인 에러:', error);
    return;
  }

  // 로그인 성공 처리
};
```

### 컴포넌트 개발 가이드

새로운 컴포넌트를 개발할 때는 다음 원칙을 따릅니다:

1. **적절한 계층 선택**: atoms, molecules, organisms 중 적절한 계층 선택
2. **순수 함수형 컴포넌트**: 가능한 순수 함수형 컴포넌트로 작성
3. **TypeScript 타입 정의**: Props와 상태에 대한 명확한 타입 정의
4. **재사용성 고려**: 컴포넌트는 가능한 재사용 가능하도록 설계
5. **권한 체크 통합**: 개별 권한 체크 대신 AuthGuard, LoginGuard 사용

### 권한 시스템 개발 가이드

#### 새 페이지 권한 설정

1. **로그인이 필요한 페이지**:

   ```tsx
   // app/protected-page/layout.tsx
   import { LoginGuard } from '@component/organisms/LoginGuard';
   
   export default function Layout({ children }: { children: React.ReactNode }) {
     return <LoginGuard>{children}</LoginGuard>;
   }
   ```

2. **관리자 전용 페이지**:

   ```tsx
   // app/admin/layout.tsx
   import { AuthGuard } from '@component/organisms/AuthGuard';
   
   export default function Layout({ children }: { children: React.ReactNode }) {
     return <AuthGuard adminOnly={true}>{children}</AuthGuard>;
   }
   ```

3. **레벨 기반 권한이 필요한 컴포넌트**:

   ```tsx
   import { usePermission } from '@hooks/common/usePermission';
   
   function LevelRestrictedComponent({ requiredLevel }: { requiredLevel: number }) {
     const { checkPermission, showAccessDeniedToast } = usePermission();
     
     if (!checkPermission(requiredLevel)) {
       showAccessDeniedToast();
       return null;
     }
     
     return <div>권한이 있는 사용자만 볼 수 있는 컨텐츠</div>;
   }
   ```

#### 권한 체크 주의사항

⚠️ **하지 말아야 할 것들**:

- 개별 컴포넌트에서 직접 JWT 토큰 파싱
- useEffect로 권한 체크 후 리다이렉트
- 중복된 권한 체크 로직 작성

✅ **권장하는 방법**:

- layout.tsx에서 페이지 레벨 권한 체크
- usePermission 훅으로 컴포넌트 레벨 권한 체크
- 통합된 AuthGuard, LoginGuard 컴포넌트 활용

```tsx
// 컴포넌트 예시
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${
        variant === 'primary'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 text-gray-800'
      }`}
    >
      {label}
    </button>
  );
}

export default Button;
```

### 네이밍 및 코드 스타일 가이드

#### 파일 및 폴더 네이밍

- 컴포넌트 파일: PascalCase (예: `Button.tsx`, `UserProfile.tsx`)
- 훅, 유틸리티 파일: camelCase (예: `useAuth.ts`, `formatDate.ts`)
- 상수 파일: SNAKE_CASE (예: `API_ENDPOINTS.ts`)

#### 함수 네이밍

- 컴포넌트 함수: PascalCase (예: `function Button()`)
- 일반 함수: camelCase (예: `function calculateTotal()`)
- 이벤트 핸들러: `handleXXX` 패턴 (예: `handleClick`, `handleSubmit`)

#### TypeScript 타입

- 인터페이스: PascalCase, 접두사 없음 (예: `UserProps`, `Post`)
- 타입: PascalCase (예: `ButtonVariant`, `FetchStatus`)
- enum: PascalCase (예: `UserRole`, `PostStatus`)

## 새 페이지 추가 가이드

1. **폴더 생성**: `/src/app/새로운-페이지` 디렉토리 생성
2. **페이지 파일 작성**: `page.tsx` 파일 생성
3. **필요시 레이아웃 추가**: `layout.tsx` 파일 작성 (선택적)
4. **페이지별 API 라우트**: `/src/app/api/새로운-페이지` 디렉토리 생성 (필요시)

## 빌드 및 실행

### 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 프로덕션 빌드

```bash
# 빌드
npm run build

# 실행
npm start
```

## 환경 변수

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 문제 해결 가이드

### 1. 서버 컴포넌트에서 클라이언트 훅 사용 오류

**문제**: `Error: useState/useEffect/etc. can only be used in Client Components`

**해결 방법**:

- 컴포넌트 파일 상단에 `"use client"` 추가
- 또는 훅을 사용하는 로직을 별도의 클라이언트 컴포넌트로 분리

### 2. TypeScript 경로 별칭(Path Alias) 오류

**문제**: `Cannot find module '@components/...'`

**해결 방법**:

- `tsconfig.json`에 경로가 올바르게 설정되어 있는지 확인
- 프로젝트를 재시작하거나 타입스크립트 서버를 재시작

### 3. Supabase 인증 오류

**문제**: 인증 토큰이 갱신되지 않거나 세션이 유지되지 않음

**해결 방법**:

- 쿠키 설정을 확인
- 토큰 갱신 로직 디버깅
- Supabase 클라이언트 설정 확인

## 주의사항 및 향후 계획

### 권한 시스템 주의사항

1. **권한 체크 중앙화**: 모든 권한 체크는 AuthGuard, LoginGuard, usePermission을 통해 처리
2. **JWT 토큰 우선순위**: JWT 토큰 정보를 우선 사용하되, Redux 상태를 백업으로 활용
3. **페이지 레벨 보호**: layout.tsx에서 권한 체크를 우선 적용하여 일관성 확보
4. **콘솔 로그 금지**: 프로덕션 코드에서는 개발용 console.log 사용 금지
5. **타입 안전성**: User 타입은 항상 `User | null` 형태로 일관성 유지

### 향후 계획

1. SSR(서버 사이드 렌더링) 완전 분리 및 구조 설계 필요
2. 서버 컴포넌트와 클라이언트 컴포넌트의 명확한 구분
3. 데이터 페칭 전략 개선
4. 테스트 코드 도입
5. CI/CD 파이프라인 구축
6. 권한 시스템 성능 최적화 및 캐싱 전략 개선

## 유용한 링크

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Next.js 앱 라우터 가이드](https://nextjs.org/docs/app)
- [Supabase 문서](https://supabase.io/docs)
- [React Query 문서](https://tanstack.com/query/latest/docs/react/overview)
- [Redux Toolkit 문서](https://redux-toolkit.js.org/introduction/getting-started)

## 브랜치 관리 정책

본 프로젝트는 다음과 같은 브랜치 관리 정책을 따릅니다:

### 브랜치 구조

- **main**: 프로덕션 릴리스 브랜치. 안정적인 코드만 포함
- **dev**: 개발 브랜치. 모든 기능 개발이 통합되는 브랜치
- \*\*task-26: 개별 기능 개발 브랜치 (예: task-26, task-28)
- **fix/\***: 버그 수정 브랜치 (예: fix/login-error)

### 브랜치 보호 규칙

- **main 브랜치 보호**: main 브랜치는 직접 커밋이 불가능하며, 반드시 dev 브랜치에서 Pull Request를 통해서만 병합이 가능합니다.
- **코드 리뷰 필수**: 모든 Pull Request는 최소 1명 이상의 리뷰어 승인이 필요합니다.
- **자동화된 검사**: GitHub Actions를 통해 소스 브랜치가 dev 브랜치인지 확인하는 검사가 수행됩니다.

### 작업 흐름

1. 기능 개발 시작: dev 브랜치에서 이슈 번호를 딴 task 브랜치 생성 (`task-26`)

   ```
   git checkout dev
   git pull
   git checkout -b task-26
   ```

2. 개발 작업 수행 및 커밋

   ```
   git add .
   git commit -m "✨ #26 새로운 기능 추가"
   git push origin feature/기능명
   ```

3. 작업 완료 후: task 브랜치에서 dev 브랜치로 PR 생성 및 병합
4. 릴리스 준비: dev 브랜치에서 main 브랜치로 PR 생성 및 병합

### 커밋 메시지 규칙

본 프로젝트는 Gitmoji를 사용하여 커밋 메시지를 작성합니다:

VSCode 기반 IDE를 쓰는 경우 다음 코드를 글로벌 `settings.json` 추가해주세요.

```javascript
{
  ...,
  "gitmoji.addCustomEmoji":[
    {
        "emoji": "🎨",
        "code": ":art:",
        "description": "코드의 구조 / 형태 개선"
    },
    {
        "emoji": "⚡️",
        "code": ":zap:",
        "description": "성능 개선"
    },
    {
        "emoji": "🔥",
        "code": ":fire:",
        "description": "코드/파일 삭제"
    },
    {
        "emoji": "🐛",
        "code": ":bug:",
        "description": "버그 수정"
    },
    {
        "emoji": "🚑",
        "code": ":ambulance:",
        "description": "긴급 수정"
    },
    {
        "emoji": "✨",
        "code": ":sparkles:",
        "description": "새 기능"
    },
    {
        "emoji": "📝",
        "code": ":memo:",
        "description": "문서 추가/수정"
    },
    {
        "emoji": "💄",
        "code": ":lipstick:",
        "description": "UI/스타일 파일 추가/수정"
    },
    {
        "emoji": "🎉",
        "code": ":tada:",
        "description": "프로젝트 시작"
    },
    {
        "emoji": "✅",
        "code": ":white_check_mark:",
        "description": "테스트 추가/수정"
    },
    {
        "emoji": "🔒",
        "code": ":lock:",
        "description": "보안 이슈 수정"
    },
    {
        "emoji": "🔖",
        "code": ":bookmark:",
        "description": "릴리즈/버전 태그"
    },
    {
        "emoji": "💚",
        "code": ":green_heart:",
        "description": "CI 빌드 수정"
    },
    {
        "emoji": "📌",
        "code": ":pushpin:",
        "description": "특정 버전 의존성 고정"
    },
    {
        "emoji": "👷",
        "code": ":construction_worker:",
        "description": "CI 빌드 시스템 추가/수정"
    },
    {
        "emoji": "📈",
        "code": ":chart_with_upwards_trend:",
        "description": "분석, 추적 코드 추가/수정"
    },
    {
        "emoji": "♻️",
        "code": ":recycle:",
        "description": "코드 리팩토링"
    },
    {
        "emoji": "➕",
        "code": ":heavy_plus_sign:",
        "description": "의존성 추가"
    },
    {
        "emoji": "➖",
        "code": ":heavy_minus_sign:",
        "description": "의존성 제거"
    },
    {
        "emoji": "🔧",
        "code": ":wrench:",
        "description": "구성 파일 추가/삭제"
    },
    {
        "emoji": "🔨",
        "code": ":hammer:",
        "description": "개발 스크립트 추가/수정"
    },
    {
        "emoji": "🌐",
        "code": ":globe_with_meridians:",
        "description": "국제화/현지화"
    },
    {
        "emoji": "💩",
        "code": ":poop:",
        "description": "똥싼 코드"
    },
    {
        "emoji": "⏪",
        "code": ":rewind:",
        "description": "변경 내용 되돌리기"
    },
    {
        "emoji": "🔀",
        "code": ":twisted_rightwards_arrows:",
        "description": "브랜치 합병"
    },
    {
        "emoji": "📦",
        "code": ":package:",
        "description": "컴파일된 파일 추가/수정"
    },
    {
        "emoji": "👽",
        "code": ":alien:",
        "description": "외부 API 변화로 인한 수정"
    },
    {
        "emoji": "🚚",
        "code": ":truck:",
        "description": "리소스 이동, 이름 변경"
    },
    {
        "emoji": "📄",
        "code": ":page_facing_up:",
        "description": "라이센스 추가/수정"
    },
    {
        "emoji": "💡",
        "code": ":bulb:",
        "description": "주석 추가/수정"
    },
    {
        "emoji": "🍻",
        "code": ":beers:",
        "description": "술 취해서 쓴 코드"
    },
    {
        "emoji": "🗃",
        "code": ":card_file_box:",
        "description": "데이버베이스 관련 수정"
    },
    {
        "emoji": "🔊",
        "code": ":loud_sound:",
        "description": "로그 추가/수정"
    },
    {
        "emoji": "🙈",
        "code": ":see_no_evil:",
        "description": ".gitignore 추가/수정"
    }
  ]
}
```
