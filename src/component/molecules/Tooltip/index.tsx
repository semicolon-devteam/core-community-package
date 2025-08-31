'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { TooltipProps } from './tooltip.model';
import clsx from 'clsx';

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base'
};

const variantStyles = {
  default: { 
    bg: '#333', 
    text: '#fff', 
    border: undefined,
    classes: 'bg-gray-800 text-white'
  },
  dark: { 
    bg: '#1f2937', 
    text: '#f9fafb', 
    border: undefined,
    classes: 'bg-gray-800 text-gray-50'
  },
  light: { 
    bg: '#f9fafb', 
    text: '#1f2937', 
    border: '#e5e7eb',
    classes: 'bg-gray-50 text-gray-800 border border-gray-200'
  },
  primary: { 
    bg: '#f37021', 
    text: '#fff', 
    border: undefined,
    classes: 'bg-orange-500 text-white'
  },
  success: { 
    bg: '#10b981', 
    text: '#fff', 
    border: undefined,
    classes: 'bg-emerald-500 text-white'
  },
  warning: { 
    bg: '#f59e0b', 
    text: '#fff', 
    border: undefined,
    classes: 'bg-amber-500 text-white'
  },
  error: { 
    bg: '#ef4444', 
    text: '#fff', 
    border: undefined,
    classes: 'bg-red-500 text-white'
  }
};


/**
 * 툴팁 컴포넌트
 * 마우스 호버, 클릭, 포커스 시 추가 정보를 표시합니다.
 * 
 * @example
 * ```tsx
 * <Tooltip content="추가 정보">
 *   <button>호버하세요</button>
 * </Tooltip>
 * ```
 */
