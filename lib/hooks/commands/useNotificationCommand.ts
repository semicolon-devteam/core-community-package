import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationService } from '../../services/notificationService';
import type {
  NotificationSettings,
  BulkNotificationRequest,
  NotificationSendResult
} from '../../types/notification';

/**
 * 알림 읽음 처리 Command 훅
 */
export const useMarkNotificationAsReadCommand = () => {
  const queryClient = useQueryClient();
  const notificationService = new NotificationService();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await notificationService.markAsRead(notificationId);
      
      if (response.successOrNot !== 'Y') {
        throw new Error(response.message || '알림 읽음 처리에 실패했습니다.');
      }
      return response.data;
    },
    onSuccess: () => {
      // 알림 목록과 읽지 않은 개수 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

/**
 * 모든 알림 읽음 처리 Command 훅
 */
export const useMarkAllNotificationsAsReadCommand = () => {
  const queryClient = useQueryClient();
  const notificationService = new NotificationService();

  return useMutation({
    mutationFn: async () => {
      const response = await notificationService.markAllAsRead();
      
      if (response.successOrNot !== 'Y') {
        throw new Error(response.message || '모든 알림 읽음 처리에 실패했습니다.');
      }
      return response.data;
    },
    onSuccess: () => {
      // 모든 알림 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

/**
 * 알림 삭제 Command 훅
 */
export const useDeleteNotificationCommand = () => {
  const queryClient = useQueryClient();
  const notificationService = new NotificationService();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await notificationService.deleteNotification(notificationId);
      
      if (response.successOrNot !== 'Y') {
        throw new Error(response.message || '알림 삭제에 실패했습니다.');
      }
      return response.data;
    },
    onSuccess: () => {
      // 알림 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

/**
 * 알림 설정 업데이트 Command 훅
 */
export const useUpdateNotificationSettingsCommand = () => {
  const queryClient = useQueryClient();
  const notificationService = new NotificationService();

  return useMutation({
    mutationFn: async (settings: Partial<NotificationSettings>) => {
      const response = await notificationService.updateNotificationSettings(settings);
      
      if (response.successOrNot !== 'Y') {
        throw new Error(response.message || '알림 설정 업데이트에 실패했습니다.');
      }
      return response.data;
    },
    onSuccess: () => {
      // 알림 설정 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['notifications', 'settings'] });
    },
  });
};

// =============================================================================
// 관리자 전용 Command 훅들
// =============================================================================

/**
 * 대량 알림 발송 Command 훅 (관리자 전용)
 */
export const useBulkNotificationCommand = () => {
  const queryClient = useQueryClient();
  const notificationService = new NotificationService();

  return useMutation({
    mutationFn: async (request: BulkNotificationRequest): Promise<NotificationSendResult> => {
      const response = await notificationService.sendBulkNotification(request);
      
      if (response.successOrNot !== 'Y') {
        throw new Error(response.message || '대량 알림 발송에 실패했습니다.');
      }
      return response.data!;
    },
    onSuccess: () => {
      // 대상 사용자들의 알림 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

/**
 * 알림 예약 발송 Command 훅 (관리자 전용)
 */
export const useScheduleNotificationCommand = () => {
  const queryClient = useQueryClient();
  const notificationService = new NotificationService();

  return useMutation({
    mutationFn: async (request: BulkNotificationRequest) => {
      const response = await notificationService.scheduleNotification(request);
      
      if (response.successOrNot !== 'Y') {
        throw new Error(response.message || '알림 예약에 실패했습니다.');
      }
      return response.data;
    },
    onSuccess: () => {
      // 예약 알림 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['notifications', 'schedules'] });
    },
  });
};

/**
 * 예약 알림 취소 Command 훅 (관리자 전용)
 */
export const useCancelScheduledNotificationCommand = () => {
  const queryClient = useQueryClient();
  const notificationService = new NotificationService();

  return useMutation({
    mutationFn: async (scheduleId: string) => {
      const response = await notificationService.cancelScheduledNotification(scheduleId);
      
      if (response.successOrNot !== 'Y') {
        throw new Error(response.message || '예약 알림 취소에 실패했습니다.');
      }
      return response.data;
    },
    onSuccess: () => {
      // 예약 알림 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['notifications', 'schedules'] });
    },
  });
};