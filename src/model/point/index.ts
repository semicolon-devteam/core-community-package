export interface PointTransaction {
  id: number;
  created_at: string;
  updated_at?: string;
  user_id: string;
  point_code?: string;
  amount: number;
  balance_after: number;
  transaction_type: 'EARN' | 'USE' | 'REFUND' | 'EXPIRE' | 'REVOKE';
  expiration_date?: string;
  description: string;
  policy_id?: number;
  related_transaction_id?: number;
}