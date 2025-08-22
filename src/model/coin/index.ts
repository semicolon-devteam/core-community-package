export interface Coin {
  id: number;
  coin_code: string;
  coin_name: string;
  coin_symbol: string;
  display_order: number;
  is_active: boolean;
  is_purchase_enabled: boolean;
  icon_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  metadata: {
    wallet_address: string;
  };
}
