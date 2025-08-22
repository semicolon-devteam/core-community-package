// src/services/menuServiceByServerSide.ts
import { getServerSupabase } from "@config/Supabase/server";
import type { Menu } from "@model/menu";

const menuServiceByServerSide = {
  async getMenu(): Promise<Menu[]> {
    const supabase = await getServerSupabase();
    
    const getMenuTree = async (parentId: number | null, depth: number = 0): Promise<Menu[]> => {
      let query = supabase
        .from("menu")
        .select(`
          id,
          name,
          type,
          board_id,
          link_url,
          display_order,
          is_pc_enabled,
          is_mobile_enabled,
          required_level,
          boards (
            permission_settings
          )
        `)
        .eq("sub_type", "common")
        .order("display_order", { ascending: true });

      if (parentId) {
        query = query.eq("parent_id", parentId);
      } else {
        query = query.is("parent_id", null);
      }

      const { data, error } = await query;
      if (error) throw error;

      const menus = ((data as unknown) as any[]).map(menu => {
        const permissionSettings = menu.boards?.permission_settings;
        return {
          ...menu,
          list_level: permissionSettings?.list_level ?? 0
        };
      }) as Menu[];

      if (depth < 1) {
        for (const menu of menus) {
          menu.children = await getMenuTree(menu.id, depth + 1);
        }
      }
      return menus;
    };

    return await getMenuTree(null);
  }
};

export default menuServiceByServerSide;