# Changelog

모든 주목할만한 변경사항이 이 파일에 기록됩니다.

이 프로젝트는 [Semantic Versioning](https://semver.org/spec/v2.0.0.html) 및 [Gitmoji](https://gitmoji.dev/) 기반 자동 버저닝을 준수합니다.

## [2.0.0] - 2025-01-19

### 💥 Breaking Changes

**아키텍처 전면 개편** - UI 컴포넌트를 제거하고 훅/유틸리티/서비스 중심으로 재설계

#### ❌ Removed
- **모든 UI 컴포넌트 제거**
  - `Button`, `Badge`, `Avatar` 등 모든 UI 컴포넌트
  - 스타일 시스템 및 테마 관련 기능
  - Storybook 및 UI 문서
  - UI 컴포넌트는 이제 Next.js 앱에서 직접 구현

- **Redux Toolkit 제거**
  - `@reduxjs/toolkit` 의존성 제거
  - Redux store 및 slice 제거
  - ~32KB 번들 사이즈 감소

#### 🔄 Changed
- **상태 관리 시스템 변경**
  - Redux Toolkit → Zustand 마이그레이션
  - 83% 번들 사이즈 감소 (32KB → 8KB)
  - 더 간단한 API와 향상된 성능

- **패키지 구조 재편**
  ```
  lib/
  ├── hooks/       # React Hooks (auth, queries, realtime, utils)
  ├── services/    # API 서비스 레이어
  ├── stores/      # Zustand 상태 관리
  ├── utils/       # 순수 유틸리티 함수
  ├── types/       # TypeScript 타입 정의
  └── providers/   # React Context Providers
  ```

### ✨ Added

#### 🪝 새로운 Hook 시스템
- **인증 훅**
  - `useAuth` - Supabase 인증 통합
  - `usePermission` - 레벨 기반 권한 체크
  - `useAuthGuard` - 라우트 보호

- **데이터 페칭 훅** (React Query v5)
  - `useUser` - 사용자 데이터 페칭
  - `usePosts` - 게시물 목록/상세
  - `useComments` - 댓글 관리
  - `useInfiniteScroll` - 무한 스크롤

- **실시간 훅** (Supabase Realtime)
  - `useRealtimeChat` - 실시간 채팅
  - `useRealtimePresence` - 사용자 프레전스
  - `useRealtimeUpdates` - 실시간 업데이트

- **유틸리티 훅**
  - `useDebounce` - 디바운스 처리
  - `useThrottle` - 쓰로틀 처리
  - `useLocalStorage` - 로컬 스토리지 동기화
  - `usePrevious` - 이전 값 추적
  - `useMediaQuery` - 반응형 쿼리

#### 🔧 서비스 레이어
- **BaseService** - Axios 기반 HTTP 통신 추상화
  - 자동 토큰 갱신 (interceptors)
  - 에러 처리 표준화
  - 요청/응답 타입 안전성

- **도메인 서비스**
  - `AuthService` - 인증/인가 처리
  - `UserService` - 사용자 관리
  - `PostService` - 게시물 CRUD
  - `ChatService` - 채팅 기능
  - `NotificationService` - 알림 처리

#### 🗄️ Zustand Stores
- `useAuthStore` - 인증 상태 전역 관리
- `useUIStore` - UI 상태 (모달, 토스트 등)
- `useAppStore` - 앱 전역 상태
- `useRealtimeStore` - 실시간 연결 상태

#### 🛠️ 향상된 유틸리티
- **포맷터**
  - `formatDate` - 다국어 날짜 포맷
  - `formatNumber` - 로케일별 숫자 포맷
  - `formatCurrency` - 통화 포맷

- **검증**
  - `validateEmail` - 이메일 검증
  - `validatePassword` - 비밀번호 강도 체크
  - `validateUsername` - 사용자명 규칙 검증

- **헬퍼**
  - `debounce` - 함수 디바운스
  - `throttle` - 함수 쓰로틀
  - `retry` - 자동 재시도 로직
  - `memoize` - 함수 메모이제이션

### 🚀 Improvements
- **성능 최적화**
  - 번들 크기 75% 감소
  - Tree-shaking 완벽 지원
  - React 18 Suspense 통합
  - Concurrent Features 활용

- **개발자 경험**
  - TypeScript 5.0+ 완전 지원
  - 자동 타입 추론 개선
  - 더 나은 IntelliSense
  - 상세한 JSDoc 문서

- **보안 강화**
  - Supabase RLS 통합
  - JWT 자동 갱신
  - XSS/CSRF 보호
  - 환경 변수 기반 설정

### 📚 Documentation
- 새로운 아키텍처 가이드 (ARCHITECTURE.md)
- 마이그레이션 가이드 (MIGRATION.md)
- 상세한 API 레퍼런스
- 실제 사용 예제 추가

### 🎯 Migration Guide
v1.x에서 v2.0으로 마이그레이션하려면 [MIGRATION.md](./MIGRATION.md)를 참조하세요.

주요 변경사항:
1. 모든 UI 컴포넌트 import 제거
2. Redux 코드를 Zustand로 마이그레이션
3. 새로운 Provider 설정
4. Hook 기반 API로 전환

---

## [1.9.0] - 2024-12-01

### ✨ Added
- `Tooltip` 컴포넌트 - 호버/클릭 툴팁 지원
- `AnimatedPoint` 컴포넌트 - 애니메이션 포인트 인디케이터

---

## [1.0.0] - 2024-08-22

### 🎉 Initial Release
**@team-semicolon/community-core v1.0.0** 정식 출시

[이전 버전 내용은 아카이브됨]

---

## Gitmoji 버저닝 규칙

### 자동 버전 업데이트 트리거

| Gitmoji | 의미 | 버전 변경 | 예시 |
|---------|------|-----------|------|
| 💥 `:boom:` | Breaking Change | **MAJOR** (X.0.0) | `2.0.0` |
| ✨ `:sparkles:` | 새로운 기능 | **MINOR** (0.X.0) | `2.1.0` |
| 🚀 `:rocket:` | 성능 개선 | **MINOR** (0.X.0) | `2.1.0` |
| 🐛 `:bug:` | 버그 수정 | **PATCH** (0.0.X) | `2.0.1` |
| 🔧 `:wrench:` | 설정 변경 | **PATCH** (0.0.X) | `2.0.1` |
| 📝 `:memo:` | 문서 업데이트 | **PATCH** (0.0.X) | `2.0.1` |
| ♻️ `:recycle:` | 리팩토링 | **PATCH** (0.0.X) | `2.0.1` |
| 🎨 `:art:` | 코드 구조 개선 | **PATCH** (0.0.X) | `2.0.1` |

### 커밋 예시
```bash
git commit -m "✨ Add useRealtimeChat hook for real-time messaging"
# → 자동으로 MINOR 버전 증가 (2.0.0 → 2.1.0)

git commit -m "💥 Remove all UI components, focus on hooks only"
# → 자동으로 MAJOR 버전 증가 (2.1.0 → 3.0.0)

git commit -m "🐛 Fix authentication token refresh issue"
# → 자동으로 PATCH 버전 증가 (2.0.0 → 2.0.1)
```

---

> 이 CHANGELOG는 [Keep a Changelog](https://keepachangelog.com/) 및 [Gitmoji](https://gitmoji.dev/) 형식을 따릅니다.