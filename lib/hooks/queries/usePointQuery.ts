'use client';

import pointService from '@services/pointService';
import type { PointTransaction } from '@model/point';
import { useQuery } from '@tanstack/react-query';

interface PointHistoryQueryParams {
  userId: string;
  page?: number;
  pageSize?: number;
  enabled?: boolean;
  initialData?: PointHistoryData | null;
}

interface PointHistoryData {
  items: PointTransaction[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export const usePointHistoryQuery = ({ 
  userId, 
  page = 1, 
  pageSize = 10, 
  enabled = true,
  initialData = null 
}: PointHistoryQueryParams) => {
  return useQuery<PointHistoryData>({
    queryKey: ['pointHistory', userId, page, pageSize],
    queryFn: async () => {
      const response = await pointService.getUserPointHistory(userId, page, pageSize);
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '포인트 내역을 불러오는 중 오류가 발생했습니다.');
    },
    enabled: enabled && !!userId,
    initialData: page === 1 && initialData ? initialData : undefined,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    refetchOnWindowFocus: false,
  });
};

export const usePointQuery = (userId: string, enabled: boolean = true) => {
  return useQuery<number>({
    queryKey: ['userPoint', userId],
    queryFn: async () => {
      const response = await pointService.getUserPoint(userId);
      if (response.successOrNot === 'Y' && response.data !== undefined && response.data !== null) {
        return response.data;
      }
      throw new Error(response.message || '포인트 정보를 불러오는 중 오류가 발생했습니다.');
    },
    enabled: enabled && !!userId,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    refetchOnWindowFocus: false,
  });
};