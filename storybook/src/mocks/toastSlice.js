// Mock toastSlice for Storybook
export const showToast = (toast) => ({
  type: 'toast/showToast',
  payload: toast
});

export const hideToast = (id) => ({
  type: 'toast/hideToast',
  payload: id
});

export default {
  showToast,
  hideToast
};