# 🔄 마이그레이션 가이드

## 📋 목차
- [v1.x에서 v2.0으로](#v1x에서-v20으로)
- [Breaking Changes](#breaking-changes)
- [새로운 기능](#새로운-기능)
- [마이그레이션 단계](#마이그레이션-단계)

## v1.x에서 v2.0으로

### Breaking Changes

#### 1. Import 경로 변경

**이전 (v1.x)**:
```typescript
import { Button } from '@team-semicolon/community-core/dist/components/atoms/Button';
import { useAuth } from '@team-semicolon/community-core/dist/hooks/common/useAuth';
```

**현재 (v2.0)**:
```typescript
import { Button, useAuth } from '@team-semicolon/community-core';
// 또는 카테고리별
import { Button } from '@team-semicolon/community-core/components';
import { useAuth } from '@team-semicolon/community-core/hooks';
```

#### 2. Service API 변경

**이전 (v1.x)**:
```typescript
// 함수형 API
import { userService } from '@team-semicolon/community-core';
const user = await userService.getMyInfo();
```

**현재 (v2.0)**:
```typescript
// 클래스 기반 API (권장)
import { UserService } from '@team-semicolon/community-core';
const userService = new UserService();
const user = await userService.getMyInfo();

// 레거시 지원 (deprecated)
import { userService } from '@team-semicolon/community-core/legacy';
```

#### 3. 컴포넌트 Props 변경

**Button 컴포넌트**:
```typescript
// 이전
<Button type="primary" size="large" />

// 현재
<Button variant="primary" size="lg" />
```

**Input 컴포넌트**:
```typescript
// 이전
<Input hasError errorMessage="오류" />

// 현재
<Input error="오류" />
```

### 새로운 기능

#### 1. 메시징 시스템
```typescript
import { MessageService, useMessagesQuery } from '@team-semicolon/community-core';

// 메시지 서비스
const messageService = new MessageService();
await messageService.sendMessage({ content, recipientId });

// React Hook
const { data: messages } = useMessagesQuery(userId);
```

#### 2. 실시간 기능
```typescript
import { RealtimeService, useRealtimeSubscription } from '@team-semicolon/community-core';

// 실시간 구독
const { subscribe, unsubscribe } = useRealtimeSubscription('channel-name');
```

#### 3. 향상된 TypeScript 지원
```typescript
// 모든 컴포넌트와 훅에 완전한 타입 지원
import type { ButtonProps, User, CommonResponse } from '@team-semicolon/community-core';
```

## 마이그레이션 단계

### 1단계: 패키지 업데이트
```bash
npm install @team-semicolon/community-core@^2.0.0
```

### 2단계: Import 문 수정
```bash
# 자동 마이그레이션 스크립트 (제공 예정)
npx @team-semicolon/community-core-migrate
```

수동 수정:
1. 모든 `/dist/` 경로 제거
2. 카테고리별 import로 변경

### 3단계: Service 클래스 마이그레이션

```typescript
// migration.ts
import { UserService as NewUserService } from '@team-semicolon/community-core';
import { userService as legacyUserService } from '@team-semicolon/community-core/legacy';

// 점진적 마이그레이션
export const userService = process.env.USE_NEW_API 
  ? new NewUserService()
  : legacyUserService;
```

### 4단계: 컴포넌트 Props 업데이트

VSCode에서 찾기 및 바꾸기:
- `type="primary"` → `variant="primary"`
- `size="large"` → `size="lg"`
- `hasError` → `error`

### 5단계: 테스트 및 검증

```bash
# TypeScript 타입 체크
npm run type-check

# 테스트 실행
npm test

# 빌드 검증
npm run build
```

## 주요 변경사항 요약

| 기능 | v1.x | v2.0 |
|------|------|------|
| Import 방식 | 내부 경로 직접 참조 | 패키지 루트에서 import |
| Service API | 함수형 | 클래스 기반 |
| TypeScript | 부분 지원 | 완전 지원 |
| Tree Shaking | 제한적 | 완전 지원 |
| 번들 크기 | ~150KB | ~100KB |
| 실시간 기능 | ❌ | ✅ |
| 메시징 | ❌ | ✅ |

## 도움말 및 지원

- **마이그레이션 이슈**: GitHub Issues에 `migration` 태그로 등록
- **질문**: GitHub Discussions 활용
- **긴급 지원**: 팀 슬랙 채널 #community-core-support

## 레거시 지원

v1.x는 2025년 6월까지 보안 패치만 제공됩니다.
- 신규 기능 추가: ❌
- 버그 수정: 2025년 3월까지
- 보안 패치: 2025년 6월까지