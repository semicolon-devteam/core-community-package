// Mock popupSlice for Storybook
export const showPopup = (popup) => ({
  type: 'popup/showPopup',
  payload: popup
});

export const hidePopup = (id) => ({
  type: 'popup/hidePopup',
  payload: id
});

export default {
  showPopup,
  hidePopup
};