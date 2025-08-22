import React from 'react';
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** Input 라벨 */
    label?: string;
    /** 에러 메시지 */
    error?: string;
    /** 도움말 텍스트 */
    helper?: string;
    /** 입력 타입 */
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
    /** 크기 variant */
    size?: 'sm' | 'md' | 'lg';
    /** 전체 너비 사용 여부 */
    fullWidth?: boolean;
    /** 입력 앞쪽 아이콘 또는 텍스트 */
    startAdornment?: React.ReactNode;
    /** 입력 뒤쪽 아이콘 또는 텍스트 */
    endAdornment?: React.ReactNode;
    /** 컨테이너 클래스 이름 */
    containerClassName?: string;
    /** 라벨 클래스 이름 */
    labelClassName?: string;
    /** 에러 텍스트 클래스 이름 */
    errorClassName?: string;
    /** 도움말 텍스트 클래스 이름 */
    helperClassName?: string;
}
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export { Input };
