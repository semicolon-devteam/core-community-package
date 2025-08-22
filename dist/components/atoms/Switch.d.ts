import React from 'react';
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
    /** 활성화 상태 */
    checked?: boolean;
    /** 값 변경 시 호출되는 함수 */
    onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
    /** 라벨 텍스트 */
    label?: string;
    /** 에러 메시지 */
    error?: string;
    /** 도움말 텍스트 */
    helper?: string;
    /** 크기 variant */
    size?: 'sm' | 'md' | 'lg';
    /** 라벨 위치 */
    labelPosition?: 'left' | 'right';
    /** 활성화 시 표시할 텍스트 */
    onText?: string;
    /** 비활성화 시 표시할 텍스트 */
    offText?: string;
    /** 컨테이너 클래스 이름 */
    containerClassName?: string;
    /** 라벨 클래스 이름 */
    labelClassName?: string;
    /** 에러 텍스트 클래스 이름 */
    errorClassName?: string;
    /** 도움말 텍스트 클래스 이름 */
    helperClassName?: string;
}
declare const Switch: React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLInputElement>>;
export { Switch };
