// Mock commonHooks for Storybook
import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => {
  return (action) => {
    console.log('Mock dispatch:', action);
    return Promise.resolve(action);
  };
};

export const useAppSelector = (selector) => {
  const mockState = {
    user: {
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
    },
    ui: {
      isLoading: false,
      isMiniLoading: false,
      loadingText: '',
      miniLoadingText: '',
      isAutoTransitioned: false
    },
    app: {
      deviceType: 'desktop',
      isLoading: false
    }
  };
  
  try {
    return selector(mockState);
  } catch (error) {
    console.warn('Mock selector error:', error);
    return {};
  }
};

export const getRealtimeUser = async () => {
  return {
    successOrNot: 'Y',
    data: {
      user_id: '1',
      nickname: '테스트 사용자',
      email: 'test@example.com',
      level: 1,
      is_admin: false
    }
  };
};

export default {
  useAppDispatch,
  useAppSelector,
  getRealtimeUser
};