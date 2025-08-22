/**
 * 숫자를 1000 단위로 콤마(,)를 찍어서 문자열로 변환
 * @param num 변환할 숫자 또는 숫자 형태의 문자열
 * @returns 1000단위로 콤마가 포함된 문자열
 */
export const formatNumberWithComma = (num: number | string): string => {

    if (num === null || num === undefined || num === '') {
        return '';
    }
    
    // 숫자나 문자열을 문자열로 변환
    const numStr: string = typeof num === 'number' ? num.toString() : num;
    
    // 소수점이 있는 경우 처리
    const parts = numStr.split('.');
    
    // 정수 부분에 3자리마다 콤마 추가
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // 소수점이 있으면 다시 합치고, 없으면 정수 부분만 반환
    return parts.length > 1 ? parts.join('.') : parts[0];
};

/**
 * 문자열에서 콤마를 제거하고 숫자로 변환
 * @param str 콤마가 포함된 문자열
 * @returns 콤마가 제거된 숫자
 */
export const removeCommaFromString = (str: string): number => {
  if (!str) return 0;
  return parseFloat(str.replace(/,/g, ''));
};
