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
declare function Skeleton({ variant, width, height, animated, light, className, style, ...props }: SkeletonProps): import("react/jsx-runtime").JSX.Element;
declare const SkeletonText: ({ lines, className, ...props }: {
    lines?: number;
} & SkeletonProps) => import("react/jsx-runtime").JSX.Element;
declare const SkeletonAvatar: ({ size, ...props }: {
    size?: "sm" | "md" | "lg" | "xl";
} & SkeletonProps) => import("react/jsx-runtime").JSX.Element;
declare const SkeletonButton: ({ variant: buttonVariant, ...props }: {
    variant?: "sm" | "md" | "lg";
} & SkeletonProps) => import("react/jsx-runtime").JSX.Element;
declare const SkeletonCard: ({ ...props }: SkeletonProps) => import("react/jsx-runtime").JSX.Element;
export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonButton, SkeletonCard };
