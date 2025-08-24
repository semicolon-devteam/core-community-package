# 🎨 테마 시스템

@semicolon/community-core의 완전 커스터마이징 가능한 디자인 시스템

## 특징

- 🎯 **완전 커스터마이징**: 모든 디자인 토큰을 자유롭게 설정
- 🌓 **다크 모드 지원**: 자동 라이트/다크 모드 전환
- 🚀 **CSS 변수 기반**: 실시간 테마 전환
- 📱 **반응형 지원**: 디바이스별 최적화
- 🔧 **TypeScript 지원**: 완전한 타입 안전성

## 빠른 시작

```tsx
import { ThemeProvider, createCustomTheme } from '@semicolon/community-core/theme';

// 1. 커스텀 테마 생성
const myTheme = createCustomTheme({
  brandColor: '#ff6b35',
  fontFamily: ['"Inter"', 'sans-serif'],
});

// 2. 앱에 적용
function App() {
  return (
    <ThemeProvider config={{ theme: myTheme }}>
      <YourComponents />
    </ThemeProvider>
  );
}

// 3. 컴포넌트에서 사용
function MyComponent() {
  const { theme, mode, toggleMode } = useTheme();
  
  return (
    <div style={{
      backgroundColor: 'var(--cc-background-primary)',
      color: 'var(--cc-text-primary)',
    }}>
      현재 모드: {mode}
      <button onClick={toggleMode}>모드 전환</button>
    </div>
  );
}
```

## 구조

```
theme/
├── types/                    # TypeScript 타입 정의
├── tokens/                   # 디자인 토큰들
│   ├── colors.ts            # 색상 팔레트
│   ├── typography.ts        # 타이포그래피
│   ├── spacing.ts           # 간격 및 크기
│   └── components.ts        # 컴포넌트 토큰
├── utils/                   # 유틸리티 함수들
│   ├── mergeTheme.ts        # 테마 병합
│   ├── cssVariables.ts      # CSS 변수 생성
│   └── themeHelpers.ts      # 커스터마이징 헬퍼
├── ThemeProvider.tsx        # React 컨텍스트
├── defaultThemes.ts         # 기본 테마들
└── index.ts                 # 메인 export
```

## 커스터마이징 예시

### 브랜드 컬러 변경

```tsx
const orangeTheme = createCustomTheme({
  brandColor: '#f97316',
  colors: {
    success: '#22c55e',
    warning: '#eab308',
  }
});
```

### 타이포그래피 커스터마이징

```tsx
const koreanTheme = createCustomTheme({
  fontFamily: ['"Noto Sans KR"', 'sans-serif'],
  fontScale: { baseSize: 1.125, ratio: 1.25 }
});
```

### 컴포넌트별 커스터마이징

```tsx
const customTheme = createCustomTheme({
  components: {
    button: {
      borderRadius: 'full',
      fontSize: { base: 'lg' }
    }
  }
});
```

## CSS 변수 사용

```css
.my-component {
  /* 색상 */
  background-color: var(--cc-primary-500);
  color: var(--cc-text-primary);
  border: 1px solid var(--cc-border-primary);
  
  /* 타이포그래피 */
  font-family: var(--cc-font-family-sans);
  font-size: var(--cc-font-size-lg);
  
  /* 간격 및 크기 */
  padding: var(--cc-spacing-4);
  border-radius: var(--cc-border-radius-lg);
  box-shadow: var(--cc-box-shadow-md);
}
```

## 더 자세한 가이드

- [완전한 테마 시스템 가이드](../../docs/THEME_SYSTEM.md)
- [API 레퍼런스](../../docs/API_REFERENCE.md)
- [Storybook 데모](https://semicolon-community-core.vercel.app)

## 주요 API

### 컴포넌트 & 훅

- `ThemeProvider`: 테마 컨텍스트 제공자
- `useTheme()`: 테마 접근 및 제어
- `useThemeColors()`: 색상만 접근
- `useThemeMode()`: 모드 제어

### 생성 함수들

- `createCustomTheme()`: 커스텀 테마 생성
- `createColorPalette()`: 색상 팔레트 생성
- `createSemanticColors()`: 시맨틱 색상 생성
- `createTypographyConfig()`: 타이포그래피 설정

### 유틸리티

- `validateThemeOverride()`: 테마 검증
- `extractThemePreview()`: 미리보기 추출
- `generateCSSVariables()`: CSS 변수 생성