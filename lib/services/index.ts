// Service Classes (Modern, Recommended)
export { default as BaseService, baseService } from './baseService';
export { default as UserService, userService } from './userService';  
export { default as PostService, postService } from './postService';
export { default as BoardService, boardService } from './boardService';
export { default as AuthService, authService } from './authService';
export { default as PermissionService, permissionService } from './permissionService';
export { NotificationService, notificationService } from './notificationService';
export { MessageService, messageService } from './messageService';

// Type Exports
export type { RequestOptions, HttpMethod } from './baseService';
export type { 
  UserServiceOptions, 
  UserPermission, 
  UserUpdateData, 
  UserSearchOptions 
} from './userService';
export type {
  PostServiceOptions,
  PostListOptions,
  PostCreateData,
  PostUpdateData,
  PostDownloadHistory,
  DraftPostRequest,
  DraftPostResponse,
  AsyncUploadConfig,
  UploadStartResponse,
  UploadProgressResponse
} from './postService';
export type {
  BoardServiceOptions,
  BoardListOptions,
  BoardCreateData,
  BoardUpdateData,
  BoardCategoryCreateData,
  BoardStats
} from './boardService';
export type {
  AuthServiceOptions,
  LoginCredentials,
  RegisterData,
  AuthTokens,
  AuthResponse,
  PasswordResetData,
  PasswordChangeData,
  SessionInfo
} from './authService';
export type {
  PermissionServiceOptions,
  PermissionCheck,
  PermissionResult,
  UserPermissions,
  LevelInfo,
  RoleInfo,
  PermissionGrant
} from './permissionService';
export type {
  NotificationServiceOptions,
  UserNotification,
  NotificationListResponse,
  NotificationTemplate,
  NotificationSettings,
  BulkNotificationRequest,
  NotificationSendResult,
  NotificationStats
} from './notificationService';
export type {
  MessageServiceOptions,
  ChatRoom,
  ChatParticipant,
  Message,
  ChatRoomListResponse,
  MessageListResponse,
  CreateChatRoomRequest,
  SendMessageRequest,
  UpdateChatRoomSettingsRequest,
  MessageSearchOptions,
  InviteChatParticipantRequest,
  ChatRoomStats,
  MarkMessagesAsReadRequest,
  OnlineUser,
  ChatRoomStatus,
  MessageStatus
} from './messageService';