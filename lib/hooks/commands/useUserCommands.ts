import { useAppDispatch } from '@hooks/common';
import { User } from '../../types/User';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { setUserInfo } from '@redux/Features/User/userSlice';
import userService from '@services/userService';

export const useUserCommands = () => {
  const dispatch = useAppDispatch();
  const updateUserProfile = async (profileImage: string) => {
    const response = await userService.updateUserProfile(profileImage);
    return response;
  };

  const refreshMyInfo = async () => {
    const response = await userService.refreshMyInfo();
    if (response.successOrNot === 'Y') {
      dispatch(setUserInfo(response.data as User));
      dispatch(
        showToast({
          title: '내 정보 갱신',
          content: '내 정보가 갱신되었습니다.',
          headerTextColor: 'text-green-500',
        })
      );
    }
    return response;
  };

  const getUserInfo = async (nickname: string, needPoint: boolean) => {
    const response = await userService.getUserInfo(nickname, needPoint);
    return response;
  };

  return {
    updateUserProfile,
    refreshMyInfo,
    getUserInfo,
  };
};
