/**
 * 테마 커스터마이징을 위한 헬퍼 함수들
 * @description 사용자가 쉽게 테마를 커스터마이징할 수 있는 API 함수들
 */

import type { 
  Theme, 
  ThemeOverride, 
  ColorPalette, 
  SemanticColors,
  Typography,
  ComponentTokens 
} from '../../types/theme';
import { defaultColorPalettes } from '../tokens/colors';

// ========================================
// 색상 생성 헬퍼 함수들
// ========================================

/**
 * 단일 색상에서 전체 팔레트를 생성하는 함수
 * 
 * @param baseColor 기준 색상 (500 단계)
 * @param options 생성 옵션
 * @returns 완전한 색상 팔레트
 * 
 * @example
 * ```typescript
 * const orangePalette = createColorPalette('#ff6b35');
 * // 결과: { 50: '#fff7f3', 100: '#ffedd5', ..., 950: '#431407' }
 * ```
 */
export function createColorPalette(
  baseColor: string,
  options: {
    saturation?: number;
    lightness?: number;
    steps?: number;
  } = {}
): ColorPalette {
  const { saturation = 70, lightness = 50, steps = 11 } = options;
  
  // HSL로 변환하여 계산 (간단한 구현)
  const palette: Partial<ColorPalette> = {};
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  
  // 실제 구현에서는 더 정교한 색상 계산 라이브러리를 사용할 수 있습니다
  // 여기서는 기본 예시 구현
  palette[500] = baseColor;
  palette[50] = lightenColor(baseColor, 0.95);
  palette[100] = lightenColor(baseColor, 0.85);
  palette[200] = lightenColor(baseColor, 0.7);
  palette[300] = lightenColor(baseColor, 0.5);
  palette[400] = lightenColor(baseColor, 0.25);
  palette[600] = darkenColor(baseColor, 0.15);
  palette[700] = darkenColor(baseColor, 0.3);
  palette[800] = darkenColor(baseColor, 0.5);
  palette[900] = darkenColor(baseColor, 0.7);
  palette[950] = darkenColor(baseColor, 0.85);
  
  return palette as ColorPalette;
}

/**
 * 색상을 밝게 만드는 함수 (간단 구현)
 */
function lightenColor(color: string, amount: number): string {
  // 실제로는 더 정교한 색상 처리 라이브러리 사용 권장
  // 예: polished, chroma-js 등
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * amount));
  const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + (255 - ((num >> 8) & 0x00FF)) * amount));
  const b = Math.min(255, Math.floor((num & 0x0000FF) + (255 - (num & 0x0000FF)) * amount));
  
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * 색상을 어둡게 만드는 함수 (간단 구현)
 */
function darkenColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.max(0, Math.floor((num >> 16) * (1 - amount)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - amount)));
  const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - amount)));
  
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * 브랜드 컬러에서 전체 시맨틱 색상을 생성하는 함수
 * 
 * @param brandColor 브랜드 메인 컬러
 * @param options 추가 색상 설정
 * @returns 완전한 시맨틱 색상 세트
 * 
 * @example
 * ```typescript
 * const customColors = createSemanticColors('#3b82f6', {
 *   success: '#10b981',
 *   error: '#ef4444'
 * });
 * ```
 */
export function createSemanticColors(
  brandColor: string,
  options: {
    secondary?: string;
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
  } = {}
): SemanticColors {
  return {
    primary: createColorPalette(brandColor),
    secondary: options.secondary ? createColorPalette(options.secondary) : defaultColorPalettes.slate,
    success: options.success ? createColorPalette(options.success) : defaultColorPalettes.emerald,
    warning: options.warning ? createColorPalette(options.warning) : defaultColorPalettes.amber,
    error: options.error ? createColorPalette(options.error) : defaultColorPalettes.red,
    info: options.info ? createColorPalette(options.info) : defaultColorPalettes.sky,
    gray: defaultColorPalettes.gray,
  };
}

// ========================================
// 타이포그래피 헬퍼 함수들
// ========================================

