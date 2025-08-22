'use client';

import NumberFlow from '@number-flow/react';
import React from 'react';

interface AnimatedPointProps {
  value: number;
  className?: string;
  style?: React.CSSProperties;
  suffix?: string;
  prefix?: string;
  useThousandSeparator?: boolean;
  duration?: number;
  color?: string;
  fontSize?: string | number;
}

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