import BaseService from './baseService';
import type { CommonResponse } from '../types/common';
/**
 * Permission service interfaces and types
 */
export interface PermissionServiceOptions {
    baseUrl?: string;
    defaultHeaders?: Record<string, string>;
}
export interface PermissionCheck {
    resource: string;
    action: string;
    context?: Record<string, any>;
}
export interface PermissionResult {
    allowed: boolean;
    reason?: string;
    requiredLevel?: number;
    requiredPermissions?: string[];
}
export interface UserPermissions {
    level: number;
    isAdmin: boolean;
    permissions: string[];
    roles: string[];
    restrictions?: string[];
}
export interface LevelInfo {
    level: number;
    name: string;
    description: string;
    requiredPoints: number;
    permissions: string[];
    benefits: string[];
    color?: string;
    icon?: string;
}
export interface RoleInfo {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    level: number;
    isSystem: boolean;
}
export interface PermissionGrant {
    userId: string;
    permission: string;
    context?: Record<string, any>;
    expiresAt?: string;
    grantedBy: string;
    reason?: string;
}
/**
 * Permission Service Class
 * Handles all permission and authorization operations including
 * level management, role assignments, and access control
 */
export declare class PermissionService extends BaseService {
    constructor(options?: PermissionServiceOptions);
    /**
     * Check if user has specific permission
     */
    checkPermission(check: PermissionCheck): Promise<CommonResponse<PermissionResult>>;
    /**
     * Check multiple permissions at once
     */
    checkPermissions(checks: PermissionCheck[]): Promise<CommonResponse<Record<string, PermissionResult>>>;
    /**
     * Get current user's permissions
     */
    getMyPermissions(): Promise<CommonResponse<UserPermissions>>;
    /**
     * Get user's permissions by ID (admin only)
     */
    getUserPermissions(userId: string): Promise<CommonResponse<UserPermissions>>;
    /**
     * Get all available permission levels
     */
    getLevels(): Promise<CommonResponse<LevelInfo[]>>;
    /**
     * Get specific level information
     */
    getLevel(level: number): Promise<CommonResponse<LevelInfo>>;
    /**
     * Update user level (admin only)
     */
    updateUserLevel(userId: string, level: number, reason?: string): Promise<CommonResponse<void>>;
    /**
     * Get all available roles
     */
    getRoles(): Promise<CommonResponse<RoleInfo[]>>;
    /**
     * Get specific role information
     */
    getRole(roleId: string): Promise<CommonResponse<RoleInfo>>;
    /**
     * Create new role (admin only)
     */
    createRole(role: Omit<RoleInfo, 'id' | 'isSystem'>): Promise<CommonResponse<RoleInfo>>;
    /**
     * Update role (admin only)
     */
    updateRole(roleId: string, updates: Partial<Omit<RoleInfo, 'id' | 'isSystem'>>): Promise<CommonResponse<RoleInfo>>;
    /**
     * Delete role (admin only)
     */
    deleteRole(roleId: string): Promise<CommonResponse<void>>;
    /**
     * Assign role to user (admin only)
     */
    assignRole(userId: string, roleId: string, reason?: string): Promise<CommonResponse<void>>;
    /**
     * Remove role from user (admin only)
     */
    removeRole(userId: string, roleId: string, reason?: string): Promise<CommonResponse<void>>;
    /**
     * Grant specific permission to user (admin only)
     */
    grantPermission(grant: PermissionGrant): Promise<CommonResponse<void>>;
    /**
     * Revoke specific permission from user (admin only)
     */
    revokePermission(userId: string, permission: string, context?: Record<string, any>, reason?: string): Promise<CommonResponse<void>>;
    /**
     * Get user's permission grants
     */
    getUserGrants(userId: string): Promise<CommonResponse<PermissionGrant[]>>;
    /**
     * Get permission grant history for user
     */
    getPermissionHistory(userId: string, page?: number, pageSize?: number): Promise<CommonResponse<{
        history: Array<{
            id: string;
            action: 'grant' | 'revoke' | 'level_change' | 'role_assign' | 'role_remove';
            permission?: string;
            role?: string;
            level?: number;
            grantedBy: string;
            reason?: string;
            timestamp: string;
        }>;
        totalCount: number;
    }>>;
    /**
     * Check if user can access specific board
     */
    checkBoardAccess(boardId: number, action?: 'read' | 'write' | 'comment' | 'moderate'): Promise<CommonResponse<PermissionResult>>;
    /**
     * Check if user can access specific post
     */
    checkPostAccess(postId: number, action?: 'read' | 'edit' | 'delete' | 'comment'): Promise<CommonResponse<PermissionResult>>;
    /**
     * Check admin permissions
     */
    checkAdminAccess(section?: 'users' | 'boards' | 'posts' | 'system' | 'reports'): Promise<CommonResponse<PermissionResult>>;
    /**
     * Get user level benefits and progression info
     */
    getLevelProgression(userId?: string): Promise<CommonResponse<{
        currentLevel: LevelInfo;
        nextLevel?: LevelInfo;
        progress: {
            currentPoints: number;
            pointsToNext: number;
            progressPercentage: number;
        };
        achievements: Array<{
            id: string;
            name: string;
            description: string;
            unlockedAt: string;
            level: number;
        }>;
    }>>;
    /**
     * Ban or unban user (admin only)
     */
    updateUserBanStatus(userId: string, banned: boolean, reason?: string, duration?: number): Promise<CommonResponse<void>>;
    /**
     * Get user's restriction status
     */
    getUserRestrictions(userId: string): Promise<CommonResponse<{
        isBanned: boolean;
        bannedUntil?: string;
        banReason?: string;
        restrictions: Array<{
            type: string;
            reason: string;
            expiresAt?: string;
        }>;
    }>>;
}
declare const permissionService: {
    checkPermission(check: PermissionCheck): Promise<CommonResponse<PermissionResult>>;
    getMyPermissions(): Promise<CommonResponse<UserPermissions>>;
    getLevels(): Promise<CommonResponse<LevelInfo[]>>;
    checkBoardAccess(boardId: number, action?: "read" | "write" | "comment" | "moderate"): Promise<CommonResponse<PermissionResult>>;
    checkAdminAccess(section?: "users" | "boards" | "posts" | "system" | "reports"): Promise<CommonResponse<PermissionResult>>;
};
export { permissionService };
export default PermissionService;
