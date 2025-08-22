export interface Menu {
  id: number;
  name: string;
  type: string;
  board_id?: number;
  link_url?: string;
  display_order: number;
  is_pc_enabled: boolean;
  is_mobile_enabled: boolean;
  required_level: number;
  list_level?: number;
  children?: Menu[]; // 재귀적인 구조를 위해 자기 자신의 타입을 배열로 가짐
  boards?: {
    permission_settings: {
      list_level: number;
    };
  };
}
