import type { Pagination } from "@model/common";

export interface PurchaseRequest {
  coin_id: string;
  purchase_amount: number;
  payment_method: "agency" | "exchange_direct" | "personal_wallet";
  exchange_name: string;
  transaction_id: string;
  wallet_address: string;
}

export interface ProcessPurchaseRequest {
  id: string;
  status: 'approve' | 'reject';
  rejection_reason?: string;
  admin_notes?: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  coin_code: string;
  deposit_amount: number;
  payment_method: "agency" | "exchange_direct" | "personal_wallet";
  wallet_address: string;
  transaction_id: string;
  exchange_name: string;
  status: 'requested' | 'cancelled' | 'approved' | 'rejected' | 'refunded';
  created_at: string;
  processed_at: string;
  rejection_reason?: string;
  users?: {
    nickname: string;
  };
}

export interface PurchaseListResponse {
  items: Purchase[];
  pagination: Pagination;
}
