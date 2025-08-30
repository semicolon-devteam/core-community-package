# 🚀 커뮤니티 플랫폼 코어 패키지 생성 가이드

이 가이드는 현재 프로젝트를 클론/포크하여 재사용 가능한 노드 패키지로 변환하는 완전한 프로세스를 제공합니다.

## 📋 목차
1. [프로젝트 클론 및 초기 설정](#1-프로젝트-클론-및-초기-설정)
2. [패키지 구조로 변환](#2-패키지-구조로-변환)
3. [빌드 시스템 구성](#3-빌드-시스템-구성)
4. [NPM 패키지 배포](#4-npm-패키지-배포)
5. [원본 프로젝트에서 사용하기](#5-원본-프로젝트에서-사용하기)

---

## 1. 프로젝트 클론 및 초기 설정

### Step 1.1: 레포지토리 클론
```bash
# 새로운 패키지 레포지토리 생성
git clone https://github.com/[your-username]/fe-client.git community-core
cd community-core

# 기존 git 히스토리 제거 (선택사항)
rm -rf .git
git init
git remote add origin https://github.com/[your-username]/community-core.git
```

### Step 1.2: 브랜치 생성
```bash
git checkout -b package-conversion
git add .
git commit -m "Initial commit for package conversion"
```

---

## 2. 패키지 구조로 변환

### Step 2.1: 디렉토리 구조 재구성

현재 구조에서 패키지 구조로 변환:

```bash
# 새로운 디렉토리 구조 생성
mkdir -p lib/components/atoms
mkdir -p lib/components/molecules  
mkdir -p lib/components/organisms
mkdir -p lib/hooks
mkdir -p lib/services
mkdir -p lib/utils
mkdir -p lib/types
mkdir -p lib/redux
mkdir -p lib/styles
```

### Step 2.2: 핵심 파일 이동 스크립트

`scripts/reorganize.sh` 파일 생성:

```bash
#!/bin/bash

# 컴포넌트 이동
cp -r src/component/atoms/* lib/components/atoms/
cp -r src/component/molecules/* lib/components/molecules/
cp -r src/component/organisms/* lib/components/organisms/

# 훅 이동
cp -r src/hooks/common/* lib/hooks/
cp -r src/hooks/queries/* lib/hooks/queries/
cp -r src/hooks/commands/* lib/hooks/commands/

# 서비스 이동
cp src/services/baseService.ts lib/services/
cp src/services/userService.ts lib/services/
# 기타 필요한 서비스들...

# 유틸리티 이동
cp -r src/util/* lib/utils/

# 타입 정의 이동
cp -r src/model/* lib/types/

# Redux 이동
cp -r src/redux/Features/* lib/redux/
cp -r src/redux/stores/* lib/redux/

# 스타일 이동
cp src/app/globals.css lib/styles/
```

### Step 2.3: package.json 재구성

```json
{
  "name": "@yongjung/community-core",
  "version": "1.0.0",
  "description": "Community platform core components and utilities",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "exports": {
    ".": {
      "require": "./dist/index.js",
      "import": "./dist/index.esm.js",
      "types": "./dist/index.d.ts"
    },
    "./components": {
      "require": "./dist/components/index.js",
      "import": "./dist/components/index.esm.js",
      "types": "./dist/components/index.d.ts"
    },
    "./hooks": {
      "require": "./dist/hooks/index.js",
      "import": "./dist/hooks/index.esm.js",
      "types": "./dist/hooks/index.d.ts"
    },
    "./services": {
      "require": "./dist/services/index.js",
      "import": "./dist/services/index.esm.js",
      "types": "./dist/services/index.d.ts"
    },
    "./utils": {
      "require": "./dist/utils/index.js",
      "import": "./dist/utils/index.esm.js",
      "types": "./dist/utils/index.d.ts"
    },
    "./styles": {
      "import": "./dist/styles/globals.css"
    }
  },
  "scripts": {
    "build": "npm run clean && npm run build:lib",
    "build:lib": "rollup -c",
    "clean": "rm -rf dist",
    "prepublishOnly": "npm run build",
    "test": "vitest",
    "type-check": "tsc --noEmit",
    "dev": "rollup -c -w"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "next": "^13.0.0 || ^14.0.0 || ^15.0.0"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.5.1",
    "@supabase/supabase-js": "^2.48.1",
    "@tanstack/react-query": "^5.69.0",
    "axios": "^1.8.1",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "@rollup/plugin-commonjs": "^25.0.0",
    "@rollup/plugin-node-resolve": "^15.0.0",
    "@rollup/plugin-typescript": "^11.0.0",
    "@rollup/plugin-json": "^6.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "rollup": "^4.0.0",
    "rollup-plugin-postcss": "^4.0.0",
    "rollup-plugin-peer-deps-external": "^2.2.4",
    "rollup-plugin-terser": "^7.0.0",
    "tslib": "^2.6.0",
    "typescript": "^5.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/[your-username]/community-core"
  },
  "keywords": [
    "react",
    "nextjs",
    "community",
    "components",
    "ui"
  ],
  "author": "Your Name",
  "license": "MIT"
}
```

---

## 3. 빌드 시스템 구성

### Step 3.1: Rollup 설정 (rollup.config.js)

```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';

const packageJson = require('./package.json');

export default [
  {
    input: 'lib/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist',
        exclude: ['**/*.test.tsx', '**/*.test.ts', '**/*.stories.tsx'],
      }),
      json(),
      postcss({
        extensions: ['.css'],
        minimize: true,
        extract: 'styles/globals.css',
      }),
      terser(),
    ],
    external: ['react', 'react-dom', 'next'],
  },
  // 추가 엔트리 포인트들
  {
    input: 'lib/components/index.ts',
    output: [
      {
        file: 'dist/components/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/components/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
      }),
      terser(),
    ],
    external: ['react', 'react-dom'],
  },
];
```

### Step 3.2: TypeScript 설정 (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./lib",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "paths": {
      "@components/*": ["./lib/components/*"],
      "@hooks/*": ["./lib/hooks/*"],
      "@services/*": ["./lib/services/*"],
      "@utils/*": ["./lib/utils/*"],
      "@types/*": ["./lib/types/*"],
      "@redux/*": ["./lib/redux/*"]
    }
  },
  "include": ["lib/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.stories.tsx"
  ]
}
```

### Step 3.3: 메인 엔트리 파일 생성 (lib/index.ts)

```typescript
// Components
export * from './components';

// Hooks
export * from './hooks';

// Services
export * from './services';

// Utils
export * from './utils';

// Types
export * from './types';

// Redux
export * from './redux';

// Re-export specific commonly used items for convenience
export { default as GlobalLoader } from './components/organisms/GlobalLoader';
export { default as useGlobalLoader } from './hooks/common/useGlobalLoader';
export { default as BaseService } from './services/baseService';
```

### Step 3.4: 각 모듈별 index 파일 생성

**lib/components/index.ts:**
```typescript
// Atoms
export { default as Button } from './atoms/Button';
export { default as Checkbox } from './atoms/Checkbox';
export { default as Icon } from './atoms/Icon';
export { default as Skeleton } from './atoms/Skeleton';
export { default as Toast } from './atoms/Toast';
export { default as VideoPlayer } from './atoms/VideoPlayer';

// Molecules
export { default as Pagination } from './molecules/Board/Pagination';
export { default as SearchBar } from './molecules/SearchBar';
export { default as UserAvatar } from './molecules/UserAvatar';
export { default as Tooltip } from './molecules/Tooltip';
export { default as LoginForm } from './molecules/LoginForm';

// Organisms
export { default as GlobalLoader } from './organisms/GlobalLoader';
export { default as Navigation } from './organisms/Navigation';
export { default as ErrorHandler } from './organisms/ErrorHandler';
export { default as AuthGuard } from './organisms/AuthGuard';
```

**lib/hooks/index.ts:**
```typescript
// Common hooks
export { default as useGlobalLoader } from './common/useGlobalLoader';
export { default as useDeviceType } from './common/useDeviceType';
export { default as usePermission } from './common/usePermission';
export { default as useAuthGuard } from './common/useAuthGuard';
export { default as useNavigation } from './common/useNavigation';

// Query hooks
export * from './queries';

// Command hooks
export * from './commands';
```

**lib/services/index.ts:**
```typescript
export { default as BaseService } from './baseService';
export { default as UserService } from './userService';
export { default as PostService } from './postService';
export { default as BoardService } from './boardService';
// ... 기타 서비스들
```

---

## 4. NPM 패키지 배포

### Step 4.1: NPM 로그인
```bash
npm login
# npm 계정 정보 입력
```

### Step 4.2: 빌드 및 테스트
```bash
# 빌드
npm run build

# 타입 체크
npm run type-check

# 테스트 실행
npm test
```

### Step 4.3: 버전 관리 및 배포
```bash
# 버전 업데이트 (patch | minor | major)
npm version patch

# NPM에 배포
npm publish --access public

# 또는 조직 스코프로 배포
npm publish --access public --scope=@yongjung
```

### Step 4.4: GitHub Package Registry 배포 (선택사항)

**.npmrc 파일:**
```
@yongjung:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

**GitHub Actions 배포 워크플로우 (.github/workflows/publish.yml):**
```yaml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'
          
      - run: npm ci
      - run: npm run build
      - run: npm test
      
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

---

## 5. 원본 프로젝트에서 사용하기

### Step 5.1: 패키지 설치
```bash
# NPM에서 설치
npm install @yongjung/community-core

# 또는 GitHub Package Registry에서 설치
npm install @yongjung/community-core --registry=https://npm.pkg.github.com

# 또는 로컬 개발 중 링크
cd /path/to/community-core
npm link
cd /path/to/fe-client
npm link @yongjung/community-core
```

### Step 5.2: 원본 프로젝트 수정

**기존 import 변경:**
```typescript
// Before
import { Button } from '@atoms/Button';
import { useGlobalLoader } from '@hooks/common/useGlobalLoader';
import BaseService from '@services/baseService';

// After
import { Button, useGlobalLoader, BaseService } from '@yongjung/community-core';
// 또는 세분화된 import
import { Button } from '@yongjung/community-core/components';
import { useGlobalLoader } from '@yongjung/community-core/hooks';
import { BaseService } from '@yongjung/community-core/services';
```

**next.config.js 수정:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@yongjung/community-core'],
  // ... 기타 설정
};

module.exports = nextConfig;
```

**tailwind.config.js 수정:**
```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@yongjung/community-core/**/*.{js,ts,jsx,tsx}',
  ],
  // ... 기타 설정
};
```

### Step 5.3: 스타일 import
```tsx
// app/layout.tsx 또는 _app.tsx
import '@yongjung/community-core/styles';
// 또는
import '@yongjung/community-core/dist/styles/globals.css';
```

---

## 6. 개발 워크플로우

### 로컬 개발 모드
```bash
# 패키지 레포에서
npm run dev

# 동시에 원본 프로젝트에서
npm run dev
```

### 버전 업데이트 프로세스
1. 패키지 레포에서 변경사항 작업
2. 빌드 및 테스트
3. 버전 업데이트 (`npm version patch/minor/major`)
4. 배포 (`npm publish`)
5. 원본 프로젝트에서 업데이트 (`npm update @yongjung/community-core`)

---

## 7. 주의사항 및 베스트 프랙티스

### ⚠️ 중요 고려사항

1. **Next.js 의존성 제거**
   - 패키지 코드에서 Next.js 특정 기능 제거
   - `next/link`, `next/image` 등을 prop으로 받도록 수정
   - 서버 컴포넌트를 클라이언트 컴포넌트로 변경

2. **환경 변수 처리**
   ```typescript
   // 패키지에서
   interface Config {
     apiUrl?: string;
     supabaseUrl?: string;
     supabaseKey?: string;
   }
   
   export const initializeCorePackage = (config: Config) => {
     // 설정 초기화
   };
   ```

3. **경로 별칭 제거**
   - 절대 경로 import 사용
   - 상대 경로로 변경

4. **Supabase 클라이언트 주입**
   ```typescript
   // 패키지에서 Supabase를 직접 import하지 않고 주입받음
   export const createServices = (supabaseClient: SupabaseClient) => {
     return {
       userService: new UserService(supabaseClient),
       postService: new PostService(supabaseClient),
       // ...
     };
   };
   ```

### 📦 패키지 크기 최적화

1. **Tree Shaking 지원**
   - ESM 빌드 제공
   - sideEffects: false 설정

2. **번들 분석**
   ```bash
   npm install --save-dev rollup-plugin-visualizer
   ```

3. **선택적 import 지원**
   ```json
   {
     "exports": {
       "./components/*": "./dist/components/*.js",
       "./hooks/*": "./dist/hooks/*.js"
     }
   }
   ```

### 🔄 마이그레이션 체크리스트

- [ ] 모든 컴포넌트를 lib/ 디렉토리로 이동
- [ ] Next.js 의존성 제거
- [ ] TypeScript 경로 별칭 업데이트
- [ ] 빌드 시스템 설정
- [ ] 테스트 실행 및 통과
- [ ] 문서화 작성
- [ ] 버전 태그 생성
- [ ] NPM 배포
- [ ] 원본 프로젝트에서 테스트

---

## 8. 문제 해결

### 일반적인 이슈들

**1. Module not found 에러**
```bash
# 캐시 정리
rm -rf node_modules package-lock.json
npm install
```

**2. TypeScript 타입 에러**
```bash
# 타입 정의 재생성
npm run build
```

**3. 스타일 미적용**
```tsx
// 스타일 import 확인
import '@yongjung/community-core/dist/styles/globals.css';
```

**4. React 버전 충돌**
```json
// peerDependencies 버전 범위 확장
"react": "^18.0.0 || ^19.0.0"
```

---

## 9. 추가 리소스

- [NPM 패키지 배포 가이드](https://docs.npmjs.com/packages-and-modules)
- [Rollup 문서](https://rollupjs.org/guide/en/)
- [TypeScript 라이브러리 작성 가이드](https://www.typescriptlang.org/docs/handbook/declaration-files/library-structures.html)
- [Semantic Versioning](https://semver.org/)

---

## 10. 지원 및 기여

질문이나 이슈가 있으시면 GitHub Issues를 통해 문의해주세요.

**기여 가이드라인:**
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request