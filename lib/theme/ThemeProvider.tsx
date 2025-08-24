/**
 * 테마 프로바이더 컴포넌트
 * @description 테마 시스템의 React Context Provider
 */

'use client';

import React, { createContext, useContext, useCallback, useMemo, useState, useEffect, ReactNode } from 'react';
import type { Theme, ThemeConfig, ThemeContextValue, ThemeOverride } from '../types/theme';
import { defaultLightTheme, defaultDarkTheme, getThemeByMode } from './defaultThemes';
import { mergeTheme } from './utils/mergeTheme';
import { generateCSSVariables } from './utils/cssVariables';

// ========================================
// 테마 컨텍스트
// ========================================

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ========================================
// 테마 프로바이더 Props
// ========================================

interface ThemeProviderProps {
  children: ReactNode;
  config?: ThemeConfig;
  initialTheme?: Theme;
  storageKey?: string;
}

// ========================================
// 로컬 스토리지 헬퍼
// ========================================

const STORAGE_KEY = 'community-core-theme-mode';

function getStoredMode(storageKey?: string): 'light' | 'dark' | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(storageKey || STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to read theme mode from localStorage:', error);
  }
  
  return null;
}

function setStoredMode(mode: 'light' | 'dark', storageKey?: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(storageKey || STORAGE_KEY, mode);
  } catch (error) {
    console.warn('Failed to store theme mode:', error);
  }
}

function getSystemMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// ========================================
// 테마 프로바이더 컴포넌트
// ========================================

export function ThemeProvider({
  children,
  config = {},
  initialTheme,
  storageKey,
}: ThemeProviderProps) {
  const {
    mode: configMode = 'light',
    theme: themeOverride = {},
    cssVarPrefix = 'cc',
    respectSystemTheme = true,
  } = config;

  // 초기 모드 결정
  const getInitialMode = useCallback((): 'light' | 'dark' => {
    const storedMode = getStoredMode(storageKey);
    if (storedMode) return storedMode;
    
    if (respectSystemTheme) {
      return getSystemMode();
    }
    
    return configMode;
  }, [configMode, respectSystemTheme, storageKey]);

  const [mode, setMode] = useState<'light' | 'dark'>(getInitialMode);

  // 기본 테마 계산
  const baseTheme = useMemo(() => {
    if (initialTheme) return initialTheme;
    return mode === 'light' ? defaultLightTheme : defaultDarkTheme;
  }, [initialTheme, mode]);

  // 최종 테마 계산 (오버라이드 적용)
  const theme = useMemo(() => {
    return mergeTheme(baseTheme, themeOverride);
  }, [baseTheme, themeOverride]);

  // 모드 변경 함수
  const changeMode = useCallback((newMode: 'light' | 'dark') => {
    setMode(newMode);
    setStoredMode(newMode, storageKey);
  }, [storageKey]);

  // 모드 토글 함수
  const toggleMode = useCallback(() => {
    changeMode(mode === 'light' ? 'dark' : 'light');
  }, [mode, changeMode]);

  // 테마 업데이트 함수
  const updateTheme = useCallback((override: ThemeOverride) => {
    // 런타임에서 테마 오버라이드 업데이트
    // 실제 구현에서는 상태를 별도로 관리하거나
    // 부모 컴포넌트에서 config를 업데이트하도록 유도
    console.warn('Runtime theme updates require parent component to update config.theme');
  }, []);

  // 테마 리셋 함수
  const resetTheme = useCallback(() => {
    updateTheme({});
  }, [updateTheme]);

  // 시스템 테마 변경 감지
  useEffect(() => {
    if (!respectSystemTheme) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const systemMode = e.matches ? 'dark' : 'light';
      // 저장된 모드가 없을 때만 시스템 모드 따라감
      if (!getStoredMode(storageKey)) {
        setMode(systemMode);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [respectSystemTheme, storageKey]);

  // CSS 변수 생성 및 적용
  useEffect(() => {
    const cssVars = generateCSSVariables(theme, cssVarPrefix);
    const styleId = `${cssVarPrefix}-theme-vars`;
    
    // 기존 스타일 제거
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    // 새 스타일 추가
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = `:root { ${cssVars} }`;
    document.head.appendChild(styleElement);

    return () => {
      const element = document.getElementById(styleId);
      if (element) {
        element.remove();
      }
    };
  }, [theme, cssVarPrefix]);

  // 컨텍스트 값
  const contextValue: ThemeContextValue = useMemo(() => ({
    theme,
    mode,
    setMode: changeMode,
    toggleMode,
    updateTheme,
    resetTheme,
  }), [theme, mode, changeMode, toggleMode, updateTheme, resetTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// ========================================
// 테마 훅
// ========================================

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

// ========================================
// 테마 유틸리티 훅들
// ========================================

/**
 * 현재 테마의 색상을 가져오는 훅
 */
export function useThemeColors() {
  const { theme } = useTheme();
  return theme.colors;
}

/**
 * 현재 테마의 타이포그래피를 가져오는 훅
 */
export function useThemeTypography() {
  const { theme } = useTheme();
  return theme.typography;
}

/**
 * 현재 테마의 간격을 가져오는 훅
 */
export function useThemeSpacing() {
  const { theme } = useTheme();
  return theme.spacing;
}

/**
 * 현재 모드를 반환하는 훅
 */
export function useThemeMode() {
  const { mode, setMode, toggleMode } = useTheme();
  return { mode, setMode, toggleMode };
}

/**
 * CSS 변수 이름을 생성하는 훅
 */
export function useCSSVariable(variableName: string, prefix = 'cc'): string {
  return `var(--${prefix}-${variableName})`;
}

// ========================================
// 기본 내보내기
// ========================================

export default ThemeProvider;