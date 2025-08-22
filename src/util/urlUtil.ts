/**
 * URL 파라미터를 안전하게 추가/수정하는 유틸리티 함수
 */
export const addUrlParams = (
  baseUrl: string, 
  params: Record<string, string>
): string => {
  try {
    // 절대 URL인지 상대 URL인지 확인
    const url = baseUrl.startsWith('http') 
      ? new URL(baseUrl)
      : new URL(baseUrl, window.location.origin);
    
    const searchParams = new URLSearchParams(url.search);
    
    // 새로운 파라미터들을 추가/업데이트
    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, value);
    });
    
    // pathname과 새로운 search params를 결합
    return `${url.pathname}?${searchParams.toString()}`;
  } catch (error) {
    console.error('URL 파싱 오류:', error);
    throw new Error('유효하지 않은 URL입니다.');
  }
};

/**
 * sessionStorage에서 이전 페이지 URL을 가져와서 파라미터를 추가한 후 반환
 */
export const getPreviousUrlWithParams = (
  storageKey: string,
  params: Record<string, string>,
  fallbackUrl: string = '/'
): string => {
  const previousUrl = sessionStorage.getItem(storageKey);
  
  if (!previousUrl) {
    return fallbackUrl;
  }
  
  try {
    return addUrlParams(previousUrl, params);
  } catch (error) {
    console.error('이전 URL 처리 오류:', error);
    return fallbackUrl;
  }
}; 