/**
 * 커스텀 폰트 스케일을 생성하는 함수
 * 
 * @param baseSize 기본 폰트 크기 (rem)
 * @param ratio 스케일 비율
 * @returns 완전한 폰트 크기 세트
 * 
 * @example
 * ```typescript
 * const customFontScale = createFontScale(1, 1.25); // Major third scale
 * ```
 */
export function createFontScale(baseSize = 1, ratio = 1.2) {
  return {
    xs: `${baseSize / (ratio * ratio)}rem`,
    sm: `${baseSize / ratio}rem`,
    base: `${baseSize}rem`,
    lg: `${baseSize * ratio}rem`,
    xl: `${baseSize * ratio * ratio}rem`,
    '2xl': `${baseSize * Math.pow(ratio, 3)}rem`,
    '3xl': `${baseSize * Math.pow(ratio, 4)}rem`,
    '4xl': `${baseSize * Math.pow(ratio, 5)}rem`,
    '5xl': `${baseSize * Math.pow(ratio, 6)}rem`,
    '6xl': `${baseSize * Math.pow(ratio, 7)}rem`,
  };
}

/**
 * 커스텀 타이포그래피 설정을 생성하는 함수
 * 
 * @param options 타이포그래피 커스터마이징 옵션
 * @returns 부분 타이포그래피 설정
 * 
 * @example
 * ```typescript
 * const koreanTypography = createTypographyConfig({
 *   fontFamily: {
 *     sans: ['"Noto Sans KR"', 'sans-serif']
 *   },
 *   fontScale: { baseSize: 1, ratio: 1.25 }
 * });
 * ```
 */
export function createTypographyConfig(options: {
  fontFamily?: Partial<Typography['fontFamily']>;
  fontScale?: { baseSize?: number; ratio?: number };
  fontWeights?: Partial<Typography['fontWeight']>;
  lineHeight?: Partial<Typography['lineHeight']>;
}): Partial<Typography> {
  const config: Partial<Typography> = {};
  
  if (options.fontFamily) {
    config.fontFamily = options.fontFamily;
  }
  
  if (options.fontScale) {
    const { baseSize = 1, ratio = 1.2 } = options.fontScale;
    config.fontSize = createFontScale(baseSize, ratio);
  }
  
  if (options.fontWeights) {
    config.fontWeight = options.fontWeights;
  }
  
  if (options.lineHeight) {
    config.lineHeight = options.lineHeight;
  }
  
  return config;
}

// ========================================
// 컴포넌트 토큰 헬퍼 함수들
// ========================================

/**
 * 컴포넌트별 커스터마이징을 쉽게 할 수 있는 함수
 * 
 * @param customizations 컴포넌트별 커스터마이징
 * @returns 부분 컴포넌트 토큰 설정
 * 
 * @example
 * ```typescript
 * const customComponents = createComponentConfig({
 *   button: {
 *     borderRadius: 'xl',
 *     sizes: {
 *       base: { padding: '1rem 2rem', height: '3rem' }
 *     }
 *   }
 * });
 * ```
 */
export function createComponentConfig(
  customizations: Partial<{
    button: Partial<ComponentTokens['button']>;
    input: Partial<ComponentTokens['input']>;
    badge: Partial<ComponentTokens['badge']>;
    avatar: Partial<ComponentTokens['avatar']>;
    skeleton: Partial<ComponentTokens['skeleton']>;
  }>
): Partial<ComponentTokens> {
  return customizations;
}

// ========================================
// 통합 테마 생성 함수들
// ========================================

/**
 * 사용자 정의 테마를 쉽게 생성할 수 있는 통합 함수
 * 
 * @param config 테마 구성 설정
 * @returns 완전한 테마 오버라이드
 * 
 * @example
 * ```typescript
 * const myTheme = createCustomTheme({
 *   brandColor: '#ff6b35',
 *   fontFamily: ['"Inter"', 'sans-serif'],
 *   borderRadius: 'lg',
 *   components: {
 *     button: { borderRadius: 'full' }
 *   }
 * });
 * ```
 */
