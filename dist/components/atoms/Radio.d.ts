import React from 'react';
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
    /** 체크 상태 */
    checked?: boolean;
    /** 값 변경 시 호출되는 함수 */
    onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
    /** Radio 그룹명 */
    name: string;
    /** Radio 값 */
    value: string;
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
    /** 컨테이너 클래스 이름 */
    containerClassName?: string;
    /** 라벨 클래스 이름 */
    labelClassName?: string;
    /** 에러 텍스트 클래스 이름 */
    errorClassName?: string;
    /** 도움말 텍스트 클래스 이름 */
    helperClassName?: string;
    /** 자식 요소 (라벨 대신 사용) */
    children?: React.ReactNode;
}
declare const Radio: React.ForwardRefExoticComponent<RadioProps & React.RefAttributes<HTMLInputElement>>;
export { Radio };
