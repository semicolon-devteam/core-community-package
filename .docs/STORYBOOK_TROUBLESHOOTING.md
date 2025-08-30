# Storybook 문제 해결 가이드

## 🚨 가장 흔한 에러: `Failed to fetch dynamically imported module`

이 에러는 Storybook에서 패키지 컴포넌트를 import할 때 발생하는 가장 일반적인 문제입니다.

## ✅ 해결된 상태 확인

다음 작업들이 완료되어 있습니다:

### 1. Board.stories.tsx Import 수정
- ❌ **이전**: `import { Board } from '@team-semicolon/community-core'`
- ✅ **수정**: `import Board from '../../../../lib/components/molecules/Board'`

### 2. Storybook 설정 최적화
- `.storybook/main.ts`에 alias 추가:
  ```typescript
  resolve: {
    alias: {
      '@team-semicolon/community-core': '../lib',
      '@': '../lib',
    },
  }
  ```

### 3. Import 경로 표준화
모든 Board 관련 컴포넌트를 직접 소스에서 import:
```typescript
import Board from '../../../../lib/components/molecules/Board';
import BoardContainer from '../../../../lib/components/molecules/Board/Container';
import BoardHeader from '../../../../lib/components/molecules/Board/Header';
import BoardPagination from '../../../../lib/components/molecules/Board/Pagination';
import BoardTable from '../../../../lib/components/molecules/Board/Table';
import BoardWrapper from '../../../../lib/components/molecules/Board/Wrapper';
import type { 
  BoardCategory,
  BoardPostItem 
} from '../../../../lib/components/molecules/Board/types';
```

## 🔍 에러 발생 시 진단 단계

### 1단계: Import 경로 확인
```bash
# 파일 존재 여부 확인
ls -la lib/components/molecules/Board/
ls -la lib/components/molecules/Board/types.ts
```

### 2단계: 상대 경로 검증
Storybook 스토리 파일에서 컴포넌트까지의 경로가 정확한지 확인:
```
storybook/src/stories/molecules/Board.stories.tsx
→ ../../../../lib/components/molecules/Board
```

### 3단계: Storybook 서버 재시작
```bash
# 현재 Storybook 서버 종료 후 재시작
npm run storybook
```

### 4단계: 캐시 클리어
```bash
# Vite 캐시 클리어
rm -rf node_modules/.vite
rm -rf storybook/node_modules/.vite
npm run storybook
```

### 5단계: 패키지 빌드 상태 확인
```bash
# 루트에서 패키지 빌드
npm run build
ls -la dist/

# 빌드 결과 확인
cat dist/index.js | grep -i "board" | head -5
```

## 🎯 예방 가이드라인

### 새 컴포넌트 스토리 작성 시
1. **절대 패키지 이름으로 import하지 않기**
   ```typescript
   // ❌ 피해야 할 방식
   import { NewComponent } from '@team-semicolon/community-core';
   
   // ✅ 올바른 방식
   import NewComponent from '../../../../lib/components/atoms/NewComponent';
   ```

2. **타입도 소스에서 직접 import**
   ```typescript
   // ✅ 올바른 방식
   import type { NewComponentProps } from '../../../../lib/components/atoms/NewComponent/types';
   ```

3. **즉시 테스트**
   - 스토리 작성 후 바로 브라우저에서 확인
   - 에러 발생 시 즉시 수정

## 🔄 표준 워크플로우

### 1. 새 컴포넌트 개발
```bash
# 1. 컴포넌트 개발 완료 후
# 2. lib/index.ts에 export 추가
# 3. 패키지 빌드 테스트
npm run build
```

### 2. Storybook 스토리 작성
```bash
# 1. 스토리 파일 생성
touch storybook/src/stories/{category}/{ComponentName}.stories.tsx

# 2. 직접 import 경로로 작성
# 3. 즉시 테스트
npm run storybook
```

### 3. 검증 및 문서화
```bash
# 1. 브라우저에서 모든 스토리 정상 렌더링 확인
# 2. props 제어 정상 동작 확인
# 3. 문서 업데이트
```

## 🛠️ 고급 문제 해결

### TypeScript 에러
```bash
# TypeScript 컴파일 에러 확인
npx tsc --noEmit

# 특정 컴포넌트 타입 체크
npx tsc --noEmit lib/components/molecules/Board/index.tsx
```

### Next.js 호환성 문제
```typescript
// 'use client' 지시어가 있는 컴포넌트의 경우
// Storybook에서는 문제없이 동작하지만 SSR 환경에서 주의 필요
```

### 의존성 문제
```bash
# 누락된 의존성 확인
npm ls --depth=0 | grep -E "(react|next)"

# storybook 의존성 확인
cd storybook && npm ls --depth=0
```

## 📋 체크리스트 템플릿

새 컴포넌트 스토리 작성 시 사용할 체크리스트:

- [ ] 컴포넌트가 lib 폴더에 올바르게 위치해 있음
- [ ] lib/index.ts에 export 추가됨
- [ ] npm run build 성공
- [ ] 스토리에서 직접 import 경로 사용
- [ ] 타입도 소스에서 직접 import
- [ ] npm run storybook으로 즉시 테스트
- [ ] 브라우저에서 모든 스토리 정상 렌더링 확인
- [ ] Props 제어가 정상 동작함
- [ ] 모바일/데스크탑 뷰 모두 확인
- [ ] Console 에러 없음

## 🚀 성능 최적화 팁

1. **Import 최적화**: 필요한 컴포넌트만 개별 import
2. **캐시 활용**: 개발 중에는 캐시 클리어 최소화
3. **Hot Reload**: Storybook의 HMR 기능 적극 활용
4. **빌드 검증**: 정기적으로 `npm run build` 실행하여 패키지 상태 확인

## 🤝 팀 협업 가이드

- **문제 발생 시**: 먼저 이 가이드의 단계별 진단 수행
- **새로운 에러 발견 시**: 이 문서에 추가하여 팀 전체와 공유
- **성공 사례**: 문제 해결 방법을 문서화하여 재발 방지

---

**📝 마지막 업데이트**: Board 컴포넌트 패키지화 완료 (2024)
**🔗 관련 문서**: CLAUDE.md의 "Storybook 동기화 규칙" 섹션 참조