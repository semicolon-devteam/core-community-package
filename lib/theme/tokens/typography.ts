/**
 * 디자인 시스템 타이포그래피 토큰
 * @description 기본 폰트 패밀리, 크기, 굵기, 행간 등 정의
 */

import type { Typography } from '../../types/theme';

// ========================================
// 기본 타이포그래피 토큰
// ========================================

export const defaultTypography: Typography = {
  fontFamily: {
    sans: [
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      '"Noto Sans"',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"',
    ],
    serif: [
      'ui-serif',
      'Georgia',
      'Cambria',
      '"Times New Roman"',
      'Times',
      'serif',
    ],
    mono: [
      'ui-monospace',
      'SFMono-Regular',
      '"SF Mono"',
      'Consolas',
      '"Liberation Mono"',
      'Menlo',
      'monospace',
    ],
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
  },
  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// ========================================
// 한글 최적화 타이포그래피 (한국어 프로젝트용)
// ========================================

export const koreanOptimizedTypography: Typography = {
  ...defaultTypography,
  fontFamily: {
    sans: [
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Malgun Gothic"',
      '"맑은 고딕"',
      '"Apple SD Gothic Neo"',
      '"Noto Sans KR"',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ],
    serif: [
      '"Noto Serif KR"',
      'ui-serif',
      'Georgia',
      'serif',
    ],
    mono: [
      '"D2Coding"',
      '"Consolas"',
      'ui-monospace',
      'SFMono-Regular',
      'monospace',
    ],
  },
  // 한글에 최적화된 line-height
  lineHeight: {
    none: 1,
    tight: 1.3,
    snug: 1.4,
    normal: 1.6,
    relaxed: 1.7,
    loose: 2,
  },
};