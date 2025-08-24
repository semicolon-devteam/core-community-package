# 🎨 테마 시스템 가이드

## 개요

@semicolon/community-core의 테마 시스템은 **완전히 커스터마이징 가능한 디자인 시스템**입니다. 구조만 정의하고 실제 색상 값이나 크기는 사용자가 자유롭게 정의할 수 있습니다.

### 주요 특징

- 🎯 **완전 커스터마이징**: 모든 디자인 토큰을 개별적으로 설정 가능
- 🌓 **다크 모드 지원**: 라이트/다크 모드 자동 전환
- 🚀 **CSS 변수 기반**: 실시간 테마 전환 성능 최적화
- 📱 **반응형 지원**: 디바이스별 최적화된 토큰
- 🔧 **TypeScript 지원**: 완전한 타입 안전성
- 📦 **Tree Shaking**: 필요한 부분만 번들에 포함

## 빠른 시작

### 1. 기본 설정

```tsx
import { ThemeProvider } from '@semicolon/community-core/theme';

function App() {
  return (
    <ThemeProvider config={{ mode: 'light' }}>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. 커스텀 테마 생성

```tsx
import { ThemeProvider, createCustomTheme } from '@semicolon/community-core/theme';

const myTheme = createCustomTheme({
  brandColor: '#ff6b35',          // 메인 브랜드 컬러
  colors: {
    success: '#22c55e',
    warning: '#eab308',
  },
  fontFamily: ['"Inter"', 'sans-serif'],
  borderRadius: 'lg',
});

