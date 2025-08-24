# @team-semicolon/community-core Storybook

> 세미콜론 커뮤니티 핵심 컴포넌트 라이브러리의 Storybook 구현 가이드

## 📋 개요

이 Storybook은 `@team-semicolon/community-core` 패키지의 모든 컴포넌트, 훅, 유틸리티를 시각적으로 확인하고 테스트할 수 있는 개발자 가이드입니다.

## 🚀 빠른 시작

### 개발 환경 실행

```bash
npm install
npm run storybook
```

개발 서버가 `http://localhost:6006`에서 실행됩니다.

### 빌드

```bash
npm run build-storybook
```

## 🎨 제공하는 컴포넌트

### ✅ 구현 완료된 컴포넌트

#### Atoms (기본 컴포넌트)

- **Button**: 5가지 variant, 4가지 size, 로딩 상태 지원
- **Badge**: 5가지 variant, 3가지 size, dot 표시 지원
- **Avatar**: 5가지 size, 3가지 shape, 온라인 상태 표시
- **Input**: 4가지 variant, 3가지 size, 에러 메시지 지원
- **Skeleton**: 4가지 variant, 미리 정의된 컴포넌트 세트

## 🚀 배포

이 Storybook은 Vercel을 통해 자동으로 배포됩니다.

## 📞 지원 및 문의

- **패키지 저장소**: [community-core](https://github.com/semicolon-devteam/community-core)
- **이슈 리포팅**: GitHub Issues
