// Form Components 공통 타입 정의

export interface BaseFormProps {
  /** 라벨 */
  label?: string;
  /** 에러 메시지 */
  error?: string;
  /** 도움말 텍스트 */
  helper?: string;
  /** 크기 variant */
  size?: 'sm' | 'md' | 'lg';
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 필수 입력 여부 */
  required?: boolean;
  /** 컨테이너 클래스 이름 */
  containerClassName?: string;
  /** 라벨 클래스 이름 */
  labelClassName?: string;
  /** 에러 텍스트 클래스 이름 */
  errorClassName?: string;
  /** 도움말 텍스트 클래스 이름 */
  helperClassName?: string;
}

// Input 관련 타입
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

// Select 관련 타입
export interface SelectOption<T = any> {
  id: string | number;
  label: string;
  value: T;
  icon?: string;
  description?: string;
  disabled?: boolean;
}

// Form 검증 관련 타입
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | undefined;
}

export interface FormFieldState {
  value: any;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

// Form 그룹 관련 타입
export interface FormGroupProps extends BaseFormProps {
  /** 그룹 제목 */
  title?: string;
  /** 그룹 설명 */
  description?: string;
  /** 자식 요소 */
  children: React.ReactNode;
  /** 그룹 배치 방향 */
  direction?: 'row' | 'column';
  /** 간격 */
  gap?: 'sm' | 'md' | 'lg';
}

// Radio Group 관련 타입
export interface RadioGroupProps extends Omit<BaseFormProps, 'size'> {
  /** 선택된 값 */
  value?: string;
  /** 값 변경 시 호출되는 함수 */
  onChange?: (value: string) => void;
  /** Radio 그룹명 */
  name: string;
  /** 옵션 목록 */
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  /** 배치 방향 */
  direction?: 'row' | 'column';
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
}

// Checkbox Group 관련 타입
export interface CheckboxGroupProps extends Omit<BaseFormProps, 'size'> {
  /** 선택된 값들 */
  value?: string[];
  /** 값 변경 시 호출되는 함수 */
  onChange?: (values: string[]) => void;
  /** 옵션 목록 */
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  /** 배치 방향 */
  direction?: 'row' | 'column';
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
}

// Form 이벤트 관련 타입
export type FormEventHandler<T = any> = (value: T, event?: React.ChangeEvent<any>) => void;
export type FormSubmitHandler<T = any> = (data: T) => void | Promise<void>;
export type FormValidateHandler<T = any> = (data: T) => Record<string, string> | undefined;