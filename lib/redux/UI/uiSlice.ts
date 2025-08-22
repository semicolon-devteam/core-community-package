import type { RootState } from "@redux/stores";
import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  isMobileMenuOpen: boolean;
  isMobile: boolean;
  isSearchExpanded: boolean;
  isLoading: boolean;
  loadingText: string;
  isMiniLoading: boolean;
  miniLoadingText: string;
  isAutoTransitioned: boolean; // 전체 로더에서 미니 로더로 자동 전환되었는지 여부
}

const initialState: UIState = {
  isMobileMenuOpen: false,
  isMobile: false,
  isSearchExpanded: false,
  isLoading: false,
  loadingText: "잠시만 기다려주세요...",
  isMiniLoading: false,
  miniLoadingText: "처리중...",
  isAutoTransitioned: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    openMobileMenu: (state) => {
      state.isMobileMenuOpen = true;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    toggleSearchExpand: (state) => {
      state.isSearchExpanded = !state.isSearchExpanded;
    },
    expandSearch: (state) => {
      state.isSearchExpanded = true;
    },
    collapseSearch: (state) => {
      state.isSearchExpanded = false;
    },
    showLoading: (state, action) => {
      state.isLoading = true;
      state.loadingText = action.payload || "잠시만 기다려주세요...";
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
    setLoadingText: (state, action) => {
      state.loadingText = action.payload;
    },
    showMiniLoading: (state, action) => {
      state.isMiniLoading = true;
      state.miniLoadingText = action.payload || "처리중...";
    },
    hideMiniLoading: (state) => {
      state.isMiniLoading = false;
    },
    setMiniLoadingText: (state, action) => {
      state.miniLoadingText = action.payload;
    },
    // 전체 로더를 미니 로더로 자동 전환
    transitionToMiniLoader: (state, action) => {
      state.isLoading = false;
      state.isMiniLoading = true;
      state.miniLoadingText = action.payload || state.loadingText;
      state.isAutoTransitioned = true;
    },
    // 로더 완전 종료 (자동 전환 상태 초기화)
    hideAllLoaders: (state) => {
      state.isLoading = false;
      state.isMiniLoading = false;
      state.isAutoTransitioned = false;
    },
  },
});

export const {
  toggleMobileMenu,
  openMobileMenu,
  closeMobileMenu,
  setIsMobile,
  toggleSearchExpand,
  expandSearch,
  collapseSearch,
  showLoading,
  hideLoading,
  setLoadingText,
  showMiniLoading,
  hideMiniLoading,
  setMiniLoadingText,
  transitionToMiniLoader,
  hideAllLoaders,
} = uiSlice.actions;

export const selectUIState = (state: RootState) => state.uiSlice;

export default uiSlice.reducer;
