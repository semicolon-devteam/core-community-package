'use client';

import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 스켈레톤 종류 */
  variant?: 'rectangular' | 'circular' | 'rounded' | 'text';
  /** 너비 (CSS 단위) */
  width?: string | number;
  /** 높이 (CSS 단위) */
  height?: string | number;
  /** 애니메이션 사용 여부 */
  animated?: boolean;
  /** 밝은 테마 사용 여부 */
  light?: boolean;
}

function Skeleton({
  variant = 'rectangular',
  width,
  height,
  animated = true,
  light = false,
  className = '',
  style,
  ...props
}: SkeletonProps) {
  // variant별 기본 스타일
  const variantClasses = {
    rectangular: 'rounded-md',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
    text: 'rounded-sm'
  };

  // 기본 크기 설정 (variant별)
  const getDefaultStyles = (variant: string): React.CSSProperties => {
    switch (variant) {
      case 'rectangular':
        return { width: width || '100%', height: height || '1.2rem' };
      case 'circular':
        return { width: width || '2.5rem', height: height || width || '2.5rem' };
      case 'rounded':
        return { width: width || '100%', height: height || '1.5rem' };
      case 'text':
        return { width: width || '100%', height: height || '1rem' };
      default:
        return { width: width || '100%', height: height || '1.2rem' };
    }
  };

  // 배경색 (라이트/다크)
  const backgroundClass = light 
    ? 'bg-gray-100'
    : 'bg-gray-200 dark:bg-gray-700';

  // 스타일 조합
  const combinedStyle: React.CSSProperties = {
    ...getDefaultStyles(variant),
    ...style
  };

  return (
    <div
      className={`
        ${backgroundClass}
        ${variantClasses[variant]}
        ${animated ? 'animate-pulse' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      style={combinedStyle}
      {...props}
    />
  );
}

// 미리 정의된 스켈레톤 컴포넌트들
const SkeletonText = ({ lines = 3, className = '', ...props }: { lines?: number } & SkeletonProps) => (
  <div className={`space-y-2 ${className}`} {...props}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton 
        key={index} 
        variant="text" 
        width={index === lines - 1 ? '75%' : '100%'}
        height="0.875rem"
      />
    ))}
  </div>
);

const SkeletonAvatar = ({ size = 'md', ...props }: { size?: 'sm' | 'md' | 'lg' | 'xl' } & SkeletonProps) => {
  const sizes = {
    sm: '2rem',
    md: '2.5rem',
    lg: '3rem',
    xl: '4rem'
  };

  return (
    <Skeleton 
      variant="circular" 
      width={sizes[size]} 
      height={sizes[size]}
      {...props}
    />
  );
};

const SkeletonButton = ({ variant: buttonVariant = 'md', ...props }: { variant?: 'sm' | 'md' | 'lg' } & SkeletonProps) => {
  const getButtonSize = (size: string) => {
    switch (size) {
      case 'sm':
        return { width: '4rem', height: '2rem' };
      case 'lg':
        return { width: '8rem', height: '3rem' };
      default:
        return { width: '6rem', height: '2.5rem' };
    }
  };

  const buttonSize = getButtonSize(buttonVariant);

  return (
    <Skeleton 
      variant="rounded"
      width={buttonSize.width}
      height={buttonSize.height}
      {...props}
    />
  );
};

const SkeletonCard = ({ ...props }: SkeletonProps) => (
  <div className="p-4 border border-gray-200 rounded-lg space-y-4" {...props}>
    <div className="flex items-center space-x-3">
      <SkeletonAvatar size="md" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
    <SkeletonText lines={3} />
    <div className="flex space-x-2">
      <SkeletonButton variant="sm" />
      <SkeletonButton variant="sm" />
    </div>
  </div>
);

export { 
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard
}; 
