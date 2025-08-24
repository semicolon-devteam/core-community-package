/**
 * Storybook 테마 데코레이터
 * @description Storybook에서 테마 시스템을 사용할 수 있게 해주는 데코레이터
 */

import React, { useEffect, useState } from 'react';
import type { Decorator } from '@storybook/react';
import { ThemeProvider, defaultLightTheme, defaultDarkTheme, createCustomTheme } from '../../../lib/theme';
import type { Theme, ThemeOverride } from '../../../lib/types/theme';

// ========================================
// 테마 프리셋 정의
// ========================================

const themePresets: Record<string, { label: string; theme: Theme | ThemeOverride }> = {
  'default-light': {
    label: '기본 라이트 테마',
    theme: defaultLightTheme,
  },
  'default-dark': {
    label: '기본 다크 테마',
    theme: defaultDarkTheme,
  },
  'orange-light': {
    label: '오렌지 라이트 테마',
    theme: createCustomTheme({
      brandColor: '#f97316',
      colors: {
        success: '#22c55e',
        warning: '#eab308',
      },
    }) as Theme,
  },
  'purple-light': {
    label: '퍼플 라이트 테마',
    theme: createCustomTheme({
      brandColor: '#8b5cf6',
      colors: {
        secondary: '#6366f1',
        success: '#10b981',
      },
    }) as Theme,
  },
  'minimal-gray': {
    label: '미니멀 그레이 테마',
    theme: createCustomTheme({
      brandColor: '#6b7280',
      colors: {
        secondary: '#374151',
      },
    }) as Theme,
  },
};

// ========================================
// 테마 선택 컴포넌트
// ========================================

interface ThemeSelectProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

const ThemeSelect: React.FC<ThemeSelectProps> = ({ selectedTheme, onThemeChange }) => {
  return (
    <div style={{ 
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 999999,
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '6px',
      padding: '8px 12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
    }}>
      <span>테마:</span>
      <select
        value={selectedTheme}
        onChange={(e) => onThemeChange(e.target.value)}
        style={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '14px',
          minWidth: '150px',
        }}
      >
        {Object.entries(themePresets).map(([key, { label }]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

// ========================================
// 테마 데코레이터
// ========================================

const ThemeDecorator: Decorator = (Story, context) => {
  const [selectedTheme, setSelectedTheme] = useState('default-light');
  
  // Storybook 글로벌에서 테마 정보 가져오기
  useEffect(() => {
    const theme = context.globals?.theme || 'default-light';
    setSelectedTheme(theme);
  }, [context.globals?.theme]);

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    // Storybook 글로벌 업데이트
    if (context.globals) {
      context.globals.theme = theme;
    }
  };

  const currentTheme = themePresets[selectedTheme]?.theme || defaultLightTheme;
  const isOverride = !currentTheme.colors || !currentTheme.typography; // 오버라이드인지 확인

  return (
    <ThemeProvider 
      config={{
        theme: isOverride ? currentTheme as ThemeOverride : undefined,
        mode: selectedTheme.includes('dark') ? 'dark' : 'light',
      }}
      initialTheme={isOverride ? undefined : currentTheme as Theme}
    >
      <ThemeSelect 
        selectedTheme={selectedTheme}
        onThemeChange={handleThemeChange}
      />
      <div style={{ 
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: 'var(--cc-background-primary, #ffffff)',
        color: 'var(--cc-text-primary, #000000)',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}>
        <Story />
      </div>
    </ThemeProvider>
  );
};

export default ThemeDecorator;