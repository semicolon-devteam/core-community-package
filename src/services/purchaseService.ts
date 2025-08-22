import type { Coin } from "@model/coin";
import type { CommonResponse } from "@model/common";
import type { ProcessPurchaseRequest, PurchaseListResponse, PurchaseRequest } from "@model/purchase";
import baseService from "./baseService";

interface GetPurchaseRequestsParams {
  page?: number;
  limit?: number;
  status?: string;
}

const purchaseService = {
  getAvailableCoins(): Promise<CommonResponse<Coin[]>> {
    return baseService.get<Coin[]>('/api/coins');
  },
  requestPurchase(data: PurchaseRequest): Promise<CommonResponse<string>> {
    return baseService.post<string, PurchaseRequest>('/api/purchase', data);
  },
  getPurchaseRequests(params?: GetPurchaseRequestsParams): Promise<CommonResponse<PurchaseListResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }
    if (params?.status) {
      searchParams.append('status', params.status);
    }
    
    const queryString = searchParams.toString();
    const url = queryString ? `/api/purchase?${queryString}` : '/api/purchase';
    
    return baseService.get<PurchaseListResponse>(url);
  },
  processPurchase(data: ProcessPurchaseRequest): Promise<CommonResponse<string>> {
    return baseService.patch<string, ProcessPurchaseRequest>('/api/purchase', data);
  }
}

export default purchaseService;