export interface TooltipProps {
  /** 툴팁을 트리거할 자식 요소 */
  children: React.ReactNode;
  /** 툴팁에 표시될 내용 */
  content: string | React.ReactNode;
  /** 툴팁 표시 위치 */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** 툴팁 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 툴팁 variant */
  variant?: 'default' | 'dark' | 'light' | 'primary' | 'success' | 'warning' | 'error';
  /** 툴팁 표시 지연 시간 (ms) */
  delay?: number;
  /** 툴팁 비활성화 여부 */
  disabled?: boolean;
  /** 커스텀 CSS 클래스 */
  className?: string;
  /** 툴팁 최대 너비 */
  maxWidth?: number;
  /** 트리거 방식 */
  trigger?: 'hover' | 'click' | 'focus';
  /** 화살표 표시 여부 */
  showArrow?: boolean;
  /** 애니메이션 지속 시간 */
  animationDuration?: number;
  /** 항상 표시 여부 (트리거 무시) */
  forceVisible?: boolean;
}

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type TooltipSize = 'sm' | 'md' | 'lg';
export type TooltipVariant = 'default' | 'dark' | 'light' | 'primary' | 'success' | 'warning' | 'error';
export type TooltipTrigger = 'hover' | 'click' | 'focus';