/**
 * 테마 시스템 쇼케이스 스토리
 * @description 커뮤니티 코어의 테마 시스템 기능들을 보여주는 스토리
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { 
  useTheme, 
  useThemeColors, 
  useThemeMode,
  createColorVariable,
  createSpacingVariable,
  extractThemePreview 
} from '../../../../lib/theme';
import { Button } from '../../components/Button';

const meta: Meta = {
  title: 'Theme System/테마 쇼케이스',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**테마 시스템**은 커뮤니티 코어의 핵심 디자인 시스템입니다.

## 특징
- 완전 커스터마이징 가능한 디자인 토큰
- 라이트/다크 모드 자동 지원
- CSS 변수 기반 실시간 테마 전환
- TypeScript 타입 안전성 보장
- 컴포넌트별 세밀한 커스터마이징

## 사용법
\`\`\`tsx
import { ThemeProvider, useTheme, createCustomTheme } from '@semicolon/community-core/theme';

// 커스텀 테마 생성
const myTheme = createCustomTheme({
  brandColor: '#ff6b35',
  fontFamily: ['"Inter"', 'sans-serif'],
});

// 앱에서 사용
function App() {
  return (
    <ThemeProvider config={{ theme: myTheme }}>
      <YourComponents />
    </ThemeProvider>
  );
}
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// ========================================
// 색상 팔레트 컴포넌트
// ========================================

const ColorPalette: React.FC<{ title: string; colors: Record<string, string> }> = ({ title, colors }) => (
  <div style={{ marginBottom: '2rem' }}>
    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600' }}>{title}</h3>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
      gap: '1rem' 
    }}>
      {Object.entries(colors).map(([name, color]) => (
        <div key={name} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '100%',
              height: '60px',
              backgroundColor: color,
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              marginBottom: '0.5rem',
            }}
          />
          <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>{name}</div>
          <div style={{ fontSize: '0.75rem', color: '#666' }}>{color}</div>
        </div>
      ))}
    </div>
  </div>
);

// ========================================
// 테마 정보 컴포넌트
// ========================================

const ThemeInfo: React.FC = () => {
  const { theme, mode, toggleMode } = useTheme();
  const colors = useThemeColors();
  const themePreview = extractThemePreview(theme);

  return (
    <div style={{ fontFamily: 'var(--cc-font-family-sans, system-ui)' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: 'var(--cc-background-secondary)',
        borderRadius: '12px',
        border: '1px solid var(--cc-border-primary)',
      }}>
        <div>
          <h2 style={{ margin: '0 0 0.5rem 0' }}>현재 테마 정보</h2>
          <p style={{ margin: 0, color: 'var(--cc-text-secondary)' }}>
            모드: <strong>{mode}</strong>
          </p>
        </div>
        <Button onClick={toggleMode} variant="outline">
          {mode === 'light' ? '🌙 다크 모드' : '☀️ 라이트 모드'}
        </Button>
      </div>

      <ColorPalette 
        title="메인 색상"
        colors={{
          'Primary': themePreview.primary,
          'Secondary': themePreview.secondary,
          'Success': themePreview.success,
          'Warning': themePreview.warning,
          'Error': themePreview.error,
        }}
      />

      <ColorPalette 
        title="시스템 색상"
        colors={{
          'Background': themePreview.background,
          'Text': themePreview.text,
        }}
      />
    </div>
  );
};

// ========================================
// 컴포넌트 쇼케이스
// ========================================

const ComponentShowcase: React.FC = () => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '2rem',
      fontFamily: 'var(--cc-font-family-sans, system-ui)',
    }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>버튼 컴포넌트</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Loading</Button>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>크기 변형</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>CSS 변수 예시</h3>
        <div style={{
          padding: '1rem',
          backgroundColor: createColorVariable('primary', '50'),
          border: `2px solid ${createColorVariable('primary', '200')}`,
          borderRadius: 'var(--cc-border-radius-lg)',
          color: createColorVariable('primary', '800'),
        }}>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
            CSS 변수 활용 예시
          </p>
          <p style={{ 
            margin: 0, 
            fontSize: '0.875rem',
            lineHeight: 'var(--cc-line-height-normal)',
          }}>
            이 박스는 테마의 primary 색상과 border-radius를 CSS 변수로 사용합니다.
            테마가 변경되면 자동으로 스타일이 업데이트됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

// ========================================
// 스토리들
// ========================================

export const 테마정보: Story = {
  render: () => <ThemeInfo />,
  parameters: {
    docs: {
      description: {
        story: '현재 적용된 테마의 색상 정보와 모드 전환 기능을 보여줍니다.',
      },
    },
  },
};

export const 컴포넌트쇼케이스: Story = {
  render: () => <ComponentShowcase />,
  parameters: {
    docs: {
      description: {
        story: '테마가 적용된 다양한 컴포넌트들의 모습을 보여줍니다.',
      },
    },
  },
};

export const CSS변수사용법: Story = {
  render: () => {
    const { theme } = useTheme();
    
    return (
      <div style={{ 
        fontFamily: 'var(--cc-font-family-sans)',
        lineHeight: 'var(--cc-line-height-normal)',
      }}>
        <h2 style={{ marginBottom: '2rem' }}>CSS 변수 사용법</h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3>색상 CSS 변수</h3>
          <pre style={{
            backgroundColor: 'var(--cc-background-tertiary)',
            padding: '1rem',
            borderRadius: 'var(--cc-border-radius-md)',
            overflow: 'auto',
            fontSize: '0.875rem',
          }}>
{`/* 시맨틱 색상 */
background-color: var(--cc-primary-500);
color: var(--cc-primary-50);

/* 시스템 색상 */
background-color: var(--cc-background-primary);
color: var(--cc-text-primary);
border: 1px solid var(--cc-border-primary);`}
          </pre>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3>타이포그래피 CSS 변수</h3>
          <pre style={{
            backgroundColor: 'var(--cc-background-tertiary)',
            padding: '1rem',
            borderRadius: 'var(--cc-border-radius-md)',
            overflow: 'auto',
            fontSize: '0.875rem',
          }}>
{`/* 폰트 설정 */
font-family: var(--cc-font-family-sans);
font-size: var(--cc-font-size-lg);
font-weight: var(--cc-font-weight-semibold);
line-height: var(--cc-line-height-normal);`}
          </pre>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3>간격 및 크기 CSS 변수</h3>
          <pre style={{
            backgroundColor: 'var(--cc-background-tertiary)',
            padding: '1rem',
            borderRadius: 'var(--cc-border-radius-md)',
            overflow: 'auto',
            fontSize: '0.875rem',
          }}>
{`/* 간격 설정 */
padding: var(--cc-spacing-4) var(--cc-spacing-6);
margin: var(--cc-spacing-2);

/* 크기 설정 */
border-radius: var(--cc-border-radius-lg);
box-shadow: var(--cc-box-shadow-md);`}
          </pre>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'CSS 변수를 사용하여 테마 토큰을 활용하는 방법을 보여줍니다.',
      },
    },
  },
};