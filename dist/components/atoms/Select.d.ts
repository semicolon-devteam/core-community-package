import React from 'react';
export interface SelectOption<T = any> {
    id: string | number;
    label: string;
    value: T;
    icon?: string;
    description?: string;
    disabled?: boolean;
}
export interface SelectProps<T = any> {
    /** 옵션 목록 */
    options: SelectOption<T>[];
    /** 선택된 값 */
    value?: T;
    /** 값 변경 시 호출되는 함수 */
    onChange: (option: SelectOption<T>) => void;
    /** 플레이스홀더 텍스트 */
    placeholder?: string;
    /** 비활성화 여부 */
    disabled?: boolean;
    /** 라벨 */
    label?: string;
    /** 에러 메시지 */
    error?: string;
    /** 도움말 텍스트 */
    helper?: string;
    /** 크기 variant */
    size?: 'sm' | 'md' | 'lg';
    /** 전체 너비 사용 여부 */
    fullWidth?: boolean;
    /** 다중 선택 지원 여부 */
    multiple?: boolean;
    /** 검색 기능 활성화 여부 */
    searchable?: boolean;
    /** 검색 플레이스홀더 */
    searchPlaceholder?: string;
    /** 아이콘 표시 여부 */
    showIcon?: boolean;
    /** 설명 표시 여부 */
    showDescription?: boolean;
    /** 드롭다운 최대 높이 */
    maxHeight?: string;
    /** 빈 결과 메시지 */
    noOptionsText?: string;
    /** 컨테이너 클래스 이름 */
    className?: string;
    /** 드롭다운 클래스 이름 */
    dropdownClassName?: string;
    /** 라벨 클래스 이름 */
    labelClassName?: string;
    /** 에러 텍스트 클래스 이름 */
    errorClassName?: string;
    /** 도움말 텍스트 클래스 이름 */
    helperClassName?: string;
}
declare const Select: React.ForwardRefExoticComponent<SelectProps<any> & React.RefAttributes<HTMLDivElement>>;
export { Select };
