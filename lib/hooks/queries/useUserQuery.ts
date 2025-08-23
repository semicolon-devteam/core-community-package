import { CommonResponse } from "../../types/common";
import pointService from "@services/pointService";
import { useQuery } from "@tanstack/react-query";

export const useUserPointQuery = (userId: string) => {
  return useQuery({
    queryKey: ["userPoint", userId],
    queryFn: () => pointService.getUserPoint(userId),
    staleTime: 1000 * 60 * 3, // 3분 동안 캐시 유지 (구매 내역은 변경될 수 있으므로 단축)
    gcTime: 1000 * 60 * 60, // 1시간 동안 캐시 저장
    retry: 3, // 실패 시 3번까지 재시도
    select: (data: CommonResponse<number>) => {
      if (data.successOrNot === "Y" && data.data) {
        return data.data;
      }
      throw new Error("Failed to fetch user point");
    }
  });
};

export const useUserPointHistoryQuery = (userId: string) => {
  return useQuery({
    queryKey: ["userPointHistory", userId],
    queryFn: () => pointService.getUserPointHistory(userId),
  });
};