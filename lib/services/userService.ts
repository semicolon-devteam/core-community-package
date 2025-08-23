import BaseService, { baseService } from './baseService';
import type { CommonResponse } from '../types/common';
import type { User } from '../types/User';

/**
 * User service interfaces and types
 */
export interface UserServiceOptions {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
}

export interface UserPermission {
  level: number;
  isAdmin: boolean;
  permissions: string[];
}

export interface UserUpdateData {
  profileImage?: string;
  nickname?: string;
  email?: string;
  bio?: string;
}

export interface UserSearchOptions {
  nickname?: string;
  needPoint?: boolean;
  includePermissions?: boolean;
}

/**
 * User Service Class
 * Handles all user-related API operations with consistent error handling
 * and global loading integration
 */
export class UserService extends BaseService<User> {
  constructor(options?: UserServiceOptions) {
    super(options?.baseUrl || '/api/user', options?.defaultHeaders);
  }

  /**
   * Get current user's information
   */
  async getMyInfo(): Promise<CommonResponse<User>> {
    return this.getMini<User>('/me', '사용자 정보 확인중...');
  }

  /**
   * Get current user's permissions
   * @deprecated Use getMyInfo() instead as it includes permission information
   */
  async getMyPermission(): Promise<CommonResponse<UserPermission>> {
    return this.get<UserPermission>('/me/permission');
  }

  /**
   * Get current user's point balance
   */
  async getMyPoint(): Promise<CommonResponse<number>> {
    return this.getMini<number>('/me/point', '포인트 조회중...');
  }

  /**
   * Get realtime user information (for live updates)
   */
  async getRealtimeUser(): Promise<CommonResponse<string>> {
    return this.getSilent<string>('/realtime');
  }

  /**
   * Get current user's ID
   */
  async getUserId(): Promise<CommonResponse<string>> {
    return this.get<string>('/id');
  }

  /**
   * Get current user's UUID
   */
  async getUserUuid(): Promise<CommonResponse<string>> {
    return this.get<string>('/uuid');
  }

  /**
   * Update user profile information
   */
  async updateUserProfile(data: UserUpdateData): Promise<CommonResponse<User>> {
    return this.patch<User, UserUpdateData>('/profile', data);
  }

  /**
   * Refresh current user information (bypasses cache)
   */
  async refreshMyInfo(): Promise<CommonResponse<User>> {
    return this.get<User>('/me', { headers: { 'Cache-Control': 'no-cache' } });
  }

  /**
   * Get user information by search criteria
   */
  async getUserInfo(options: UserSearchOptions = {}): Promise<CommonResponse<User>> {
    const params: Record<string, string> = {};
    
    if (options.nickname) {
      params.nickname = options.nickname;
    }
    if (options.needPoint) {
      params.needPoint = 'true';
    }
    if (options.includePermissions) {
      params.includePermissions = 'true';
    }

    return this.getMini<User>('/', '사용자 정보 조회중...', { params });
  }

  /**
   * Check if user ID already exists
   */
  async checkUserIdExist(userId: string): Promise<CommonResponse<boolean>> {
    return this.post<boolean, { userId: string }>('/check/id', { userId });
  }

  /**
   * Check if nickname already exists
   */
  async checkNicknameExist(nickname: string): Promise<CommonResponse<boolean>> {
    return this.post<boolean, { nickname: string }>('/check/nickname', { nickname });
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<CommonResponse<User>> {
    return this.get<User>(`/${userId}`);
  }

  /**
   * Get users by IDs (batch operation)
   */
  async getUsersByIds(userIds: string[]): Promise<CommonResponse<User[]>> {
    return this.post<User[], { userIds: string[] }>('/batch', { userIds });
  }

  /**
   * Search users by keyword
   */
  async searchUsers(
    keyword: string, 
    page: number = 1, 
    pageSize: number = 10
  ): Promise<CommonResponse<{ users: User[]; totalCount: number }>> {
    return this.get<{ users: User[]; totalCount: number }>('/search', {
      params: { keyword, page, pageSize }
    });
  }

  /**
   * Update user level (admin only)
   */
  async updateUserLevel(userId: string, level: number): Promise<CommonResponse<User>> {
    return this.patch<User, { level: number }>(`/${userId}/level`, { level });
  }

  /**
   * Ban/Unban user (admin only)
   */
  async updateUserBanStatus(
    userId: string, 
    isBanned: boolean, 
    reason?: string
  ): Promise<CommonResponse<User>> {
    return this.patch<User, { isBanned: boolean; reason?: string }>(
      `/${userId}/ban-status`, 
      { isBanned, reason }
    );
  }
}

// Legacy support - functional interface (deprecated, use UserService class instead)
const userService = {
  getMyInfo(): Promise<CommonResponse<User>> {
    const service = new UserService();
    return service.getMyInfo();
  },
  
  /**
   * @deprecated Use getMyInfo() instead as it includes permission information
   */
  getMyPermission(): Promise<CommonResponse<UserPermission>> {
    const service = new UserService();
    return service.getMyPermission();
  },
  
  getMyPoint(): Promise<CommonResponse<number>> {
    const service = new UserService();
    return service.getMyPoint();
  },
  
  getRealtimeUser(): Promise<CommonResponse<string>> {
    const service = new UserService();
    return service.getRealtimeUser();
  },
  
  getUserId(): Promise<CommonResponse<string>> {
    const service = new UserService();
    return service.getUserId();
  },
  
  getUserUuid(): Promise<CommonResponse<string>> {
    const service = new UserService();
    return service.getUserUuid();
  },
  
  updateUserProfile(profileImage: string): Promise<CommonResponse<User>> {
    const service = new UserService();
    return service.updateUserProfile({ profileImage });
  },
  
  refreshMyInfo(): Promise<CommonResponse<User>> {
    const service = new UserService();
    return service.refreshMyInfo();
  },
  
  getUserInfo(
    nickname?: string,
    needPoint: boolean = false
  ): Promise<CommonResponse<User>> {
    const service = new UserService();
    return service.getUserInfo({ nickname, needPoint });
  },
  
  checkUserIdExist(userId: string): Promise<CommonResponse<boolean>> {
    const service = new UserService();
    return service.checkUserIdExist(userId);
  },
  
  checkNicknameExist(nickname: string): Promise<CommonResponse<boolean>> {
    const service = new UserService();
    return service.checkNicknameExist(nickname);
  },
};

export { userService };
export default UserService;
