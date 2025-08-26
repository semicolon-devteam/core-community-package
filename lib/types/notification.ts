/**
 * 알림 시스템 관련 타입 정의
 * @description 사용자 알림, 템플릿, 설정 관련 타입
 */

/**
 * 사용자 알림 인터페이스
 */
export interface UserNotification {
  id: string;
  user_id: string;
  title: string;
  body?: string;
  mobile_landing_url?: string;
  web_landing_url?: string;
  is_read: boolean;
  params?: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

/**
 * 알림 목록 응답
 */
export interface NotificationListResponse {
  notifications: UserNotification[];
  total_count: number;
  unread_count: number;
  has_more: boolean;
  current_page: number;
  total_pages: number;
}

/**
 * 알림 템플릿 인터페이스
 */
export interface NotificationTemplate {
  template_name: string;
  title?: string;
  body?: string;
  is_push_send: boolean;
  is_email_send: boolean;
  is_sms_send: boolean;
  mobile_landing_url?: string;
  web_landing_url?: string;
  template_group?: string;
  template_sub_group?: string;
  is_enabled: boolean;
  created_at: string;
  updated_at?: string;
}

/**
 * 알림 설정 인터페이스
 */
export interface NotificationSettings {
  push_enabled: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  comment_notifications: boolean;
  message_notifications: boolean;
  system_notifications: boolean;
  marketing_notifications: boolean;
}

/**
 * 대량 알림 발송 요청
 */
export interface BulkNotificationRequest {
  user_ids: string[];
  template_name: string;
  interpolation_values?: Record<string, any>;
  scheduled_at?: string;
}

/**
 * 알림 발송 결과
 */
export interface NotificationSendResult {
  success_count: number;
  failed_count: number;
  errors?: string[];
}

/**
 * 알림 통계 정보
 */
export interface NotificationStats {
  total_notifications: number;
  unread_count: number;
  today_count: number;
  this_week_count: number;
}