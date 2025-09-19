# 🚀 개발 가이드

## 📋 목차
- [개발 환경 설정](#개발-환경-설정)
- [프로젝트 구조](#프로젝트-구조)
- [개발 워크플로우](#개발-워크플로우)
- [코딩 컨벤션](#코딩-컨벤션)
- [테스트](#테스트)
- [배포](#배포)

## 개발 환경 설정

### 필수 요구사항
- Node.js 18.x 이상
- npm 9.x 이상
- Git 2.x 이상
- TypeScript 5.0 이상

### 초기 설정

```bash
# 레포지토리 클론
git clone https://github.com/team-semicolon/community-core.git
cd core-community-package

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY 설정
```

### VS Code 설정

**필수 확장 프로그램**:
- ESLint
- Prettier
- TypeScript and JavaScript Language Features

**권장 설정** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

## 프로젝트 구조

### v2.0 아키텍처

```
core-community-package/
├── lib/                    # 소스 코드 (src/ 대신)
│   ├── hooks/             # React Hooks
│   │   ├── auth/          # 인증 관련 훅
│   │   ├── queries/       # React Query 데이터 페칭
│   │   ├── realtime/      # Supabase Realtime 훅
│   │   └── utils/         # 유틸리티 훅
│   ├── services/          # API 서비스 레이어
│   │   ├── base/          # BaseService (Axios 추상화)
│   │   ├── auth/          # AuthService
│   │   └── domain/        # 도메인별 서비스
│   ├── stores/            # Zustand 상태 관리
│   │   ├── auth/          # 인증 스토어
│   │   └── ui/            # UI 상태 스토어
│   ├── utils/             # 순수 유틸리티 함수
│   │   ├── formatters/    # 포맷팅 함수
│   │   ├── validators/    # 검증 함수
│   │   └── helpers/       # 헬퍼 함수
│   ├── types/             # TypeScript 타입 정의
│   ├── providers/         # React Context Providers
│   ├── constants/         # 상수 정의
│   └── index.ts           # 메인 엔트리 포인트
├── dist/                   # 빌드 출력
├── docs/                   # 문서
├── scripts/                # 빌드/배포 스크립트
└── rollup.config.js        # Rollup 설정
```

## 개발 워크플로우

### 1. 브랜치 전략

```bash
# 기능 개발
git checkout -b feature/hook-name

# 버그 수정
git checkout -b fix/issue-number

# 문서 작업
git checkout -b docs/update-name
```

### 2. 새로운 Hook 추가

```bash
# 1. Hook 파일 생성
touch lib/hooks/auth/useNewAuth.ts

# 2. 타입 정의
touch lib/types/auth.types.ts

# 3. 테스트 파일 생성
touch lib/hooks/auth/__tests__/useNewAuth.test.ts

# 4. Export 추가
echo "export { useNewAuth } from './auth/useNewAuth';" >> lib/hooks/index.ts
```

**Hook 구현 예시**:
```typescript
// lib/hooks/auth/useNewAuth.ts
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import type { AuthState } from '@/types';

export function useNewAuth() {
  const { user, isLoading } = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  return {
    isAuthenticated,
    isLoading,
    user
  };
}
```

### 3. 새로운 Service 추가

```bash
# 1. Service 클래스 생성
touch lib/services/domain/NewService.ts

# 2. BaseService 확장
```

```typescript
// lib/services/domain/NewService.ts
import { BaseService } from '../base/BaseService';
import type { NewData, CommonResponse } from '@/types';

export class NewService extends BaseService {
  constructor() {
    super();
  }

  async getData(id: string): Promise<CommonResponse<NewData>> {
    return this.get(`/api/new/${id}`);
  }

  async createData(data: Partial<NewData>): Promise<CommonResponse<NewData>> {
    return this.post('/api/new', data);
  }
}
```

### 4. Zustand Store 추가

```typescript
// lib/stores/newStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface NewState {
  data: any[];
  isLoading: boolean;
  error: Error | null;
  fetchData: () => Promise<void>;
  reset: () => void;
}

export const useNewStore = create<NewState>()(
  devtools(
    persist(
      (set) => ({
        data: [],
        isLoading: false,
        error: null,

        fetchData: async () => {
          set({ isLoading: true });
          try {
            // API 호출
            const response = await fetch('/api/data');
            const data = await response.json();
            set({ data, isLoading: false });
          } catch (error) {
            set({ error: error as Error, isLoading: false });
          }
        },

        reset: () => set({ data: [], error: null }),
      }),
      {
        name: 'new-storage',
      }
    )
  )
);
```

### 5. 빌드 및 테스트

```bash
# 개발 모드 (watch)
npm run dev

# TypeScript 타입 체크
npm run type-check

# 테스트 실행
npm test

# 빌드
npm run build
```

## 코딩 컨벤션

### TypeScript

```typescript
// ✅ 명시적 타입 선언
export interface UserData {
  id: string;
  name: string;
  email?: string; // Optional은 명시적으로
}

// ✅ 함수 타입 시그니처
type FetchUser = (id: string) => Promise<UserData>;

// ✅ Enum 대신 const assertion
export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];
```

### React Hooks

```typescript
// ✅ Hook 네이밍: use로 시작
export function useCustomHook() {
  // ✅ Early return
  if (!condition) return null;

  // ✅ 의존성 배열 명시
  useEffect(() => {
    // effect
  }, [dependency]);

  // ✅ 객체 반환으로 확장성 확보
  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
```

### 서비스 클래스

```typescript
// ✅ 단일 책임 원칙
export class UserService extends BaseService {
  // ✅ 메서드별 타입 정의
  async getUser(id: string): Promise<CommonResponse<User>> {
    return this.get(`/users/${id}`);
  }

  // ✅ 에러 처리는 BaseService에서
  async updateUser(id: string, data: Partial<User>): Promise<CommonResponse<User>> {
    return this.put(`/users/${id}`, data);
  }
}
```

## 테스트

### 유닛 테스트

```bash
# 전체 테스트
npm test

# Watch 모드
npm test -- --watch

# 커버리지
npm test -- --coverage
```

### Hook 테스트 예시

```typescript
// lib/hooks/__tests__/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../auth/useAuth';

describe('useAuth', () => {
  it('should initialize with null user', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
  });

  it('should sign in user', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn({
        email: 'test@example.com',
        password: 'password',
      });
    });

    expect(result.current.user).toBeDefined();
  });
});
```

## 배포

### 버전 관리 (Gitmoji)

```bash
# Breaking Change → Major
git commit -m "💥 Remove all UI components"
npm version major

# 새 기능 → Minor
git commit -m "✨ Add useRealtimeChat hook"
npm version minor

# 버그 수정 → Patch
git commit -m "🐛 Fix authentication token refresh"
npm version patch
```

### NPM 배포 프로세스

```bash
# 1. 빌드 및 테스트
npm run build
npm test

# 2. 버전 업데이트
npm version minor # or major/patch

# 3. Git 태그 푸시
git push origin main --tags

# 4. NPM 배포
npm publish --access public
```

### 배포 체크리스트

- [ ] 모든 테스트 통과
- [ ] TypeScript 타입 체크 통과
- [ ] CHANGELOG.md 업데이트
- [ ] 버전 번호 업데이트
- [ ] Git 태그 생성
- [ ] CI/CD 파이프라인 통과

## GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run type-check
      - run: npm test
      - run: npm run build
```

## 문제 해결

### 일반적인 이슈

#### 빌드 실패
```bash
# 클린 빌드
rm -rf dist node_modules package-lock.json
npm install
npm run build
```

#### TypeScript 에러
```bash
# 타입 캐시 정리
rm -rf dist
npx tsc --noEmit
```

#### 의존성 충돌
```bash
# 의존성 트리 확인
npm ls
# 중복 제거
npm dedupe
```

### 디버깅

**VS Code 디버깅 설정** (`.vscode/launch.json`):
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["test", "--", "--inspect-brk"],
      "port": 9229
    }
  ]
}
```

## 기여 가이드

1. Fork 후 feature 브랜치 생성
2. 코드 작성 및 테스트 추가
3. Commit (Gitmoji 사용)
4. Pull Request 생성
5. Code Review
6. Merge

## 지원

- **Issues**: [GitHub Issues](https://github.com/team-semicolon/community-core/issues)
- **Discussions**: [GitHub Discussions](https://github.com/team-semicolon/community-core/discussions)
- **Email**: dev@team-semicolon.com

---

> 📝 이 문서는 v2.0.0 기준으로 작성되었습니다.