/**
 * 디자인 시스템 기본 테마
 * @description 라이트/다크 모드 기본 테마 정의
 */

import type { Theme } from '../types/theme';
import { defaultSemanticColors, lightSystemColors, darkSystemColors } from './tokens/colors';
import { defaultTypography, koreanOptimizedTypography } from './tokens/typography';
import {
  defaultSpacing,
  defaultBorderRadius,
  defaultBoxShadow,
  defaultAnimation,
  defaultZIndex,
  defaultBreakpoints,
} from './tokens/spacing';
import { defaultComponentTokens } from './tokens/components';

// ========================================
// 기본 라이트 테마
// ========================================

export const defaultLightTheme: Theme = {
  colors: {
    semantic: defaultSemanticColors,
    system: lightSystemColors,
  },
  typography: defaultTypography,
  spacing: defaultSpacing,
  borderRadius: defaultBorderRadius,
  boxShadow: defaultBoxShadow,
  animation: defaultAnimation,
  zIndex: defaultZIndex,
  breakpoints: defaultBreakpoints,
  components: defaultComponentTokens,
};

// ========================================
// 기본 다크 테마
// ========================================

export const defaultDarkTheme: Theme = {
  colors: {
    semantic: defaultSemanticColors,
    system: darkSystemColors,
  },
  typography: defaultTypography,
  spacing: defaultSpacing,
  borderRadius: defaultBorderRadius,
  boxShadow: defaultBoxShadow,
  animation: defaultAnimation,
  zIndex: defaultZIndex,
  breakpoints: defaultBreakpoints,
  components: defaultComponentTokens,
};

// ========================================
// 한국어 최적화 라이트 테마
// ========================================

export const koreanLightTheme: Theme = {
  ...defaultLightTheme,
  typography: koreanOptimizedTypography,
};

// ========================================
// 한국어 최적화 다크 테마
// ========================================

export const koreanDarkTheme: Theme = {
  ...defaultDarkTheme,
  typography: koreanOptimizedTypography,
};

// ========================================
// 테마 프리셋 맵
// ========================================

export const themePresets = {
  'default-light': defaultLightTheme,
  'default-dark': defaultDarkTheme,
  'korean-light': koreanLightTheme,
  'korean-dark': koreanDarkTheme,
} as const;

export type ThemePreset = keyof typeof themePresets;

// ========================================
// 테마 선택 헬퍼
// ========================================

export function getThemePreset(preset: ThemePreset): Theme {
  return themePresets[preset];
}

export function getThemeByMode(mode: 'light' | 'dark', locale: 'default' | 'korean' = 'default'): Theme {
  const presetKey = `${locale}-${mode}` as ThemePreset;
  return themePresets[presetKey];
}