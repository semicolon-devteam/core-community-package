import {
  hideAllLoaders,
  hideLoading,
  hideMiniLoading,
  selectUIState,
  setLoadingText,
  setMiniLoadingText,
  showLoading,
  showMiniLoading
} from "@redux/Features/UI/uiSlice";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./index";

export const useGlobalLoader = () => {
  const dispatch = useAppDispatch();
  const { isAutoTransitioned } = useAppSelector(selectUIState);

  // 기본 로더 (미니로더 사용) - 게시글 작성 외 모든 상황에서 사용
  const showLoader = useCallback((text?: string) => {
    dispatch(showMiniLoading(text));
  }, [dispatch]);

  const hideLoader = useCallback(() => {
    dispatch(hideMiniLoading());
  }, [dispatch]);

  const setLoaderText = useCallback((text?: string) => {
    dispatch(setMiniLoadingText(text));
  }, [dispatch]);

  const withLoader = useCallback(
    async <T>(asyncFn: () => Promise<T>): Promise<T> => {
      try {
        showLoader();
        const result = await asyncFn();
        return result;
      } finally {
        hideLoader();
      }
    },
    [showLoader, hideLoader]
  );

  // 게시글 작성용 풀스크린 로더
  const showPostLoader = useCallback((text?: string) => {
    dispatch(showLoading(text));
  }, [dispatch]);

  const hidePostLoader = useCallback(() => {
    // 자동 전환된 경우 모든 로더를 종료
    if (isAutoTransitioned) {
      dispatch(hideAllLoaders());
    } else {
      dispatch(hideLoading());
    }
  }, [dispatch, isAutoTransitioned]);

  const setPostLoaderText = useCallback((text?: string) => {
    dispatch(setLoadingText(text));
  }, [dispatch]);

  const withPostLoader = useCallback(
    async <T>(asyncFn: () => Promise<T>): Promise<T> => {
      try {
        showPostLoader();
        const result = await asyncFn();
        return result;
      } finally {
        hidePostLoader();
      }
    },
    [showPostLoader, hidePostLoader]
  );

  // Mini 로더 관련 함수들 (직접 사용할 때)
  const showMiniLoader = useCallback((text?: string) => {
    dispatch(showMiniLoading(text));
  }, [dispatch]);

  const hideMiniLoader = useCallback(() => {
    dispatch(hideMiniLoading());
  }, [dispatch]);

  const setMiniLoaderText = useCallback((text?: string) => {
    dispatch(setMiniLoadingText(text));
  }, [dispatch]);

  const withMiniLoader = useCallback(
    async <T>(asyncFn: () => Promise<T>): Promise<T> => {
      try {
        showMiniLoader();
        const result = await asyncFn();
        return result;
      } finally {
        hideMiniLoader();
      }
    },
    [showMiniLoader, hideMiniLoader]
  );

  return {
    // 기본 로더 (이제 미니로더 사용) - 게시글 작성 외 모든 상황
    showLoader,
    hideLoader,
    withLoader,
    setLoaderText,
    
    // 게시글 작성용 풀스크린 로더
    showPostLoader,
    hidePostLoader,
    withPostLoader,
    setPostLoaderText,
    
    // 직접 미니 로더 제어
    showMiniLoader,
    hideMiniLoader,
    withMiniLoader,
    setMiniLoaderText,
  };
}; 