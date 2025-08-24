/**
 * CSS 변수 생성 유틸리티
 * @description 테마 토큰을 CSS 변수로 변환하는 함수들
 */

import type { Theme, ColorPalette, SystemColors, SemanticColors } from '../../types/theme';

// ========================================
// CSS 변수 생성 함수들
// ========================================

/**
 * 색상 팔레트를 CSS 변수로 변환
 */
function generateColorPaletteVars(
  palette: ColorPalette,
  prefix: string,
  colorName: string
): string {
  const vars: string[] = [];
  
  Object.entries(palette).forEach(([shade, value]) => {
    vars.push(`--${prefix}-${colorName}-${shade}: ${value};`);
  });
  
  return vars.join(' ');
}

/**
 * 시맨틱 색상을 CSS 변수로 변환
 */
function generateSemanticColorVars(colors: SemanticColors, prefix: string): string {
  const vars: string[] = [];
  
  Object.entries(colors).forEach(([colorName, palette]) => {
    vars.push(generateColorPaletteVars(palette, prefix, colorName));
  });
  
  return vars.join(' ');
}

/**
 * 시스템 색상을 CSS 변수로 변환
 */
function generateSystemColorVars(colors: SystemColors, prefix: string): string {
  const vars: string[] = [];
  
  Object.entries(colors).forEach(([category, categoryColors]) => {
    Object.entries(categoryColors).forEach(([name, value]) => {
      vars.push(`--${prefix}-${category}-${name}: ${value};`);
    });
  });
  
  return vars.join(' ');
}

/**
 * 타이포그래피를 CSS 변수로 변환
 */
function generateTypographyVars(typography: Theme['typography'], prefix: string): string {
  const vars: string[] = [];
  
  // Font Family
  Object.entries(typography.fontFamily).forEach(([name, fonts]) => {
    vars.push(`--${prefix}-font-family-${name}: ${fonts.join(', ')};`);
  });
  
  // Font Size
  Object.entries(typography.fontSize).forEach(([size, value]) => {
    vars.push(`--${prefix}-font-size-${size}: ${value};`);
  });
  
  // Font Weight
  Object.entries(typography.fontWeight).forEach(([weight, value]) => {
    vars.push(`--${prefix}-font-weight-${weight}: ${value};`);
  });
  
  // Line Height
  Object.entries(typography.lineHeight).forEach(([height, value]) => {
    vars.push(`--${prefix}-line-height-${height}: ${value};`);
  });
  
  // Letter Spacing
  Object.entries(typography.letterSpacing).forEach(([spacing, value]) => {
    vars.push(`--${prefix}-letter-spacing-${spacing}: ${value};`);
  });
  
  return vars.join(' ');
}

/**
 * 간격을 CSS 변수로 변환
 */
function generateSpacingVars(spacing: Theme['spacing'], prefix: string): string {
  const vars: string[] = [];
  
  Object.entries(spacing).forEach(([size, value]) => {
    vars.push(`--${prefix}-spacing-${size}: ${value};`);
  });
  
  return vars.join(' ');
}

/**
 * Border Radius를 CSS 변수로 변환
 */
function generateBorderRadiusVars(borderRadius: Theme['borderRadius'], prefix: string): string {
  const vars: string[] = [];
  
  Object.entries(borderRadius).forEach(([size, value]) => {
    vars.push(`--${prefix}-border-radius-${size}: ${value};`);
  });
  
  return vars.join(' ');
}

/**
 * Box Shadow를 CSS 변수로 변환
 */
function generateBoxShadowVars(boxShadow: Theme['boxShadow'], prefix: string): string {
  const vars: string[] = [];
  
  Object.entries(boxShadow).forEach(([size, value]) => {
    vars.push(`--${prefix}-box-shadow-${size}: ${value};`);
  });
  
  return vars.join(' ');
}

/**
 * 애니메이션을 CSS 변수로 변환
 */
function generateAnimationVars(animation: Theme['animation'], prefix: string): string {
  const vars: string[] = [];
  
  // Duration
  Object.entries(animation.duration).forEach(([duration, value]) => {
    vars.push(`--${prefix}-duration-${duration}: ${value};`);
  });
  
  // Timing Function
  Object.entries(animation.timingFunction).forEach(([timing, value]) => {
    vars.push(`--${prefix}-timing-${timing}: ${value};`);
  });
  
  return vars.join(' ');
}

