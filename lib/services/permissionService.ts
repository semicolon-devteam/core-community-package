import BaseService from './baseService';
import type { CommonResponse } from '../types/common';
import type { User } from '../types/User';

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
export class PermissionService extends BaseService {
  constructor(options?: PermissionServiceOptions) {
    super(options?.baseUrl || '/api/permissions', options?.defaultHeaders);
  }

  /**
   * Check if user has specific permission
   */
  async checkPermission(check: PermissionCheck): Promise<CommonResponse<PermissionResult>> {
    return this.getSilent<PermissionResult>('/check', {
      params: {
        resource: check.resource,
        action: check.action,
        context: check.context ? JSON.stringify(check.context) : undefined
      }
    });
  }

  /**
   * Check multiple permissions at once
   */
  async checkPermissions(
    checks: PermissionCheck[]
  ): Promise<CommonResponse<Record<string, PermissionResult>>> {
    return this.postSilent<Record<string, PermissionResult>, { checks: PermissionCheck[] }>(
      '/check-multiple',
      { checks }
    );
  }

  /**
   * Get current user's permissions
   */
  async getMyPermissions(): Promise<CommonResponse<UserPermissions>> {
    return this.getMini<UserPermissions>('/me', '권한 정보 조회 중...');
  }

  /**
   * Get user's permissions by ID (admin only)
   */
  async getUserPermissions(userId: string): Promise<CommonResponse<UserPermissions>> {
    return this.get<UserPermissions>(`/users/${userId}`);
  }

  /**
   * Get all available permission levels
   */
  async getLevels(): Promise<CommonResponse<LevelInfo[]>> {
    return this.getSilent<LevelInfo[]>('/levels');
  }

  /**
   * Get specific level information
   */
  async getLevel(level: number): Promise<CommonResponse<LevelInfo>> {
    return this.get<LevelInfo>(`/levels/${level}`);
  }

  /**
   * Update user level (admin only)
   */
  async updateUserLevel(userId: string, level: number, reason?: string): Promise<CommonResponse<void>> {
    return this.patchMini<void, { level: number; reason?: string }>(
      `/users/${userId}/level`,
      { level, reason },
      '사용자 레벨 변경 중...'
    );
  }

  /**
   * Get all available roles
   */
  async getRoles(): Promise<CommonResponse<RoleInfo[]>> {
    return this.get<RoleInfo[]>('/roles');
  }

  /**
   * Get specific role information
   */
  async getRole(roleId: string): Promise<CommonResponse<RoleInfo>> {
    return this.get<RoleInfo>(`/roles/${roleId}`);
  }

  /**
   * Create new role (admin only)
   */
  async createRole(role: Omit<RoleInfo, 'id' | 'isSystem'>): Promise<CommonResponse<RoleInfo>> {
    return this.postMini<RoleInfo, typeof role>(
      '/roles',
      role,
      '역할 생성 중...'
    );
  }

  /**
   * Update role (admin only)
   */
  async updateRole(
    roleId: string, 
    updates: Partial<Omit<RoleInfo, 'id' | 'isSystem'>>
  ): Promise<CommonResponse<RoleInfo>> {
    return this.putMini<RoleInfo, typeof updates>(
      `/roles/${roleId}`,
      updates,
      '역할 수정 중...'
    );
  }

  /**
   * Delete role (admin only)
   */
  async deleteRole(roleId: string): Promise<CommonResponse<void>> {
    return this.deleteMini<void>(`/roles/${roleId}`, '역할 삭제 중...');
  }

  /**
   * Assign role to user (admin only)
   */
  async assignRole(userId: string, roleId: string, reason?: string): Promise<CommonResponse<void>> {
    return this.postMini<void, { roleId: string; reason?: string }>(
      `/users/${userId}/roles`,
      { roleId, reason },
      '역할 할당 중...'
    );
  }

  /**
   * Remove role from user (admin only)
   */
  async removeRole(userId: string, roleId: string, reason?: string): Promise<CommonResponse<void>> {
    return this.deleteMini<void>(
      `/users/${userId}/roles/${roleId}`,
      '역할 제거 중...'
    );
  }

