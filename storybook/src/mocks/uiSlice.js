// Mock uiSlice for Storybook
export const showLoading = (text) => ({
  type: 'ui/showLoading',
  payload: text
});

export const hideLoading = () => ({
  type: 'ui/hideLoading'
});

export const showMiniLoading = (text) => ({
  type: 'ui/showMiniLoading',
  payload: text
});

export const hideMiniLoading = () => ({
  type: 'ui/hideMiniLoading'
});

export const hideAllLoaders = () => ({
  type: 'ui/hideAllLoaders'
});

export const setLoadingText = (text) => ({
  type: 'ui/setLoadingText',
  payload: text
});

export const setMiniLoadingText = (text) => ({
  type: 'ui/setMiniLoadingText',
  payload: text
});

export const selectUIState = (state) => ({
  isLoading: false,
  isMiniLoading: false,
  loadingText: '',
  miniLoadingText: '',
  isAutoTransitioned: false
});

export default {
  showLoading,
  hideLoading,
  showMiniLoading,
  hideMiniLoading,
  hideAllLoaders,
  setLoadingText,
  setMiniLoadingText,
  selectUIState
};