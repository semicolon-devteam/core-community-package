import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { NotificationService } from '../../services/notificationService';
import type {
  UserNotification,
  NotificationListResponse,
  NotificationStats,
  NotificationSettings
} from '../../types/notification';

/**
 * 알림 목록 조회 훅
 * @param page 페이지 번호
 * @param pageSize 페이지당 항목 수  
 * @param onlyUnread 읽지 않은 알림만 조회
 * @param enabled 쿼리 활성화 여부
 */
export const useNotificationsQuery = ({
  page = 1,
  pageSize = 20,
  onlyUnread = false,
  enabled = true,
}: {
  page?: number;
  pageSize?: number;
  onlyUnread?: boolean;
  enabled?: boolean;
} = {}) => {
  const notificationService = new NotificationService();

  return useQuery({
    queryKey: ['notifications', page, pageSize, onlyUnread],
    queryFn: async (): Promise<NotificationListResponse> => {
      const response = await notificationService.getNotificationsSilent(page, pageSize, onlyUnread);
      
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '알림을 불러오는데 실패했습니다.');
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2분간 캐시
    refetchOnWindowFocus: true, // 창 포커스 시 새로고침
    refetchInterval: 1000 * 60 * 5, // 5분마다 자동 새로고침
  });
};

/**
 * 읽지 않은 알림 개수 조회 훅
 * @param enabled 쿼리 활성화 여부
 */
export const useUnreadNotificationCountQuery = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  const notificationService = new NotificationService();

  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async (): Promise<number> => {
      const response = await notificationService.getUnreadCountSilent();
      
      if (response.successOrNot === 'Y' && response.data) {
        return response.data.count;
      }
      throw new Error(response.message || '읽지 않은 알림 개수를 불러오는데 실패했습니다.');
    },
    enabled,
    staleTime: 1000 * 60, // 1분간 캐시
    refetchInterval: 1000 * 30, // 30초마다 자동 새로고침 (실시간에 가깝게)
    refetchOnWindowFocus: true,
  });
};

/**
 * 알림 통계 조회 훅
 * @param enabled 쿼리 활성화 여부
 */
export const useNotificationStatsQuery = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  const notificationService = new NotificationService();

  return useQuery({
    queryKey: ['notifications', 'stats'],
    queryFn: async (): Promise<NotificationStats> => {
      const response = await notificationService.getNotificationStats();
      
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '알림 통계를 불러오는데 실패했습니다.');
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    refetchOnWindowFocus: false,
  });
};

/**
 * 알림 설정 조회 훅
 * @param enabled 쿼리 활성화 여부
 */
export const useNotificationSettingsQuery = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  const notificationService = new NotificationService();

  return useQuery({
    queryKey: ['notifications', 'settings'],
    queryFn: async (): Promise<NotificationSettings> => {
      const response = await notificationService.getNotificationSettings();
      
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '알림 설정을 불러오는데 실패했습니다.');
    },
    enabled,
    staleTime: 1000 * 60 * 10, // 10분간 캐시 (설정은 자주 바뀌지 않음)
    refetchOnWindowFocus: false,
  });
};

/**
 * 관리자 전용: 알림 템플릿 목록 조회 훅
 * @param enabled 쿼리 활성화 여부
 */
export const useNotificationTemplatesQuery = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  const notificationService = new NotificationService();

  return useQuery({
    queryKey: ['notifications', 'templates'],
    queryFn: async (): Promise<NotificationTemplate[]> => {
      const response = await notificationService.getTemplates();
      
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '알림 템플릿을 불러오는데 실패했습니다.');
    },
    enabled,
    staleTime: 1000 * 60 * 15, // 15분간 캐시 (템플릿은 거의 바뀌지 않음)
    refetchOnWindowFocus: false,
  });
};