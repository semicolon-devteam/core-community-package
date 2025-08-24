// Mock jwtUtil for Storybook
export const getCurrentUserFromToken = async () => {
  return {
    user_id: '1',
    nickname: '테스트 사용자',
    email: 'test@example.com',
    level: 1,
    is_admin: false,
    permissionType: 'user',
    exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
  };
};

export const isTokenExpired = (payload) => {
  if (!payload || !payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
};

export const validateAndCleanToken = async () => {
  return true;
};

export const removeExpiredTokenFromCookie = async () => {
  return true;
};

export default {
  getCurrentUserFromToken,
  isTokenExpired,
  validateAndCleanToken,
  removeExpiredTokenFromCookie
};