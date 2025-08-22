# Changelog

모든 주목할만한 변경사항이 이 파일에 기록됩니다.

이 프로젝트는 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)을 준수합니다.

## [1.0.0] - 2024-08-22

### 🎉 초기 릴리스

**@semicolon/community-core v1.0.0**이 정식 출시되었습니다.

#### ✨ 추가된 기능

**Core Utilities**
- `formatNumberWithComma()` - 숫자에 천 단위 쉼표 추가
- `formatDate()` - 날짜를 한국어 형식으로 포맷팅  
- `timeAgo()` - 상대적 시간 표시
- `isAdmin()` - 사용자 관리자 권한 체크

**Essential Components**
- `Button` - 완전한 기능의 버튼 컴포넌트 (5가지 variant, 로딩 상태, 아이콘 지원)
- `Badge` - 상태, 레벨, 태그 표시용 뱃지 컴포넌트
- `Avatar` - 사용자 프로필 이미지 표시 컴포넌트 (폴백, 상태 표시 지원)

**Configuration System**
- `initializeCommunityCore()` - 패키지 전역 설정 초기화 함수
- `getPackageConfig()` - 현재 설정 조회 함수

**Core Types**
- `User` 인터페이스 - 사용자 정보 타입 정의
- `CommonResponse<T>` 인터페이스 - API 응답 표준 형식
- 모든 컴포넌트별 Props 타입 정의

#### 🏗️ 아키텍처 특징

- **Atomic Design Pattern**: atoms/molecules/organisms 구조
- **Tree Shaking 최적화**: Named exports 및 개별 모듈 import 지원
- **Framework Agnostic**: Next.js 의존성 최소화
- **TypeScript First**: 완전한 타입 지원
- **Hierarchical Export Strategy**: essential → category → namespace 구조

#### 📦 Build & Distribution

- **이중 빌드**: ESM + CommonJS 모두 지원
- **Rollup 기반**: 최적화된 번들링
- **개별 모듈 export**: 세밀한 Tree Shaking 지원
- **TypeScript 선언 파일**: 완전한 IntelliSense 지원

#### 📚 문서화

- **API Reference**: 완전한 API 문서
- **Usage Examples**: 실제 사용 예제 및 통합 가이드
- **CLAUDE.md**: 개발 가이드라인 및 기능 관리 규칙
- **Phase 기반 로드맵**: 체계적인 기능 확장 계획

#### 🧪 품질 보증

- **TypeScript Strict Mode**: 엄격한 타입 체크
- **ESLint**: 코드 품질 검증
- **Accessibility**: WCAG 2.1 AA 준수 (UI 컴포넌트)
- **Performance**: 최적화된 번들 사이즈

#### 📋 Phase 1 완료 항목

- [x] 패키지 구조 및 빌드 시스템
- [x] 기본 유틸리티 함수 (formatNumberWithComma, formatDate, timeAgo, isAdmin)
- [x] 핵심 컴포넌트 (Button, Badge, Avatar)
- [x] 타입 시스템 (User, CommonResponse, Props types)
- [x] 설정 시스템 (initializeCommunityCore)
- [x] 문서화 (API Reference, Usage Examples, CLAUDE.md)

#### 🔮 다음 계획 (Phase 2)

**Form Components**
- Input, Select, Checkbox, RadioButton 컴포넌트
- Form validation 및 상태 관리

**React Query Hooks**  
- useAuth, useUserData, usePostData 등
- 서버 상태 관리 및 캐싱

**API Service Layer**
- BaseService, UserService, PostService
- 표준화된 HTTP 통신 및 에러 핸들링

---

## 버전 관리 가이드

### 버전 번호 규칙

- **MAJOR.MINOR.PATCH** (예: 1.0.0)
- **MAJOR**: 호환성이 깨지는 변경사항
- **MINOR**: 새로운 기능 추가 (하위 호환성 유지)
- **PATCH**: 버그 수정 및 작은 개선사항

### 릴리스 타입 가이드

#### 🎉 Major Release (x.0.0)
- 기존 API 변경으로 인한 호환성 중단
- 아키텍처의 근본적 변경
- 새로운 주요 기능 도메인 추가

#### ✨ Minor Release (x.y.0)
- 새로운 컴포넌트 추가
- 새로운 유틸리티 함수 추가
- 기존 컴포넌트에 새로운 Props 추가 (하위 호환)
- 새로운 훅이나 서비스 추가

#### 🐛 Patch Release (x.y.z)
- 버그 수정
- 성능 개선
- 문서 업데이트
- 타입 정의 수정
- 의존성 업데이트

### 변경사항 카테고리

- **✨ Added**: 새로운 기능
- **🔄 Changed**: 기존 기능 수정
- **🚫 Deprecated**: 곧 제거될 기능
- **❌ Removed**: 제거된 기능
- **🐛 Fixed**: 버그 수정
- **🔒 Security**: 보안 관련 수정

---

## 기여 가이드

### 변경사항 기록 방법

1. **각 PR마다 CHANGELOG.md 업데이트**
2. **버전 번호는 릴리스 시에만 확정**
3. **변경사항을 명확하고 구체적으로 기술**
4. **Breaking Changes는 별도로 강조 표시**

### Changelog 작성 템플릿

```markdown
## [Unreleased]

### ✨ Added
- 새로운 기능에 대한 설명

### 🔄 Changed  
- 기존 기능 수정 사항

### 🐛 Fixed
- 수정된 버그 설명

### 🚫 Deprecated
- 지원 중단 예정 기능

### ❌ Removed
- 제거된 기능

### 🔒 Security
- 보안 관련 수정사항
```

### 자동화 도구

```bash
# 버전 업데이트와 함께 자동으로 태그 생성
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.1 → 1.1.0  
npm version major  # 1.1.0 → 2.0.0

# Git 태그와 함께 변경사항 푸시
git push origin main --tags
```

---

> 이 CHANGELOG는 [Keep a Changelog](https://keepachangelog.com/) 형식을 따릅니다.