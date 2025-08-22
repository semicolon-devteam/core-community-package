import React from 'react';
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
    /** 체크 상태 */
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
    /** 중간 상태 (indeterminate) */
    indeterminate?: boolean;
    /** 라벨 위치 */
    labelPosition?: 'left' | 'right';
    /** 컨테이너 클래스 이름 */
    containerClassName?: string;
    /** 라벨 클래스 이름 */
    labelClassName?: string;
    /** 에러 텍스트 클래스 이름 */
    errorClassName?: string;
    /** 도움말 텍스트 클래스 이름 */
    helperClassName?: string;
}
declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;
export { Checkbox };
