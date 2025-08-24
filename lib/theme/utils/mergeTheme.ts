/**
 * 테마 병합 유틸리티
 * @description 기본 테마와 사용자 정의 오버라이드를 병합하는 함수
 */

import type { Theme, ThemeOverride, DeepPartial } from '../../types/theme';

// ========================================
// 깊은 병합 유틸리티
// ========================================

function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: DeepPartial<T>
): T {
  const result = { ...target };

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (isObject(sourceValue) && isObject(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue) as T[Extract<keyof T, string>];
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as T[Extract<keyof T, string>];
    }
  }

  return result;
}

// ========================================
// 테마 병합 함수
// ========================================

/**
 * 기본 테마와 오버라이드를 병합하여 최종 테마를 생성합니다.
 * 
 * @param baseTheme 기본 테마
 * @param override 사용자 정의 오버라이드
 * @returns 병합된 최종 테마
 * 
 * @example
 * ```typescript
 * const customTheme = mergeTheme(defaultLightTheme, {
 *   colors: {
 *     semantic: {
 *       primary: {
 *         500: '#ff6b35', // 메인 컬러만 변경
 *       }
 *     }
 *   }
 * });
 * ```
 */
export function mergeTheme(baseTheme: Theme, override: ThemeOverride): Theme {
  return deepMerge(baseTheme, override);
}

// ========================================
// 특정 영역별 병합 함수들
// ========================================

/**
 * 색상만 병합하는 함수
 */
export function mergeColors(
  baseColors: Theme['colors'],
  colorOverride: ThemeOverride['colors']
): Theme['colors'] {
  if (!colorOverride) return baseColors;
  return deepMerge(baseColors, colorOverride);
}

/**
 * 타이포그래피만 병합하는 함수
 */
export function mergeTypography(
  baseTypography: Theme['typography'],
  typographyOverride: ThemeOverride['typography']
): Theme['typography'] {
  if (!typographyOverride) return baseTypography;
  return deepMerge(baseTypography, typographyOverride);
}

/**
 * 컴포넌트 토큰만 병합하는 함수
 */
export function mergeComponentTokens(
  baseComponents: Theme['components'],
  componentsOverride: ThemeOverride['components']
): Theme['components'] {
  if (!componentsOverride) return baseComponents;
  return deepMerge(baseComponents, componentsOverride);
}

// ========================================
// 검증 함수들
// ========================================

/**
 * 테마 구조가 유효한지 검사하는 함수
 */
export function validateTheme(theme: Theme): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 필수 속성 체크
  if (!theme.colors) errors.push('Missing required property: colors');
  if (!theme.typography) errors.push('Missing required property: typography');
  if (!theme.spacing) errors.push('Missing required property: spacing');
  if (!theme.borderRadius) errors.push('Missing required property: borderRadius');
  if (!theme.components) errors.push('Missing required property: components');

  // 색상 구조 체크
  if (theme.colors) {
    if (!theme.colors.semantic) errors.push('Missing required property: colors.semantic');
    if (!theme.colors.system) errors.push('Missing required property: colors.system');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 색상 값이 유효한지 검사하는 함수
 */
export function validateColorValue(color: string): boolean {
  // CSS 색상 값 검증 (기본적인 패턴만)
  const colorPatterns = [
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, // hex
    /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/, // rgb
    /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/, // rgba
    /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/, // hsl
    /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/, // hsla
    /^(transparent|currentColor)$/, // special values
  ];

  return colorPatterns.some(pattern => pattern.test(color));
}