/**
 * 디자인 시스템 테마 타입 정의
 * @description 커뮤니티 코어의 테마 시스템을 위한 TypeScript 타입 정의
 */

// ========================================
// 색상 토큰 정의
// ========================================

export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface SemanticColors {
  primary: ColorPalette;
  secondary: ColorPalette;
  success: ColorPalette;
  warning: ColorPalette;
  error: ColorPalette;
  info: ColorPalette;
  gray: ColorPalette;
}

export interface SystemColors {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    overlay: string;
  };
  surface: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    elevated: string;
  };
  border: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    focus: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    disabled: string;
    link: string;
    linkHover: string;
  };
}

// ========================================
// 타이포그래피 토큰 정의
// ========================================

export interface FontFamily {
  sans: string[];
  serif: string[];
  mono: string[];
}

export interface FontSize {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
}

export interface FontWeight {
  thin: number;
  extralight: number;
  light: number;
  normal: number;
  medium: number;
  semibold: number;
  bold: number;
  extrabold: number;
  black: number;
}

export interface LineHeight {
  none: number;
  tight: number;
  snug: number;
  normal: number;
  relaxed: number;
  loose: number;
}

export interface LetterSpacing {
  tighter: string;
  tight: string;
  normal: string;
  wide: string;
  wider: string;
  widest: string;
}

export interface Typography {
  fontFamily: FontFamily;
  fontSize: FontSize;
  fontWeight: FontWeight;
  lineHeight: LineHeight;
  letterSpacing: LetterSpacing;
}

// ========================================
// 간격 및 크기 토큰 정의
// ========================================

export interface Spacing {
  px: string;
  0: string;
  0.5: string;
  1: string;
  1.5: string;
  2: string;
  2.5: string;
  3: string;
  3.5: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  14: string;
  16: string;
  20: string;
  24: string;
  28: string;
  32: string;
  36: string;
  40: string;
  44: string;
  48: string;
  52: string;
  56: string;
  60: string;
  64: string;
  72: string;
  80: string;
  96: string;
}

// ========================================
// 모서리 반경 토큰 정의
// ========================================

export interface BorderRadius {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

// ========================================
// 그림자 토큰 정의
// ========================================

export interface BoxShadow {
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
}

// ========================================
// 애니메이션 토큰 정의
// ========================================

export interface TransitionDuration {
  75: string;
  100: string;
  150: string;
  200: string;
  300: string;
  500: string;
  700: string;
  1000: string;
}

export interface TransitionTimingFunction {
  linear: string;
  in: string;
  out: string;
  'in-out': string;
}

export interface Animation {
  duration: TransitionDuration;
  timingFunction: TransitionTimingFunction;
}

// ========================================
// z-index 토큰 정의
// ========================================

export interface ZIndex {
  auto: string;
  0: number;
  10: number;
  20: number;
  30: number;
  40: number;
  50: number;
  dropdown: number;
  sticky: number;
  fixed: number;
  modal: number;
  popover: number;
  tooltip: number;
  toast: number;
}

// ========================================
// 반응형 브레이크포인트 토큰 정의
// ========================================

export interface Breakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

// ========================================
// 컴포넌트별 토큰 정의
// ========================================

export interface ComponentTokens {
  button: {
    borderRadius: keyof BorderRadius;
    fontSize: {
      xs: keyof FontSize;
      sm: keyof FontSize;
      base: keyof FontSize;
      lg: keyof FontSize;
    };
    padding: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
    };
    height: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
    };
  };
  input: {
    borderRadius: keyof BorderRadius;
    fontSize: keyof FontSize;
    padding: string;
    height: string;
  };
  badge: {
    borderRadius: keyof BorderRadius;
    fontSize: {
      xs: keyof FontSize;
      sm: keyof FontSize;
      base: keyof FontSize;
    };
    padding: {
      xs: string;
      sm: string;
      base: string;
    };
  };
  avatar: {
    borderRadius: {
      square: keyof BorderRadius;
      rounded: keyof BorderRadius;
      circle: keyof BorderRadius;
    };
  };
  skeleton: {
    borderRadius: keyof BorderRadius;
    animation: {
      duration: keyof TransitionDuration;
      timingFunction: keyof TransitionTimingFunction;
    };
  };
}

// ========================================
// 메인 테마 인터페이스
// ========================================

export interface Theme {
  colors: {
    semantic: SemanticColors;
    system: SystemColors;
  };
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  boxShadow: BoxShadow;
  animation: Animation;
  zIndex: ZIndex;
  breakpoints: Breakpoints;
  components: ComponentTokens;
}

// ========================================
// 테마 커스터마이징을 위한 부분 타입들
// ========================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ThemeOverride = DeepPartial<Theme>;

export type ColorOverride = DeepPartial<SemanticColors & SystemColors>;

export type TypographyOverride = DeepPartial<Typography>;

// ========================================
// 테마 설정 옵션
// ========================================

export interface ThemeConfig {
  /**
   * 기본 테마 (light/dark)
   */
  mode?: 'light' | 'dark';
  /**
   * 테마 오버라이드
   */
  theme?: ThemeOverride;
  /**
   * CSS 변수 접두사
   */
  cssVarPrefix?: string;
  /**
   * 자동 다크모드 감지 여부
   */
  respectSystemTheme?: boolean;
}

// ========================================
// 테마 컨텍스트 타입
// ========================================

export interface ThemeContextValue {
  theme: Theme;
  mode: 'light' | 'dark';
  setMode: (mode: 'light' | 'dark') => void;
  toggleMode: () => void;
  updateTheme: (override: ThemeOverride) => void;
  resetTheme: () => void;
}

// ========================================
// 유틸리티 타입들
// ========================================

export type ThemeValue<T extends keyof Theme> = Theme[T];

export type ColorValue = string;

export type SpacingValue = keyof Spacing | string | number;

export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'ghost' | 'outline';

export type ComponentSize = 'xs' | 'sm' | 'base' | 'lg';

// ========================================
// 내보내기
// ========================================

export default Theme;