/**
 * Z-Index를 CSS 변수로 변환
 */
function generateZIndexVars(zIndex: Theme['zIndex'], prefix: string): string {
  const vars: string[] = [];
  
  Object.entries(zIndex).forEach(([name, value]) => {
    vars.push(`--${prefix}-z-index-${name}: ${value};`);
  });
  
  return vars.join(' ');
}

// ========================================
// 메인 CSS 변수 생성 함수
// ========================================

/**
 * 전체 테마를 CSS 변수로 변환하는 메인 함수
 * 
 * @param theme 테마 객체
 * @param prefix CSS 변수 접두사 (기본값: 'cc')
 * @returns CSS 변수 문자열
 * 
 * @example
 * ```typescript
 * const cssVars = generateCSSVariables(theme, 'my-app');
 * // 결과: --my-app-primary-500: #3b82f6; --my-app-spacing-4: 1rem; ...
 * ```
 */
export function generateCSSVariables(theme: Theme, prefix = 'cc'): string {
  const vars: string[] = [];
  
  // 색상 변수
  vars.push(generateSemanticColorVars(theme.colors.semantic, prefix));
  vars.push(generateSystemColorVars(theme.colors.system, prefix));
  
  // 타이포그래피 변수
  vars.push(generateTypographyVars(theme.typography, prefix));
  
  // 간격 변수
  vars.push(generateSpacingVars(theme.spacing, prefix));
  
  // Border Radius 변수
  vars.push(generateBorderRadiusVars(theme.borderRadius, prefix));
  
  // Box Shadow 변수
  vars.push(generateBoxShadowVars(theme.boxShadow, prefix));
  
  // 애니메이션 변수
  vars.push(generateAnimationVars(theme.animation, prefix));
  
  // Z-Index 변수
  vars.push(generateZIndexVars(theme.zIndex, prefix));
  
  return vars.join(' ');
}

// ========================================
// 특정 카테고리만 생성하는 함수들
// ========================================

/**
 * 색상 CSS 변수만 생성
 */
export function generateColorCSSVariables(
  colors: Theme['colors'],
  prefix = 'cc'
): string {
  const vars: string[] = [];
  vars.push(generateSemanticColorVars(colors.semantic, prefix));
  vars.push(generateSystemColorVars(colors.system, prefix));
  return vars.join(' ');
}

/**
 * 타이포그래피 CSS 변수만 생성
 */
export function generateTypographyCSSVariables(
  typography: Theme['typography'],
  prefix = 'cc'
): string {
  return generateTypographyVars(typography, prefix);
}

/**
 * 간격 CSS 변수만 생성
 */
export function generateSpacingCSSVariables(
  spacing: Theme['spacing'],
  prefix = 'cc'
): string {
  return generateSpacingVars(spacing, prefix);
}

// ========================================
// CSS 변수 접근 헬퍼 함수들
// ========================================

/**
 * CSS 변수 이름을 생성하는 함수
 */
export function createCSSVariable(tokenPath: string, prefix = 'cc'): string {
  return `var(--${prefix}-${tokenPath})`;
}

/**
 * 색상 CSS 변수 이름 생성
 */
export function createColorVariable(color: string, shade: string | number, prefix = 'cc'): string {
  return createCSSVariable(`${color}-${shade}`, prefix);
}

/**
 * 간격 CSS 변수 이름 생성
 */
export function createSpacingVariable(size: string | number, prefix = 'cc'): string {
  return createCSSVariable(`spacing-${size}`, prefix);
}

/**
 * 폰트 크기 CSS 변수 이름 생성
 */
export function createFontSizeVariable(size: string, prefix = 'cc'): string {
  return createCSSVariable(`font-size-${size}`, prefix);
}

// ========================================
// 유틸리티 함수들
// ========================================

/**
 * CSS 변수가 유효한지 검사
 */
export function isValidCSSVariable(variable: string): boolean {
  return /^var\(--[\w-]+\)$/.test(variable);
}

/**
 * CSS 변수에서 토큰 경로 추출
 */
export function extractTokenPath(variable: string, prefix = 'cc'): string | null {
  const match = variable.match(new RegExp(`^var\\(--${prefix}-(.*?)\\)$`));
  return match ? match[1] : null;
}