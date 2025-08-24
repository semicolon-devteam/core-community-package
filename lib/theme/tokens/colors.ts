/**
 * 디자인 시스템 색상 토큰
 * @description 기본 색상 팔레트 및 시맨틱 색상 정의
 */

import type { ColorPalette, SemanticColors, SystemColors } from '../../types/theme';

// ========================================
// 기본 색상 팔레트
// ========================================

export const defaultColorPalettes = {
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  } as ColorPalette,

  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  } as ColorPalette,

  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  } as ColorPalette,

  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  } as ColorPalette,

  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  } as ColorPalette,

  sky: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  } as ColorPalette,

  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  } as ColorPalette,
};

// ========================================
// 기본 시맨틱 색상
// ========================================

export const defaultSemanticColors: SemanticColors = {
  primary: defaultColorPalettes.blue,
  secondary: defaultColorPalettes.slate,
  success: defaultColorPalettes.emerald,
  warning: defaultColorPalettes.amber,
  error: defaultColorPalettes.red,
  info: defaultColorPalettes.sky,
  gray: defaultColorPalettes.gray,
};

// ========================================
// 라이트 모드 시스템 색상
// ========================================

export const lightSystemColors: SystemColors = {
  background: {
    primary: defaultColorPalettes.gray[50],
    secondary: '#ffffff',
    tertiary: defaultColorPalettes.gray[100],
    inverse: defaultColorPalettes.gray[900],
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  surface: {
    primary: '#ffffff',
    secondary: defaultColorPalettes.gray[50],
    tertiary: defaultColorPalettes.gray[100],
    inverse: defaultColorPalettes.gray[900],
    elevated: '#ffffff',
  },
  border: {
    primary: defaultColorPalettes.gray[200],
    secondary: defaultColorPalettes.gray[300],
    tertiary: defaultColorPalettes.gray[400],
    inverse: defaultColorPalettes.gray[700],
    focus: defaultColorPalettes.blue[500],
  },
  text: {
    primary: defaultColorPalettes.gray[900],
    secondary: defaultColorPalettes.gray[600],
    tertiary: defaultColorPalettes.gray[500],
    inverse: '#ffffff',
    disabled: defaultColorPalettes.gray[400],
    link: defaultColorPalettes.blue[600],
    linkHover: defaultColorPalettes.blue[700],
  },
};

// ========================================
// 다크 모드 시스템 색상
// ========================================

export const darkSystemColors: SystemColors = {
  background: {
    primary: defaultColorPalettes.gray[950],
    secondary: defaultColorPalettes.gray[900],
    tertiary: defaultColorPalettes.gray[800],
    inverse: defaultColorPalettes.gray[50],
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  surface: {
    primary: defaultColorPalettes.gray[900],
    secondary: defaultColorPalettes.gray[800],
    tertiary: defaultColorPalettes.gray[700],
    inverse: defaultColorPalettes.gray[50],
    elevated: defaultColorPalettes.gray[800],
  },
  border: {
    primary: defaultColorPalettes.gray[700],
    secondary: defaultColorPalettes.gray[600],
    tertiary: defaultColorPalettes.gray[500],
    inverse: defaultColorPalettes.gray[300],
    focus: defaultColorPalettes.blue[400],
  },
  text: {
    primary: defaultColorPalettes.gray[50],
    secondary: defaultColorPalettes.gray[300],
    tertiary: defaultColorPalettes.gray[400],
    inverse: defaultColorPalettes.gray[900],
    disabled: defaultColorPalettes.gray[600],
    link: defaultColorPalettes.blue[400],
    linkHover: defaultColorPalettes.blue[300],
  },
};