/**
 * 문자열 변환 관련 유틸리티 함수들
 */
/**
 * snake_case 문자열을 camelCase로 변환
 * @param str snake_case 문자열
 * @returns camelCase 문자열
 */
export declare const toCamelCase: (str: string) => string;
/**
 * camelCase 문자열을 snake_case로 변환
 * @param str camelCase 문자열
 * @returns snake_case 문자열
 */
export declare const toSnakeCase: (str: string) => string;
/**
 * 객체의 키를 snake_case에서 camelCase로 변환
 * @param obj snake_case 키를 가진 객체
 * @returns camelCase 키를 가진 객체
 */
export declare const keysToCamelCase: <T extends Record<string, any>>(obj: T) => { [K in keyof T as K extends string ? CamelCase<K> : K]: T[K]; };
/**
 * 객체의 키를 camelCase에서 snake_case로 변환
 * @param obj camelCase 키를 가진 객체
 * @returns snake_case 키를 가진 객체
 */
export declare const keysToSnakeCase: <T extends Record<string, any>>(obj: T) => { [K in keyof T as K extends string ? SnakeCase<K> : K]: T[K]; };
type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}` ? `${P1}${Uppercase<P2>}${CamelCase<P3>}` : S;
type SnakeCase<S extends string> = S extends `${infer C}${infer T}` ? C extends Uppercase<C> ? `_${Lowercase<C>}${SnakeCase<T>}` : `${C}${SnakeCase<T>}` : S;
export {};
