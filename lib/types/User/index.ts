/**
 * FireStore Info
 * @collection User
 * @depth Root
 */

/**
 * @description C: Customer, A: Admin, V: Vendor
 */


export type permissionType =
  | 'anonymous'
  | 'user'
  | 'staff'
  | 'manager'
  | 'moderator'
  | 'admin'
  | 'super_admin';

export interface User {
  id: string; //로그인 아이디
  nickname: string;
  point: number;
  level: number;
  profileImage: string;
  permissionType: permissionType;
  user_id: number; // JWT 기반 사용자 ID
}

export interface UserMetadata {
  email: string;
  email_verified: boolean;
  login_id: string;
  nickname: string;
  phone_verified: boolean;
  role: string;
  sub: string;
}

export interface UserInfo {
  id: number;
  nickname: string;
  point: number;
  level: number;
  profileImage: string;
}

export interface UserPermission {
  level: number;
  permissionType: permissionType;
}
