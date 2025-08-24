import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'rounded' | 'text';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
  className = '',
  style,
  ...props
}) => {
  const getDefaultStyles = (variant: string): React.CSSProperties => {
    switch (variant) {
      case 'rectangular':
        return {
          width: width || '100%',
          height: height || '1.2rem'
        };
      case 'circular':
        return {
          width: width || '2.5rem',
          height: height || width || '2.5rem',
          borderRadius: '50%'
        };
      case 'rounded':
        return {
          width: width || '100%',
          height: height || '1.2rem',
          borderRadius: '0.5rem'
        };
      case 'text':
        return {
          width: width || '100%',
          height: height || '1rem',
          borderRadius: '0.25rem'
        };
      default:
        return {
          width: width || '100%',
          height: height || '1.2rem'
        };
    }
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse',
    none: ''
  };

  const skeletonClasses = `
    bg-gray-200 
    ${animationClasses[animation]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const combinedStyles = {
    ...getDefaultStyles(variant),
    ...style
  };

  return (
    <div
      className={skeletonClasses}
      style={combinedStyles}
      {...props}
    />
  );
};

// Pre-built Skeleton components
const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className = '' 
}) => (
  <div className={`space-y-2 ${className}`}>
    {[...Array(lines)].map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        width={index === lines - 1 ? '75%' : '100%'}
      />
    ))}
  </div>
);

const SkeletonAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizes = {
    sm: '2rem',
    md: '2.5rem',
    lg: '3rem'
  };

  return (
    <Skeleton
      variant="circular"
      width={sizes[size]}
      height={sizes[size]}
      className={className}
    />
  );
};

const SkeletonButton: React.FC<{ width?: string | number; className?: string }> = ({ 
  width = '6rem', 
  className = '' 
}) => (
  <Skeleton
    variant="rounded"
    width={width}
    height="2.5rem"
    className={className}
  />
);

const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-4 border rounded-lg ${className}`}>
    <div className="flex items-center space-x-3 mb-4">
      <SkeletonAvatar />
      <div className="flex-1">
        <Skeleton variant="text" width="60%" height="1rem" />
        <Skeleton variant="text" width="40%" height="0.875rem" className="mt-1" />
      </div>
    </div>
    <SkeletonText lines={2} />
    <div className="flex justify-between items-center mt-4">
      <SkeletonButton width="5rem" />
      <Skeleton variant="text" width="4rem" height="0.875rem" />
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