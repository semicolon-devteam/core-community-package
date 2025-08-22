export interface TooltipProps {
  /** 툴팁을 트리거할 자식 요소 */
  children: React.ReactNode;
  /** 툴팁에 표시될 내용 */
  content: string;
  /** 툴팁 표시 위치 */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** 툴팁 배경색 */
  backgroundColor?: string;
  /** 툴팁 텍스트 색상 */
  textColor?: string;
  /** 툴팁 표시 지연 시간 (ms) */
  delay?: number;
  /** 툴팁 비활성화 여부 */
  disabled?: boolean;
  /** 커스텀 CSS 클래스 */
  className?: string;
  /** 툴팁 최대 너비 */
  maxWidth?: number;
}

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';