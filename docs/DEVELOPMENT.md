# 🚀 개발 가이드

## 📋 목차
- [개발 환경 설정](#개발-환경-설정)
- [개발 워크플로우](#개발-워크플로우)
- [디버깅](#디버깅)
- [테스트](#테스트)
- [Storybook](#storybook)
- [배포](#배포)

## 개발 환경 설정

### 필수 요구사항
- Node.js 18.x 이상
- npm 9.x 이상
- Git 2.x 이상

### 초기 설정

```bash
# 레포지토리 클론
git clone https://github.com/semicolon-devteam/community-core.git
cd community-core

# 의존성 설치
npm install

# 환경 변수 설정 (필요한 경우)
cp .env.example .env.local
```

### VS Code 설정

추천 확장 프로그램:
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- ES7+ React/Redux/React-Native snippets

## 개발 워크플로우

### 1. 개발 서버 실행

```bash
# Rollup watch 모드로 실시간 빌드
npm run dev

# 다른 터미널에서 Storybook 실행
npm run storybook
```

### 2. 코드 작성 프로세스

#### 새 컴포넌트 추가
```bash
# 1. 컴포넌트 파일 생성
touch lib/components/atoms/NewComponent/index.tsx
touch lib/components/atoms/NewComponent/types.ts

# 2. Storybook 스토리 생성
touch storybook/src/stories/atoms/NewComponent.stories.tsx

# 3. 테스트 파일 생성
touch lib/components/atoms/NewComponent/NewComponent.test.tsx
```

#### 새 Hook 추가
```bash
# 1. Hook 파일 생성
touch lib/hooks/common/useNewHook.ts

# 2. Storybook 예시 추가
# storybook/src/stories/hooks/에 예시 추가

# 3. Export 추가
# lib/hooks/index.ts에 export 추가
```

### 3. 코드 검증

```bash
# TypeScript 타입 체크
npm run type-check

# 테스트 실행
npm test

# 빌드 테스트
npm run build
```

## 디버깅

### VS Code 디버깅 설정

`.vscode/launch.json`:
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
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### 브라우저 디버깅

Storybook에서 React Developer Tools 사용:
1. Chrome/Firefox React Developer Tools 설치
2. Storybook 실행 (`npm run storybook`)
3. 브라우저 개발자 도구에서 Components 탭 확인

## 테스트

### 유닛 테스트

```bash
# 모든 테스트 실행
npm test

# Watch 모드
npm test -- --watch

# 특정 파일만 테스트
npm test Button.test.tsx

# 커버리지 확인
npm run test:coverage
```

### 테스트 작성 예시

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Storybook

### Storybook 개발

```bash
# Storybook 실행
npm run storybook

# Storybook 빌드
npm run storybook:build
```

### 스토리 작성 가이드

```typescript
// NewComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { NewComponent } from '../../../../lib/components/atoms/NewComponent';

const meta = {
  title: 'Atoms/NewComponent',
  component: NewComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Props 제어 설정
  },
} satisfies Meta<typeof NewComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // 기본 props
  },
};
```

### Storybook 배포

```bash
# Vercel에 배포 (자동)
# main 브랜치에 push 시 자동 배포

# 수동 빌드 및 확인
npm run storybook:build
npx serve storybook-static
```

## 배포

### 버전 관리

```bash
# 패치 버전 업데이트 (1.8.1 → 1.8.2)
npm version patch

# 마이너 버전 업데이트 (1.8.1 → 1.9.0)
npm version minor

# 메이저 버전 업데이트 (1.8.1 → 2.0.0)
npm version major
```

### NPM 배포

```bash
# 1. 빌드
npm run build

# 2. 테스트 확인
npm test

# 3. 로그인 (최초 1회)
npm login

# 4. 배포
npm publish --access public
```

### 배포 체크리스트

- [ ] 모든 테스트 통과
- [ ] TypeScript 타입 체크 통과
- [ ] Storybook 빌드 성공
- [ ] CHANGELOG.md 업데이트
- [ ] package.json 버전 업데이트
- [ ] Git 태그 생성
- [ ] NPM 배포
- [ ] GitHub Release 생성

## 트러블슈팅

### 일반적인 문제 해결

#### 1. 빌드 실패
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
```

#### 2. TypeScript 에러
```bash
# TypeScript 캐시 정리
rm -rf dist
npm run type-check
```

#### 3. Storybook 에러
```bash
# Storybook 캐시 정리
rm -rf node_modules/.cache/storybook
npm run storybook
```

### 도움말

- GitHub Issues: 버그 리포트 및 기능 요청
- Discussions: 질문 및 토론
- 문서: `/docs` 디렉토리 참조