function App() {
  return (
    <ThemeProvider config={{ theme: myTheme }}>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 3. 컴포넌트에서 테마 사용

```tsx
import { useTheme, useThemeColors, useThemeMode } from '@semicolon/community-core/theme';

function MyComponent() {
  const { theme } = useTheme();
  const colors = useThemeColors();
  const { mode, toggleMode } = useThemeMode();

  return (
    <div style={{
      backgroundColor: colors.system.background.primary,
      color: colors.system.text.primary,
      borderRadius: theme.borderRadius.lg,
    }}>
      현재 모드: {mode}
      <button onClick={toggleMode}>모드 전환</button>
    </div>
  );
}
```

## 테마 구조

### 색상 시스템

```typescript
interface SemanticColors {
  primary: ColorPalette;     // 메인 브랜드 색상
  secondary: ColorPalette;   // 보조 색상
  success: ColorPalette;     // 성공 상태 색상
  warning: ColorPalette;     // 경고 상태 색상
  error: ColorPalette;       // 에러 상태 색상
  info: ColorPalette;        // 정보 색상
  gray: ColorPalette;        // 회색 색상
}

interface SystemColors {
  background: {
    primary: string;    // 메인 배경색
    secondary: string;  // 보조 배경색
    tertiary: string;   // 3차 배경색
    inverse: string;    // 반전 배경색
    overlay: string;    // 오버레이 색상
  };
  text: {
    primary: string;    // 메인 텍스트 색상
    secondary: string;  // 보조 텍스트 색상
    disabled: string;   // 비활성화 텍스트
    link: string;       // 링크 색상
    // ...
  };
  // ...
}
```

### 타이포그래피 시스템

```typescript
interface Typography {
  fontFamily: {
    sans: string[];
    serif: string[];
    mono: string[];
  };
  fontSize: {
    xs: string;    // 0.75rem (12px)
    sm: string;    // 0.875rem (14px)
    base: string;  // 1rem (16px)
    lg: string;    // 1.125rem (18px)
    // ...
  };
  fontWeight: {
    light: number;    // 300
    normal: number;   // 400
    medium: number;   // 500
    semibold: number; // 600
    bold: number;     // 700
  };
  // ...
}
```

## 커스터마이징 방법

### 1. 간단한 브랜드 컬러 변경

```tsx
import { createCustomTheme } from '@semicolon/community-core/theme';

const theme = createCustomTheme({
  brandColor: '#3b82f6',  // 파란색
});
```

### 2. 세밀한 색상 커스터마이징

```tsx
import { createSemanticColors } from '@semicolon/community-core/theme';

const customColors = createSemanticColors('#ff6b35', {
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
});

const theme = {
  colors: { semantic: customColors }
};
```

### 3. 타이포그래피 커스터마이징

```tsx
import { createTypographyConfig } from '@semicolon/community-core/theme';

const koreanTypography = createTypographyConfig({
  fontFamily: {
    sans: ['"Noto Sans KR"', '"Malgun Gothic"', 'sans-serif']
  },
  fontScale: { baseSize: 1, ratio: 1.25 } // Major third scale
});

const theme = {
  typography: koreanTypography
};
```

### 4. 컴포넌트별 커스터마이징

```tsx
import { createComponentConfig } from '@semicolon/community-core/theme';

const customComponents = createComponentConfig({
  button: {
    borderRadius: 'full',  // 완전 둥근 버튼
    fontSize: {
      base: 'lg'          // 기본 크기를 large로
    }
  }
});

const theme = {
  components: customComponents
};
```

## CSS 변수 활용

테마 시스템은 CSS 변수를 자동 생성하여 실시간 테마 전환을 지원합니다.

### CSS에서 직접 사용

```css
.my-component {
  /* 색상 변수 */
  background-color: var(--cc-primary-500);
  color: var(--cc-text-primary);
  border: 1px solid var(--cc-border-primary);
  
  /* 타이포그래피 변수 */
  font-family: var(--cc-font-family-sans);
  font-size: var(--cc-font-size-lg);
  font-weight: var(--cc-font-weight-semibold);
  
  /* 간격 및 크기 변수 */
  padding: var(--cc-spacing-4) var(--cc-spacing-6);
  border-radius: var(--cc-border-radius-lg);
  box-shadow: var(--cc-box-shadow-md);
}
```

### JavaScript에서 CSS 변수 생성

```tsx
import { createColorVariable, createSpacingVariable } from '@semicolon/community-core/theme';

const MyComponent = () => (
  <div
    style={{
      backgroundColor: createColorVariable('primary', '50'),
      padding: createSpacingVariable('4'),
      borderColor: createColorVariable('primary', '200'),
    }}
  >
    Content
  </div>
);
```

## 프리셋 테마

빠른 시작을 위한 미리 정의된 테마들을 제공합니다.

```tsx
import { themePresets } from '@semicolon/community-core/theme';

// 사용 가능한 프리셋들
const cleanBlue = themePresets.cleanBlue();
const warmOrange = themePresets.warmOrange();
const modernPurple = themePresets.modernPurple();
const minimalGray = themePresets.minimalGray();
const korean = themePresets.korean();
```

### 프리셋 적용 예시

```tsx
import { ThemeProvider, themePresets } from '@semicolon/community-core/theme';

function App() {
  return (
    <ThemeProvider config={{ 
      theme: themePresets.warmOrange(),
      mode: 'light'
    }}>
      <YourApp />
    </ThemeProvider>
  );
}
```

## 고급 사용법

### 1. 런타임 테마 변경

```tsx
function ThemeCustomizer() {
  const { updateTheme } = useTheme();
  
  const changeBrandColor = (color: string) => {
    updateTheme({
      colors: {
        semantic: {
          primary: createColorPalette(color)
        }
      }
    });
  };
  
  return (
    <div>
      <button onClick={() => changeBrandColor('#ff6b35')}>
        오렌지 테마
      </button>
      <button onClick={() => changeBrandColor('#8b5cf6')}>
        퍼플 테마
      </button>
    </div>
  );
}
```

### 2. 테마 검증

```tsx
import { validateThemeOverride } from '@semicolon/community-core/theme';

const myTheme = {
  colors: {
    semantic: {
      primary: { 500: 'invalid-color' } // 잘못된 색상
    }
  }
};

const validation = validateThemeOverride(myTheme);
if (!validation.isValid) {
  console.warn('테마 검증 실패:', validation.errors);
}
```

### 3. 테마 미리보기

```tsx
import { extractThemePreview } from '@semicolon/community-core/theme';

function ThemePreview() {
  const { theme } = useTheme();
  const preview = extractThemePreview(theme);
  
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {Object.entries(preview).map(([name, color]) => (
        <div
          key={name}
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: color,
            borderRadius: '8px',
            title: `${name}: ${color}`
          }}
        />
      ))}
    </div>
  );
}
```

## 실제 사용 예시

### 1. 블로그 테마

```tsx
const blogTheme = createCustomTheme({
  brandColor: '#2563eb',
  colors: {
    secondary: '#64748b',
  },
  fontFamily: ['"Inter"', '"Noto Sans KR"', 'sans-serif'],
  fontScale: { baseSize: 1.125, ratio: 1.25 }, // 읽기 편한 큰 글씨
  borderRadius: 'lg',
});
```

### 2. 대시보드 테마

```tsx
const dashboardTheme = createCustomTheme({
  brandColor: '#059669',
  colors: {
    warning: '#d97706',
    error: '#dc2626',
  },
  borderRadius: 'sm', // 깔끔한 모서리
  components: {
    button: {
      borderRadius: 'base',
      fontSize: { base: 'sm' }
    }
  }
});
```

### 3. 한국어 최적화 테마

```tsx
const koreanTheme = {
  typography: {
    fontFamily: {
      sans: [
        '"Noto Sans KR"',
        '"Malgun Gothic"', 
        '"맑은 고딕"',
        'Apple SD Gothic Neo',
        'sans-serif'
      ]
    },
    lineHeight: {
      normal: 1.6, // 한글 가독성을 위한 넓은 행간
      relaxed: 1.7,
    }
  }
};
```

## 성능 최적화

### 1. Tree Shaking 활용

```tsx
// ✅ 필요한 부분만 import
import { ThemeProvider, useTheme } from '@semicolon/community-core/theme';

// ❌ 전체 패키지 import는 피하기
import * as Theme from '@semicolon/community-core/theme';
```

### 2. CSS 변수 최적화

```tsx
// ✅ CSS 변수 사용으로 실시간 변경
const MyComponent = () => (
  <div style={{ color: 'var(--cc-primary-500)' }}>
    Content
  </div>
);

// ❌ JavaScript에서 직접 색상 값 사용
const { theme } = useTheme();
const MyComponent = () => (
  <div style={{ color: theme.colors.semantic.primary[500] }}>
    Content
  </div>
);
```

### 3. 메모이제이션 활용

```tsx
const MyComponent = React.memo(() => {
  const { theme } = useTheme();
  
  const styles = useMemo(() => ({
    container: {
      backgroundColor: theme.colors.system.background.primary,
      padding: theme.spacing[4],
    }
  }), [theme]);
  
  return <div style={styles.container}>Content</div>;
});
```

## 문제 해결

### 1. CSS 변수가 적용되지 않는 경우

```tsx
// 확인사항:
// 1. ThemeProvider로 앱이 래핑되어 있는지
// 2. 올바른 CSS 변수 이름을 사용하고 있는지
// 3. 브라우저 개발자 도구에서 :root에 변수가 생성되었는지 확인

// 디버깅:
const { theme } = useTheme();
console.log('Current theme:', theme);
```

### 2. 타입 에러가 발생하는 경우

```typescript
// tsconfig.json에 경로 설정 확인
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

### 3. 테마가 초기화되지 않는 경우

```tsx
// ThemeProvider 설정 확인
<ThemeProvider
  config={{
    mode: 'light',
    respectSystemTheme: true, // 시스템 테마 감지
    cssVarPrefix: 'cc',       // CSS 변수 접두사
  }}
>
  <App />
</ThemeProvider>
```

## API 레퍼런스

자세한 API 문서는 [API_REFERENCE.md](./API_REFERENCE.md)를 참고하세요.

### 주요 함수들

- `createCustomTheme()`: 커스텀 테마 생성
- `createColorPalette()`: 색상 팔레트 생성
- `createSemanticColors()`: 시맨틱 색상 생성
- `validateThemeOverride()`: 테마 검증
- `extractThemePreview()`: 테마 미리보기

### 주요 훅들

- `useTheme()`: 테마 컨텍스트 접근
- `useThemeColors()`: 색상만 접근
- `useThemeMode()`: 모드 제어
- `useCSSVariable()`: CSS 변수 생성

---

더 자세한 예시는 [Storybook](https://semicolon-community-core.vercel.app)에서 확인할 수 있습니다.