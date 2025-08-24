// Mock appSlice for Storybook
export const updateDeviceTypeFromWidth = () => ({
  type: 'app/updateDeviceTypeFromWidth',
  payload: 'desktop'
});

export const selectAppState = (state) => ({
  deviceType: 'desktop',
  isLoading: false
});

export default {
  updateDeviceTypeFromWidth,
  selectAppState
};