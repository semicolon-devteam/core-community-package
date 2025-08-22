import React from 'react';
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    /** TextArea 라벨 */
    label?: string;
    /** 에러 메시지 */
    error?: string;
    /** 도움말 텍스트 */
    helper?: string;
    /** 크기 variant */
    size?: 'sm' | 'md' | 'lg';
    /** 전체 너비 사용 여부 */
    fullWidth?: boolean;
    /** 자동 리사이징 활성화 */
    autoResize?: boolean;
    /** 최소 높이 */
    minHeight?: number;
    /** 최대 높이 */
    maxHeight?: number;
    /** 글자 수 제한 */
    maxLength?: number;
    /** 글자 수 표시 여부 */
    showCount?: boolean;
    /** 컨테이너 클래스 이름 */
    containerClassName?: string;
    /** 라벨 클래스 이름 */
    labelClassName?: string;
    /** 에러 텍스트 클래스 이름 */
    errorClassName?: string;
    /** 도움말 텍스트 클래스 이름 */
    helperClassName?: string;
    /** 글자 수 카운터 클래스 이름 */
    countClassName?: string;
}
declare const TextArea: React.ForwardRefExoticComponent<TextAreaProps & React.RefAttributes<HTMLTextAreaElement>>;
export { TextArea };
