/**
 * 커뮤니티 코어 테마 시스템
 * @description 완전히 커스터마이징 가능한 디자인 시스템
 */

// ========================================
// 타입 정의 내보내기
// ========================================
export type {
  Theme,
  ThemeConfig,
  ThemeContextValue,
  ThemeOverride,
  ColorOverride,
  TypographyOverride,
  DeepPartial,
  
  // 색상 관련 타입
  ColorPalette,
  SemanticColors,
  SystemColors,
  
  // 타이포그래피 관련 타입
  Typography,
  FontFamily,
  FontSize,
  FontWeight,
  LineHeight,
  LetterSpacing,
  
  // 간격 및 크기 관련 타입
  Spacing,
  BorderRadius,
  BoxShadow,
  Animation,
  ZIndex,
  Breakpoints,
  
  // 컴포넌트 관련 타입
  ComponentTokens,
  ComponentVariant,
  ComponentSize,
  
  // 유틸리티 타입
  ThemeValue,
  ColorValue,
  SpacingValue,
} from '../types/theme';

// ========================================
// 테마 컴포넌트 및 훅 내보내기
// ========================================
export {
  ThemeProvider,
  useTheme,
  useThemeColors,
  useThemeTypography,
  useThemeSpacing,
  useThemeMode,
  useCSSVariable,
} from './ThemeProvider';

// ========================================
// 기본 테마 내보내기
// ========================================
export {
  defaultLightTheme,
  defaultDarkTheme,
  koreanLightTheme,
  koreanDarkTheme,
  themePresets,
  getThemePreset,
  getThemeByMode,
  type ThemePreset,
} from './defaultThemes';

// ========================================
// 색상 토큰 내보내기
// ========================================
export {
  defaultColorPalettes,
  defaultSemanticColors,
  lightSystemColors,
  darkSystemColors,
} from './tokens/colors';

// ========================================
// 타이포그래피 토큰 내보내기
// ========================================
export {
  defaultTypography,
  koreanOptimizedTypography,
} from './tokens/typography';

// ========================================
// 간격 및 크기 토큰 내보내기
// ========================================
export {
  defaultSpacing,
  defaultBorderRadius,
  defaultBoxShadow,
  defaultAnimation,
  defaultZIndex,
  defaultBreakpoints,
} from './tokens/spacing';

// ========================================
// 컴포넌트 토큰 내보내기
// ========================================
export {
  defaultComponentTokens,
} from './tokens/components';

// ========================================
// 유틸리티 함수 내보내기
// ========================================

// 테마 병합 함수들
export {
  mergeTheme,
  mergeColors,
  mergeTypography,
  mergeComponentTokens,
  validateTheme,
  validateColorValue,
} from './utils/mergeTheme';

// CSS 변수 생성 함수들
export {
  generateCSSVariables,
  generateColorCSSVariables,
  generateTypographyCSSVariables,
  generateSpacingCSSVariables,
  createCSSVariable,
  createColorVariable,
  createSpacingVariable,
  createFontSizeVariable,
  isValidCSSVariable,
  extractTokenPath,
} from './utils/cssVariables';

// 테마 헬퍼 함수들
export {
  createColorPalette,
  createSemanticColors,
  createFontScale,
  createTypographyConfig,
  createComponentConfig,
  createCustomTheme,
  themePresets as customThemePresets,
  validateThemeOverride,
  extractThemePreview,
} from './utils/themeHelpers';

// ========================================
// 편의 함수 및 상수
// ========================================

/**
 * 빠른 테마 설정을 위한 편의 함수
 * 
 * @example
 * ```tsx
 * import { createQuickTheme } from '@semicolon/community-core/theme';
 * 
 * const App = () => (
 *   <ThemeProvider config={createQuickTheme('#ff6b35', 'korean')}>
 *     <YourApp />
 *   </ThemeProvider>
 * );
 * ```
 */
export function createQuickTheme(
  brandColor?: string,
  locale: 'default' | 'korean' = 'default',
  mode: 'light' | 'dark' = 'light'
): ThemeConfig {
  const themeOverride: ThemeOverride = {};
  
  if (brandColor) {
    themeOverride.colors = {
      semantic: {
        primary: require('./utils/themeHelpers').createColorPalette(brandColor)
      }
    };
  }
  
  if (locale === 'korean') {
    themeOverride.typography = require('./tokens/typography').koreanOptimizedTypography;
  }
  
  return {
    mode,
    theme: themeOverride,
    cssVarPrefix: 'cc',
    respectSystemTheme: true,
  };
}

// ========================================
// 기본 내보내기
// ========================================
export default {
  ThemeProvider,
  useTheme,
  defaultLightTheme,
  defaultDarkTheme,
  createCustomTheme: require('./utils/themeHelpers').createCustomTheme,
  createQuickTheme,
};