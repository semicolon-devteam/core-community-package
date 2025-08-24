// Mock authUtil for Storybook
export const isAdmin = (user) => {
  return user?.is_admin || user?.permissionType === 'admin' || user?.permissionType === 'super_admin';
};

export const getUserLevel = (user) => {
  return user?.level || 0;
};

export const hasLevelPermission = (user, requiredLevel) => {
  const userLevel = getUserLevel(user);
  return userLevel >= requiredLevel;
};

export const hasAdminPermission = (user) => {
  return isAdmin(user);
};

export const checkPermission = (user, options = {}) => {
  const { requiredLevel = 0, adminOnly = false } = options;
  
  if (adminOnly && !hasAdminPermission(user)) {
    return false;
  }
  
  return hasLevelPermission(user, requiredLevel);
};

export default {
  isAdmin,
  getUserLevel,
  hasLevelPermission,
  hasAdminPermission,
  checkPermission
};