  /**
   * Grant specific permission to user (admin only)
   */
  async grantPermission(grant: PermissionGrant): Promise<CommonResponse<void>> {
    return this.postMini<void, PermissionGrant>(
      '/grants',
      grant,
      '권한 부여 중...'
    );
  }

  /**
   * Revoke specific permission from user (admin only)
   */
  async revokePermission(
    userId: string, 
    permission: string,
    context?: Record<string, any>,
    reason?: string
  ): Promise<CommonResponse<void>> {
    return this.deleteMini<void>(
      `/grants/${userId}/${permission}`,
      '권한 회수 중...'
    );
  }

  /**
   * Get user's permission grants
   */
  async getUserGrants(userId: string): Promise<CommonResponse<PermissionGrant[]>> {
    return this.get<PermissionGrant[]>(`/grants/users/${userId}`);
  }

  /**
   * Get permission grant history for user
   */
  async getPermissionHistory(
    userId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<CommonResponse<{
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
  }>> {
    return this.get<any>(`/history/${userId}`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Check if user can access specific board
   */
  async checkBoardAccess(
    boardId: number,
    action: 'read' | 'write' | 'comment' | 'moderate' = 'read'
  ): Promise<CommonResponse<PermissionResult>> {
    return this.checkPermission({
      resource: 'board',
      action,
      context: { boardId }
    });
  }

  /**
   * Check if user can access specific post
   */
  async checkPostAccess(
    postId: number,
    action: 'read' | 'edit' | 'delete' | 'comment' = 'read'
  ): Promise<CommonResponse<PermissionResult>> {
    return this.checkPermission({
      resource: 'post',
      action,
      context: { postId }
    });
  }

  /**
   * Check admin permissions
   */
  async checkAdminAccess(
    section: 'users' | 'boards' | 'posts' | 'system' | 'reports' = 'system'
  ): Promise<CommonResponse<PermissionResult>> {
    return this.checkPermission({
      resource: 'admin',
      action: 'access',
      context: { section }
    });
  }

  /**
   * Get user level benefits and progression info
   */
  async getLevelProgression(userId?: string): Promise<CommonResponse<{
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
  }>> {
    const endpoint = userId ? `/progression/${userId}` : '/progression/me';
    return this.getMini<any>(endpoint, '레벨 정보 조회 중...');
  }

  /**
   * Ban or unban user (admin only)
   */
  async updateUserBanStatus(
    userId: string,
    banned: boolean,
    reason?: string,
    duration?: number
  ): Promise<CommonResponse<void>> {
    return this.patchMini<void, {
      banned: boolean;
      reason?: string;
      duration?: number;
    }>(
      `/users/${userId}/ban`,
      { banned, reason, duration },
      banned ? '사용자 제재 중...' : '사용자 제재 해제 중...'
    );
  }

  /**
   * Get user's restriction status
   */
  async getUserRestrictions(userId: string): Promise<CommonResponse<{
    isBanned: boolean;
    bannedUntil?: string;
    banReason?: string;
    restrictions: Array<{
      type: string;
      reason: string;
      expiresAt?: string;
    }>;
  }>> {
    return this.get<any>(`/users/${userId}/restrictions`);
  }
}

// Legacy support - functional interface (deprecated, use PermissionService class instead)
const permissionService = {
  checkPermission(check: PermissionCheck): Promise<CommonResponse<PermissionResult>> {
    const service = new PermissionService();
    return service.checkPermission(check);
  },

  getMyPermissions(): Promise<CommonResponse<UserPermissions>> {
    const service = new PermissionService();
    return service.getMyPermissions();
  },

  getLevels(): Promise<CommonResponse<LevelInfo[]>> {
    const service = new PermissionService();
    return service.getLevels();
  },

  checkBoardAccess(
    boardId: number,
    action: 'read' | 'write' | 'comment' | 'moderate' = 'read'
  ): Promise<CommonResponse<PermissionResult>> {
    const service = new PermissionService();
    return service.checkBoardAccess(boardId, action);
  },

  checkAdminAccess(
    section: 'users' | 'boards' | 'posts' | 'system' | 'reports' = 'system'
  ): Promise<CommonResponse<PermissionResult>> {
    const service = new PermissionService();
    return service.checkAdminAccess(section);
  },
};

export { permissionService };
export default PermissionService;