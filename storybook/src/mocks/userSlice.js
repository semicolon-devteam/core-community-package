// Mock userSlice for Storybook
export const login = (credentials) => ({
  type: 'user/login',
  payload: credentials
});

export const logout = () => ({
  type: 'user/logout'
});

export const autoLogin = () => ({
  type: 'user/autoLogin'
});

export const selectUserInfo = (state) => ({
  userInfo: {
    user_id: '1',
    nickname: '테스트 사용자',
    email: 'test@example.com',
    level: 1,
    is_admin: false,
    permissionType: 'user'
  },
  isLoggedIn: true,
  error: null,
  isLoading: false
});

export default {
  login,
  logout,
  autoLogin,
  selectUserInfo
};