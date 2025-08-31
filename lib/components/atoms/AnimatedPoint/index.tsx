'use client';

import NumberFlow from '@number-flow/react';
import React from 'react';

export interface AnimatedPointProps {
  /** 표시할 숫자 값 */
  value: number;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 인라인 스타일 */
  style?: React.CSSProperties;
  /** 접미사 (기본값: 'P') */
  suffix?: string;
  /** 접두사 */
  prefix?: string;
  /** 천 단위 구분자 사용 여부 */
  useThousandSeparator?: boolean;
  /** 애니메이션 지속 시간 (ms) */
  duration?: number;
  /** 텍스트 색상 */
  color?: string;
  /** 폰트 크기 */
  fontSize?: string | number;
}

/**
 * 숫자 애니메이션 컴포넌트
 * 포인트, 코인, 통계 등의 숫자를 부드럽게 애니메이션하며 표시합니다.
 * 
 * @example
 * ```tsx
 * <AnimatedPoint value={1234567} suffix="P" />
 * <AnimatedPoint value={99.99} prefix="$" useThousandSeparator={false} />
 * ```
 */
const AnimatedPoint: React.FC<AnimatedPointProps> = ({
  value,
  className = '',
  style = {},
  suffix = 'P',
  prefix = '',
  useThousandSeparator = true,
  duration = 800,
  color = 'inherit',
  fontSize = 'inherit',
}) => {
  return (
    <div className={`inline-flex items-center ${className}`} style={style}>
      {prefix && (
        <span 
          className="mr-1" 
          style={{ color, fontSize }}
        >
          {prefix}
        </span>
      )}
      
      <NumberFlow
        value={value}
        locales="ko-KR"
        format={{
          notation: 'standard',
          useGrouping: useThousandSeparator,
        }}
        transformTiming={{
          duration: duration,
          easing: 'ease-out',
        }}
        spinTiming={{
          duration: duration,
          easing: 'ease-out',
        }}
        style={{
          color,
          fontSize,
          fontWeight: 'inherit',
          fontFamily: 'inherit',
        }}
      />
      
      {suffix && (
        <span 
          className="ml-1" 
          style={{ color, fontSize }}
        >
          {suffix}
        </span>
      )}
    </div>
  );
};

export default AnimatedPoint; 