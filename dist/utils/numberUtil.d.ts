/**
 * 숫자를 1000 단위로 콤마(,)를 찍어서 문자열로 변환
 * @param num 변환할 숫자 또는 숫자 형태의 문자열
 * @returns 1000단위로 콤마가 포함된 문자열
 */
export declare const formatNumberWithComma: (num: number | string) => string;
/**
 * 문자열에서 콤마를 제거하고 숫자로 변환
 * @param str 콤마가 포함된 문자열
 * @returns 콤마가 제거된 숫자
 */
export declare const removeCommaFromString: (str: string) => number;
