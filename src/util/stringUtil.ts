/**
 * 문자열 변환 관련 유틸리티 함수들
 */

/**
 * snake_case 문자열을 camelCase로 변환
 * @param str snake_case 문자열
 * @returns camelCase 문자열
 */
export const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * camelCase 문자열을 snake_case로 변환
 * @param str camelCase 문자열
 * @returns snake_case 문자열
 */
export const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * 객체의 키를 snake_case에서 camelCase로 변환
 * @param obj snake_case 키를 가진 객체
 * @returns camelCase 키를 가진 객체
 */
export const keysToCamelCase = <T extends Record<string, any>>(
  obj: T
): { [K in keyof T as K extends string ? CamelCase<K> : K]: T[K] } => {
  if (obj === null || obj === undefined) {
    return obj as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => 
      typeof item === 'object' && item !== null ? keysToCamelCase(item) : item
    ) as any;
  }

  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = toCamelCase(key);
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[camelKey] = keysToCamelCase(value);
      } else if (Array.isArray(value)) {
        result[camelKey] = value.map(item =>
          typeof item === 'object' && item !== null ? keysToCamelCase(item) : item
        );
      } else {
        result[camelKey] = value;
      }
    }
    
    return result as any;
  }

  return obj as any;
};

/**
 * 객체의 키를 camelCase에서 snake_case로 변환
 * @param obj camelCase 키를 가진 객체
 * @returns snake_case 키를 가진 객체
 */
export const keysToSnakeCase = <T extends Record<string, any>>(
  obj: T
): { [K in keyof T as K extends string ? SnakeCase<K> : K]: T[K] } => {
  if (obj === null || obj === undefined) {
    return obj as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => 
      typeof item === 'object' && item !== null ? keysToSnakeCase(item) : item
    ) as any;
  }

  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = toSnakeCase(key);
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[snakeKey] = keysToSnakeCase(value);
      } else if (Array.isArray(value)) {
        result[snakeKey] = value.map(item =>
          typeof item === 'object' && item !== null ? keysToSnakeCase(item) : item
        );
      } else {
        result[snakeKey] = value;
      }
    }
    
    return result as any;
  }

  return obj as any;
};

// 타입 헬퍼들
type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${P1}${Uppercase<P2>}${CamelCase<P3>}`
  : S;

type SnakeCase<S extends string> = S extends `${infer C}${infer T}`
  ? C extends Uppercase<C>
    ? `_${Lowercase<C>}${SnakeCase<T>}`
    : `${C}${SnakeCase<T>}`
  : S; 