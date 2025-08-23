import BaseService from './baseService';
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
export declare class UserService extends BaseService<User> {
    constructor(options?: UserServiceOptions);
    /**
     * Get current user's information
     */
    getMyInfo(): Promise<CommonResponse<User>>;
    /**
     * Get current user's permissions
     * @deprecated Use getMyInfo() instead as it includes permission information
     */
    getMyPermission(): Promise<CommonResponse<UserPermission>>;
    /**
     * Get current user's point balance
     */
    getMyPoint(): Promise<CommonResponse<number>>;
    /**
     * Get realtime user information (for live updates)
     */
    getRealtimeUser(): Promise<CommonResponse<string>>;
    /**
     * Get current user's ID
     */
    getUserId(): Promise<CommonResponse<string>>;
    /**
     * Get current user's UUID
     */
    getUserUuid(): Promise<CommonResponse<string>>;
    /**
     * Update user profile information
     */
    updateUserProfile(data: UserUpdateData): Promise<CommonResponse<User>>;
    /**
     * Refresh current user information (bypasses cache)
     */
    refreshMyInfo(): Promise<CommonResponse<User>>;
    /**
     * Get user information by search criteria
     */
    getUserInfo(options?: UserSearchOptions): Promise<CommonResponse<User>>;
    /**
     * Check if user ID already exists
     */
    checkUserIdExist(userId: string): Promise<CommonResponse<boolean>>;
    /**
     * Check if nickname already exists
     */
    checkNicknameExist(nickname: string): Promise<CommonResponse<boolean>>;
    /**
     * Get user by ID
     */
    getUserById(userId: string): Promise<CommonResponse<User>>;
    /**
     * Get users by IDs (batch operation)
     */
    getUsersByIds(userIds: string[]): Promise<CommonResponse<User[]>>;
    /**
     * Search users by keyword
     */
    searchUsers(keyword: string, page?: number, pageSize?: number): Promise<CommonResponse<{
        users: User[];
        totalCount: number;
    }>>;
    /**
     * Update user level (admin only)
     */
    updateUserLevel(userId: string, level: number): Promise<CommonResponse<User>>;
    /**
     * Ban/Unban user (admin only)
     */
    updateUserBanStatus(userId: string, isBanned: boolean, reason?: string): Promise<CommonResponse<User>>;
}
declare const userService: {
    getMyInfo(): Promise<CommonResponse<User>>;
    /**
     * @deprecated Use getMyInfo() instead as it includes permission information
     */
    getMyPermission(): Promise<CommonResponse<UserPermission>>;
    getMyPoint(): Promise<CommonResponse<number>>;
    getRealtimeUser(): Promise<CommonResponse<string>>;
    getUserId(): Promise<CommonResponse<string>>;
    getUserUuid(): Promise<CommonResponse<string>>;
    updateUserProfile(profileImage: string): Promise<CommonResponse<User>>;
    refreshMyInfo(): Promise<CommonResponse<User>>;
    getUserInfo(nickname?: string, needPoint?: boolean): Promise<CommonResponse<User>>;
    checkUserIdExist(userId: string): Promise<CommonResponse<boolean>>;
    checkNicknameExist(nickname: string): Promise<CommonResponse<boolean>>;
};
export { userService };
export default UserService;
