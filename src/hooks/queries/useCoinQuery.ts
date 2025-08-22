import type { Coin } from "@model/coin";
import type { CommonResponse } from "@model/common";
import purchaseService from "@services/purchaseService";
import { useQuery } from "@tanstack/react-query";

export const useCoinQuery = () =>
  useQuery({
    queryKey: ["coins"],
    queryFn: purchaseService.getAvailableCoins,
    staleTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 유지 (레벨 정보는 자주 변하지 않음)
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7일 동안 캐시 저장
    retry: 3, // 실패 시 3번까지 재시도
    select: (data: CommonResponse<Coin[]>) => {
      if (data.successOrNot === "Y" && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    },
  });