import { CommonResponse } from '@model/common';
import type { PointTransaction } from '@model/point';
import baseService from './baseService';

const pointService = {
  usePoint(point: number): Promise<CommonResponse<string>> {
    return baseService.post<string, { type: 'use' | 'add'; point: number }>(
      `/api/user/me/point`,
      { type: 'use', point }
    );
  },
  addPoint(
    point: number,
    reason: string,
    userId: number
  ): Promise<CommonResponse<string>> {
    return baseService.post<string, { point: number; reason: string }>(
      `/api/user/${userId}/point/add`,
      { point, reason }
    );
  },
  subtractPoint(
    point: number,
    reason: string,
    userId: number
  ): Promise<CommonResponse<string>> {
    return baseService.post<string, { point: number; reason: string }>(
      `/api/user/${userId}/point/subtract`,
      { point, reason }
    );
  },

  getUserPoint(userId: string): Promise<CommonResponse<number>> {
    return baseService.get<number>(`/api/user/${userId}/point`);
  },

  getUserPointHistory(
    userId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<CommonResponse<{
    items: PointTransaction[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>> {
    return baseService.get<{
      items: PointTransaction[];
      totalCount: number;
      currentPage: number;
      totalPages: number;
    }>(`/api/user/${userId}/point/history?page=${page}&pageSize=${pageSize}`);
  },
};

export default pointService;
