import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';

/**
 * Redux context 가용성을 체크하는 안전한 글로벌 로더 훅
 * Redux context가 없는 환경에서도 안전하게 동작하도록 fallback 제공
 */
export function useSafeGlobalLoader() {
  const reduxContext = useContext(ReactReduxContext);
  
  if (!reduxContext) {
    return {
      showLoader: () => {},
      hideLoader: () => {}
    };
  }
  
  // Redux context가 있을 때만 useGlobalLoader 사용
  const { useGlobalLoader } = require('@hooks/common');
  return useGlobalLoader();
} 