export function createCustomTheme(config: {
  // 색상 설정
  brandColor?: string;
  colors?: {
    secondary?: string;
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
  };
  
  // 타이포그래피 설정
  fontFamily?: string[];
  fontScale?: { baseSize?: number; ratio?: number };
  
  // 간격 및 크기 설정
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl';
  spacing?: 'tight' | 'normal' | 'relaxed';
  
  // 컴포넌트 설정
  components?: Partial<ComponentTokens>;
}): ThemeOverride {
  const override: ThemeOverride = {};
  
  // 색상 설정
  if (config.brandColor || config.colors) {
    override.colors = {
      semantic: config.brandColor 
        ? createSemanticColors(config.brandColor, config.colors)
        : undefined
    };
  }
  
  // 타이포그래피 설정
  if (config.fontFamily || config.fontScale) {
    override.typography = createTypographyConfig({
      fontFamily: config.fontFamily ? { sans: config.fontFamily } : undefined,
      fontScale: config.fontScale
    });
  }
  
  // 컴포넌트 설정
  if (config.components) {
    override.components = config.components;
  }
  
  return override;
}

// ========================================
// 프리셋 테마 생성기들
// ========================================

/**
 * 인기 있는 브랜드 색상 기반 테마 프리셋들
 */
export const themePresets = {
  /**
   * 깔끔한 블루 테마 (기본값과 유사)
   */
  cleanBlue: (): ThemeOverride => createCustomTheme({
    brandColor: '#3b82f6',
    borderRadius: 'md',
  }),
  
  /**
   * 따뜻한 오렌지 테마
   */
  warmOrange: (): ThemeOverride => createCustomTheme({
    brandColor: '#f97316',
    colors: {
      success: '#22c55e',
      warning: '#eab308',
    },
    borderRadius: 'lg',
  }),
  
  /**
   * 모던 퍼플 테마
   */
  modernPurple: (): ThemeOverride => createCustomTheme({
    brandColor: '#8b5cf6',
    colors: {
      secondary: '#6366f1',
      success: '#10b981',
    },
    borderRadius: 'xl',
  }),
  
  /**
   * 미니멀 그레이 테마
   */
  minimalGray: (): ThemeOverride => createCustomTheme({
    brandColor: '#6b7280',
    colors: {
      secondary: '#374151',
    },
    borderRadius: 'sm',
  }),
  
  /**
   * 한국어 최적화 테마
   */
  korean: (): ThemeOverride => ({
    typography: createTypographyConfig({
      fontFamily: {
        sans: [
          '"Noto Sans KR"',
          '"Malgun Gothic"',
          '"맑은 고딕"',
          'Apple SD Gothic Neo',
          'sans-serif'
        ]
      },
      fontScale: { baseSize: 1, ratio: 1.25 }
    })
  }),
};

// ========================================
// 테마 검증 및 디버깅 함수들
// ========================================

/**
 * 테마 오버라이드의 유효성을 검사하는 함수
 */
export function validateThemeOverride(override: ThemeOverride): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // 색상 검증
  if (override.colors?.semantic) {
    Object.entries(override.colors.semantic).forEach(([colorName, palette]) => {
      if (palette) {
        Object.entries(palette).forEach(([shade, color]) => {
          if (typeof color === 'string' && !isValidHexColor(color)) {
            warnings.push(`Invalid color format: ${colorName}.${shade} = ${color}`);
          }
        });
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    warnings,
    errors
  };
}

/**
 * 16진수 색상 코드 검증
 */
function isValidHexColor(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * 테마 미리보기를 위한 샘플 색상 추출
 */
export function extractThemePreview(theme: Theme): {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  text: string;
} {
  return {
    primary: theme.colors.semantic.primary[500],
    secondary: theme.colors.semantic.secondary[500],
    success: theme.colors.semantic.success[500],
    warning: theme.colors.semantic.warning[500],
    error: theme.colors.semantic.error[500],
    background: theme.colors.system.background.primary,
    text: theme.colors.system.text.primary,
  };
}