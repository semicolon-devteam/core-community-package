/**
 * 디자인 시스템 컴포넌트 토큰
 * @description 각 컴포넌트별 기본 스타일 토큰 정의
 */

import type { ComponentTokens } from '../../types/theme';

// ========================================
// 컴포넌트별 디자인 토큰
// ========================================

export const defaultComponentTokens: ComponentTokens = {
  button: {
    borderRadius: 'md',
    fontSize: {
      xs: 'xs',
      sm: 'sm',
      base: 'base',
      lg: 'lg',
    },
    padding: {
      xs: '0.375rem 0.75rem', // py-1.5 px-3
      sm: '0.5rem 1rem', // py-2 px-4
      base: '0.625rem 1.25rem', // py-2.5 px-5
      lg: '0.75rem 1.5rem', // py-3 px-6
    },
    height: {
      xs: '1.75rem', // h-7 (28px)
      sm: '2.25rem', // h-9 (36px)
      base: '2.5rem', // h-10 (40px)
      lg: '3rem', // h-12 (48px)
    },
  },
  input: {
    borderRadius: 'md',
    fontSize: 'base',
    padding: '0.625rem 0.75rem', // py-2.5 px-3
    height: '2.5rem', // h-10 (40px)
  },
  badge: {
    borderRadius: 'base',
    fontSize: {
      xs: 'xs',
      sm: 'xs',
      base: 'sm',
    },
    padding: {
      xs: '0.125rem 0.375rem', // py-0.5 px-1.5
      sm: '0.25rem 0.5rem', // py-1 px-2
      base: '0.375rem 0.75rem', // py-1.5 px-3
    },
  },
  avatar: {
    borderRadius: {
      square: 'md',
      rounded: 'xl',
      circle: 'full',
    },
  },
  skeleton: {
    borderRadius: 'base',
    animation: {
      duration: '1000',
      timingFunction: 'in-out',
    },
  },
};