const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  size = 'md',
  variant = 'default',
  delay = 100,
  disabled = false,
  className = '',
  maxWidth = 200,
  trigger = 'hover',
  showArrow = true,
  animationDuration = 200, // eslint-disable-line @typescript-eslint/no-unused-vars
  forceVisible = false,
}) => {
  const [isVisible, setIsVisible] = useState(forceVisible);
  const [tooltipPosition, setTooltipPosition] = useState({ top: -9999, left: -9999 });
  const [isPositioned, setIsPositioned] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isTargetInView, setIsTargetInView] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // 타겟 요소가 뷰포트 내에 있는지 확인
  const isElementInViewport = (rect: DOMRect) => {
    const threshold = 10; // 최소한 10px는 보여야 함
    return (
      rect.bottom > threshold &&
      rect.top < window.innerHeight - threshold &&
      rect.right > threshold &&
      rect.left < window.innerWidth - threshold
    );
  };

  // 툴팁 위치 계산
  const calculateTooltipPosition = () => {
    if (!triggerRef.current || !tooltipRef.current) {
      return;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    // 타겟이 뷰포트 밖에 있으면 툴팁 숨김 (forceVisible 포함)
    const inView = isElementInViewport(triggerRect);
    setIsTargetInView(inView);
    
    if (!inView) {
      setIsPositioned(false);
      return;
    }
    const gap = showArrow ? 12 : 8;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - gap;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + gap;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - gap;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + gap;
        break;
      default:
        // 기본값은 top
        top = triggerRect.top - tooltipRect.height - gap;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
    }

    // 화면 경계 체크 및 조정
    const padding = 10;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 타겟이 부분적으로만 보일 때 툴팁 위치 조정
    if (left < padding) {
      left = padding;
    } else if (left + tooltipRect.width > viewportWidth - padding) {
      left = viewportWidth - tooltipRect.width - padding;
    }

    if (top < padding) {
      top = padding;
    } else if (top + tooltipRect.height > viewportHeight - padding) {
      top = viewportHeight - tooltipRect.height - padding;
    }

    setTooltipPosition({
      top: Math.max(top, 10),
      left: Math.max(left, 10)
    });
    setIsPositioned(true);
  };

  // 이벤트 핸들러들
  const showTooltip = () => {
    if (disabled || !content || forceVisible) {
      return;
    }
    
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else {
      setIsVisible(true);
    }
  };

  const hideTooltip = () => {
    if (forceVisible) {
      return; // forceVisible일 때는 숨기지 않음
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') showTooltip();
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') hideTooltip();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (trigger === 'click') {
      e.stopPropagation();
      isVisible ? hideTooltip() : showTooltip();
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus') showTooltip();
  };

  const handleBlur = () => {
    if (trigger === 'focus') hideTooltip();
  };

  // 툴팁이 표시될 때 위치 계산
  useEffect(() => {
    if (isVisible) {
      // 초기 위치를 화면 밖으로 설정하고 계산
      setIsPositioned(false);
      // 다음 렌더링 사이클에서 위치 계산
      requestAnimationFrame(() => {
        calculateTooltipPosition();
      });
    } else {
      setIsPositioned(false);
    }
  }, [isVisible, position]);

  // 윈도우 리사이즈 및 스크롤 시 위치 재계산
  useEffect(() => {
    const handleResize = () => {
      if (isVisible) {
        calculateTooltipPosition();
      }
    };
    
    const handleScroll = () => {
      if (isVisible && triggerRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const inView = isElementInViewport(triggerRect);
        setIsTargetInView(inView);
        
        if (inView) {
          calculateTooltipPosition();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true); // capture phase로 스크롤 감지
    document.addEventListener('scroll', handleScroll, true);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isVisible]);

  // Click outside handler for click trigger
  useEffect(() => {
    if (trigger === 'click' && isVisible) {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node) &&
          tooltipRef.current &&
          !tooltipRef.current.contains(e.target as Node)
        ) {
          hideTooltip();
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [trigger, isVisible]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Portal을 위한 마운트 체크
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // forceVisible이 변경될 때 상태 업데이트
  useEffect(() => {
    setIsVisible(forceVisible);
  }, [forceVisible]);

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];
  const bgColor = currentVariant.bg;
  const txtColor = currentVariant.text;
  
  // 동적 Tailwind 클래스 생성
  const tooltipClasses = clsx(
    // 기본 스타일
    'fixed rounded-md font-medium shadow-lg whitespace-pre-wrap break-words pointer-events-none',
    // z-index
    'z-[9999]',
    // 크기 스타일
    currentSize,
    // Variant 스타일 (Tailwind 클래스가 있으면 사용, 없으면 인라인 스타일로 폴백)
    currentVariant.classes,
    // 애니메이션 (opacity만 transition)
    'transition-opacity duration-200 ease-in-out',
    // 가시성 기반 스타일 (타겟이 뷰포트에 있고 positioned일 때만 표시)
    isPositioned && isTargetInView ? 'opacity-100' : 'opacity-0',
    // 사용자 정의 클래스
    className
  );
  
  // 최소한의 인라인 스타일 (위치와 Tailwind로 표현 불가능한 것들)
  const tooltipInlineStyles: React.CSSProperties = {
    top: isPositioned ? `${tooltipPosition.top}px` : '-9999px',
    left: isPositioned ? `${tooltipPosition.left}px` : '-9999px',
    maxWidth: `${maxWidth}px`,
    // Tailwind 클래스로 커버되지 않는 경우를 위한 폴백
    ...(!currentVariant.classes && {
      backgroundColor: bgColor,
      color: txtColor,
      borderColor: currentVariant.border
    })
  };

  // 화살표 위치별 클래스
  const arrowClasses = clsx(
    'absolute w-0 h-0',
    position === 'top' && 'bottom-[-8px] left-1/2 -translate-x-1/2',
    position === 'bottom' && 'top-[-8px] left-1/2 -translate-x-1/2',
    position === 'left' && 'right-[-8px] top-1/2 -translate-y-1/2',
    position === 'right' && 'left-[-8px] top-1/2 -translate-y-1/2'
  );
  
  // 화살표 스타일 (색상은 인라인으로)
  const getArrowStyle = () => {
    const baseStyle = { borderStyle: 'solid' as const };
    
    switch (position) {
      case 'top':
        return {
          ...baseStyle,
          borderWidth: '8px 8px 0 8px',
          borderColor: `${bgColor} transparent transparent transparent`
        };
      case 'bottom':
        return {
          ...baseStyle,
          borderWidth: '0 8px 8px 8px',
          borderColor: `transparent transparent ${bgColor} transparent`
        };
      case 'left':
        return {
          ...baseStyle,
          borderWidth: '8px 0 8px 8px',
          borderColor: `transparent transparent transparent ${bgColor}`
        };
      case 'right':
        return {
          ...baseStyle,
          borderWidth: '8px 8px 8px 0',
          borderColor: `transparent ${bgColor} transparent transparent`
        };
      default:
        return {
          ...baseStyle,
          borderWidth: '8px 8px 0 8px',
          borderColor: `${bgColor} transparent transparent transparent`
        };
    }
  };

  // 툴팁 엘리먼트 (타겟이 보일 때만 렌더링)
  const tooltipElement = isVisible && isTargetInView && (
    <div
      ref={tooltipRef}
      style={tooltipInlineStyles}
      className={tooltipClasses}
      role="tooltip"
      aria-hidden={!isVisible || !isTargetInView}
    >
      {content}
      
      {/* 화살표 */}
      {showArrow && (
        <div
          className={arrowClasses}
          style={getArrowStyle()}
        />
      )}
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="inline-block"
        tabIndex={trigger === 'focus' ? 0 : undefined}
      >
        {children}
      </div>
      
      {/* Portal을 사용하여 body에 툴팁 렌더링 */}
      {isMounted && typeof document !== 'undefined' 
        ? createPortal(tooltipElement, document.body)
        : tooltipElement}
    </>
  );
};

export default Tooltip;
export type { TooltipProps } from './tooltip.model';