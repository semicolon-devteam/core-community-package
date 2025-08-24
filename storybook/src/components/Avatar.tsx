import React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  shape?: 'circle' | 'square' | 'rounded';
  children?: React.ReactNode;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status,
  shape = 'circle',
  className = '',
  children,
  ...props
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const avatarClasses = `
    relative inline-flex items-center justify-center
    bg-gray-100 text-gray-600 font-medium
    ${sizeClasses[size]}
    ${shapeClasses[shape]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={avatarClasses} {...props}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`w-full h-full object-cover ${shapeClasses[shape]}`}
        />
      ) : children ? (
        children
      ) : (
        initials
      )}
      
      {status && (
        <span
          className={`
            absolute bottom-0 right-0 border-2 border-white rounded-full
            ${statusColors[status]}
            ${statusSizes[size]}
          `}
        />
      )}
    </div>
  );
};

export { Avatar };