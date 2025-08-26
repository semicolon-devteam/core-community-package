import { BaseService } from './baseService';
import type { CommonResponse } from '../types/common';
import type {
  UserNotification,
  NotificationListResponse,
  NotificationTemplate,
  NotificationSettings,
  BulkNotificationRequest,
  NotificationSendResult,
  NotificationStats
} from '../types/notification';

/**
 * 알림 서비스 옵션
 */
export interface NotificationServiceOptions {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
}

/**
 * 알림 관리 서비스
 * @description 사용자 알림 조회, 읽음 처리, 설정 관리 등을 담당
 */
export class NotificationService extends BaseService<UserNotification> {
  constructor(options: NotificationServiceOptions = {}) {
    super({
      baseUrl: options.baseUrl || '/api/notifications',
      defaultHeaders: options.defaultHeaders,
    });
  }

  /**
   * 사용자 알림 목록 조회
   * @param page 페이지 번호 (기본값: 1)
   * @param pageSize 페이지당 항목 수 (기본값: 20)
   * @param onlyUnread 읽지 않은 알림만 조회 (기본값: false)
   */
  async getNotifications(
    page: number = 1,
    pageSize: number = 20,
    onlyUnread: boolean = false
  ): Promise<CommonResponse<NotificationListResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(onlyUnread && { onlyUnread: 'true' }),
    });

    return this.get<NotificationListResponse>(`?${params}`);
  }

  /**
   * 읽지 않은 알림 개수 조회
   */
  async getUnreadCount(): Promise<CommonResponse<{ count: number }>> {
    return this.get<{ count: number }>('/unread-count');
  }

  /**
   * 특정 알림을 읽음으로 처리
   * @param notificationId 알림 ID
   */
  async markAsRead(notificationId: string): Promise<CommonResponse<void>> {
    return this.patch<void>(`/${notificationId}/read`, {});
  }

  /**
   * 모든 알림을 읽음으로 처리
   */
  async markAllAsRead(): Promise<CommonResponse<void>> {
    return this.patch<void>('/mark-all-read', {});
  }

  /**
   * 특정 알림 삭제
   * @param notificationId 알림 ID
   */
  async deleteNotification(notificationId: string): Promise<CommonResponse<void>> {
    return this.delete<void>(`/${notificationId}`);
  }

  /**
   * 알림 설정 조회
   */
  async getNotificationSettings(): Promise<CommonResponse<NotificationSettings>> {
    return this.get<NotificationSettings>('/settings');
  }

  /**
   * 알림 설정 업데이트
   * @param settings 새로운 알림 설정
   */
  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<CommonResponse<NotificationSettings>> {
    return this.put<NotificationSettings>('/settings', settings);
  }

  /**
   * 알림 통계 정보 조회
   */
  async getNotificationStats(): Promise<CommonResponse<NotificationStats>> {
    return this.get<NotificationStats>('/stats');
  }

  // =============================================================================
  // 관리자 기능 (Admin Only)
  // =============================================================================

  /**
   * 알림 템플릿 목록 조회 (관리자 전용)
   */
  async getTemplates(): Promise<CommonResponse<NotificationTemplate[]>> {
    return this.get<NotificationTemplate[]>('/admin/templates');
  }

  /**
   * 대량 알림 발송 (관리자 전용)
   * @param request 대량 발송 요청
   */
  async sendBulkNotification(request: BulkNotificationRequest): Promise<CommonResponse<NotificationSendResult>> {
    return this.post<NotificationSendResult>('/admin/bulk-send', request);
  }

  /**
   * 알림 예약 발송 (관리자 전용)
   * @param request 예약 발송 요청
   */
  async scheduleNotification(request: BulkNotificationRequest): Promise<CommonResponse<{ schedule_id: string }>> {
    return this.post<{ schedule_id: string }>('/admin/schedule', request);
  }

  /**
   * 예약 알림 목록 조회 (관리자 전용)
   */
  async getScheduledNotifications(): Promise<CommonResponse<any[]>> {
    return this.get<any[]>('/admin/schedules');
  }

  /**
   * 예약 알림 취소 (관리자 전용)
   * @param scheduleId 예약 ID
   */
  async cancelScheduledNotification(scheduleId: string): Promise<CommonResponse<void>> {
    return this.delete<void>(`/admin/schedules/${scheduleId}`);
  }

  // =============================================================================
  // Silent 메서드 (글로벌 로더 비활성화)
  // =============================================================================

  /**
   * Silent - 알림 목록 조회 (로더 없이)
   */
  async getNotificationsSilent(
    page: number = 1,
    pageSize: number = 20,
    onlyUnread: boolean = false
  ): Promise<CommonResponse<NotificationListResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(onlyUnread && { onlyUnread: 'true' }),
    });

    return this.getSilent<NotificationListResponse>(`?${params}`);
  }

  /**
   * Silent - 읽지 않은 알림 개수 조회 (로더 없이)
   */
  async getUnreadCountSilent(): Promise<CommonResponse<{ count: number }>> {
    return this.getSilent<{ count: number }>('/unread-count');
  }

  /**
   * Silent - 알림을 읽음으로 처리 (로더 없이)
   */
  async markAsReadSilent(notificationId: string): Promise<CommonResponse<void>> {
    return this.patchSilent<void>(`/${notificationId}/read`, {});
  }
}

// 기본 인스턴스 생성 (하위 호환성)
export const notificationService = new NotificationService();

// 타입 재export
export type {
  UserNotification,
  NotificationListResponse,
  NotificationTemplate,
  NotificationSettings,
  BulkNotificationRequest,
  NotificationSendResult,
  NotificationStats
} from '../types/notification';