import type { CommonResponse } from '@model/common';
import type { User, UserPermission } from '@model/User';
import baseService from '@services/baseService';

const userService = {
  getMyInfo(): Promise<CommonResponse<User>> {
    return baseService.getMini<User>('/api/user/me', '사용자 정보 확인중...');
  },
  /**
   * @deprecated /api/user/me에서 이미 권한 정보를 포함하여 반환하므로 이 메서드는 더 이상 필요하지 않습니다.
   * 대신 getMyInfo() 메서드를 사용하세요.
   */
  getMyPermission(): Promise<CommonResponse<UserPermission>> {
    return baseService.get<UserPermission>('/api/user/me/permission');
  },
  getMyPoint(): Promise<CommonResponse<number>> {
    return baseService.getMini<number>('/api/user/me/point', '포인트 조회중...');
  },
  getRealtimeUser(): Promise<CommonResponse<string>> {
    return baseService.get<string>('/api/user/realtime');
  },
  getUserId(): Promise<CommonResponse<string>> {
    return baseService.get<string>('/api/user/id');
  },
  getUserUuid(): Promise<CommonResponse<string>> {
    return baseService.get<string>('/api/user/uuid');
  },
  updateUserProfile(profileImage: string): Promise<CommonResponse<User>> {
    return baseService.patch<User, object>('/api/user/profile', {
      profileImage,
    });
  },
  refreshMyInfo(): Promise<CommonResponse<User>> {
    return baseService.get<User>('/api/user/me');
  },
  getUserInfo(
    nickname?: string,
    needPoint: boolean = false
  ): Promise<CommonResponse<User>> {
    const params = new URLSearchParams();
    if (nickname) {
      params.append('nickname', nickname);
    }
    if (needPoint) {
      params.append('needPoint', 'true');
    }
    return baseService.getMini<User>(
      `/api/user${params.toString() ? `?${params.toString()}` : ''}`,
      '사용자 정보 조회중...'
    );
  },
  checkUserIdExist(userId: string): Promise<CommonResponse<boolean>> {
    return baseService.post<boolean, object>('/api/user/check/id', {
      userId,
    });
  },
  checkNicknameExist(nickname: string): Promise<CommonResponse<boolean>> {
    return baseService.post<boolean, object>('/api/user/check/nickname', {
      nickname,
    });
  },
};

export default userService;

interface UserService {
  userId: string;
}
