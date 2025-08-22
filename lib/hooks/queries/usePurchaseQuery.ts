
import type { CommonResponse } from "@model/common";
import type { PurchaseListResponse } from "@model/purchase";
import purchaseService from "@services/purchaseService";
import { useQuery } from "@tanstack/react-query";

interface UsePurchaseQueryParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const usePurchaseQuery = (params?: UsePurchaseQueryParams) =>
  useQuery({
    queryKey: ["purchase", params],
    queryFn: () => purchaseService.getPurchaseRequests(params),
    staleTime: 1000 * 60 * 3, // 3분 동안 캐시 유지 (구매 내역은 변경될 수 있으므로 단축)
    gcTime: 1000 * 60 * 60, // 1시간 동안 캐시 저장
    retry: 3, // 실패 시 3번까지 재시도
    select: (data: CommonResponse<PurchaseListResponse>) => {
      if (data.successOrNot === "Y" && data.data) {
        return data.data;
      }
      return {
        items: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    },
  });