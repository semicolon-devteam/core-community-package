# Contributing to @team-semicolon/community-core

[@team-semicolon/community-core](https://www.npmjs.com/package/@team-semicolon/community-core)에 기여해주셔서 감사합니다! 

## 📋 목차
- [행동 강령](#행동-강령)
- [기여 방법](#기여-방법)
- [개발 환경 설정](#개발-환경-설정)
- [개발 워크플로우](#개발-워크플로우)
- [코딩 컨벤션](#코딩-컨벤션)
- [Pull Request 가이드라인](#pull-request-가이드라인)
- [이슈 리포팅](#이슈-리포팅)

## 행동 강령

모든 기여자는 상호 존중과 협력의 정신으로 참여해주시기 바랍니다.

## 기여 방법

### 1. 이슈 확인
- 기존 이슈를 먼저 확인하여 중복을 피해주세요
- 새로운 기능이나 버그 수정을 시작하기 전에 이슈를 생성해주세요

### 2. Fork & Clone
```bash
# 레포지토리 Fork 후
git clone https://github.com/your-username/community-core.git
cd community-core
npm install
```

### 3. 브랜치 생성
```bash
# 기능 개발
git checkout -b feature/your-feature-name

# 버그 수정
git checkout -b fix/bug-description

# 문서 개선
git checkout -b docs/improvement-description
```

## 개발 환경 설정

### 필요 도구
- Node.js 18.x 이상
- npm 9.x 이상
- VS Code (권장)

### 초기 설정
```bash
# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# Storybook 실행
npm run storybook
```

## 개발 워크플로우

### 1. 코드 작성
```bash
# 개발 서버 실행
npm run dev

# 타입 체크
npm run type-check
```

### 2. 테스트
```bash
# 유닛 테스트
npm test

# 테스트 커버리지
npm run test:coverage
```

### 3. Storybook 문서화
모든 새로운 컴포넌트는 반드시 Storybook 스토리를 포함해야 합니다:
```bash
npm run storybook
```

### 4. 빌드 검증
```bash
# 패키지 빌드
npm run build

# 빌드 결과 확인
ls -la dist/
```

## 코딩 컨벤션

### TypeScript
- 모든 새 코드는 TypeScript로 작성
- 명시적 타입 선언 사용
- `any` 타입 사용 최소화

### 컴포넌트
```typescript
// ✅ 올바른 예시
export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  size = 'md',
  ...props 
}) => {
  // 구현
};
```

### Import/Export
```typescript
// ✅ Named export 사용 (Tree Shaking 최적화)
export { Button } from './Button';
export { Input } from './Input';

// ❌ Default export 지양
export default Button;
```

### 네이밍 컨벤션
- 컴포넌트: PascalCase (`Button`, `SearchBar`)
- 훅: camelCase with 'use' prefix (`useAuth`, `useGlobalLoader`)
- 유틸리티: camelCase (`formatNumber`, `parseDate`)
- 상수: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRY_COUNT`)

## Pull Request 가이드라인

### PR 체크리스트
- [ ] 코드가 프로젝트 스타일 가이드를 따름
- [ ] 셀프 리뷰 완료
- [ ] 테스트 추가/수정
- [ ] Storybook 스토리 추가 (컴포넌트의 경우)
- [ ] 문서 업데이트 (필요시)
- [ ] 빌드 성공 (`npm run build`)
- [ ] 타입 체크 통과 (`npm run type-check`)
- [ ] CHANGELOG.md 업데이트

### PR 제목 형식
```
[타입] 간단한 설명

예시:
[feat] Button 컴포넌트 loading 상태 추가
[fix] useAuth 훅 토큰 갱신 버그 수정
[docs] API Reference 문서 업데이트
```

### 타입 목록
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 개선
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 프로세스, 도구 설정

## 이슈 리포팅

### 버그 리포트
이슈 생성 시 다음 정보를 포함해주세요:
- 버그 설명
- 재현 방법
- 예상 동작
- 실제 동작
- 환경 정보 (OS, Node 버전, 브라우저 등)

### 기능 요청
- 해결하려는 문제 설명
- 제안하는 해결 방법
- 대안 고려사항

## 버전 관리

[Semantic Versioning](https://semver.org/)을 따릅니다:
- MAJOR: 호환성을 깨는 변경
- MINOR: 하위 호환 기능 추가
- PATCH: 하위 호환 버그 수정

## 질문 및 도움말

- GitHub Issues: 버그 리포트, 기능 요청
- Discussions: 일반적인 질문, 아이디어 공유

## 라이선스

기여하신 코드는 프로젝트의 MIT 라이선스를 따릅니다.

---

감사합니다! 🎉