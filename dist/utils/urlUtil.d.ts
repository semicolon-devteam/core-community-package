/**
 * URL 파라미터를 안전하게 추가/수정하는 유틸리티 함수
 */
export declare const addUrlParams: (baseUrl: string, params: Record<string, string>) => string;
/**
 * sessionStorage에서 이전 페이지 URL을 가져와서 파라미터를 추가한 후 반환
 */
export declare const getPreviousUrlWithParams: (storageKey: string, params: Record<string, string>, fallbackUrl?: string) => string;
