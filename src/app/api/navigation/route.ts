// import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@config/Supabase/server";
import type { CommonResponse } from "@model/common";
import { CommonStatus } from "@model/common";
import type { Menu } from "@model/menu";

export async function GET() {
  const supabase = await getServerSupabase();
  const getMenuTree = async (
    parentId: number | null,
    depth: number = 0
  ): Promise<Menu[]> => {
    let query = supabase
      .from("menu")
      .select(
        `
        id,
        name,
        type,
        board_id,
        link_url,
        display_order,
        is_pc_enabled,
        is_mobile_enabled,
        required_level
      `
      )
      .eq("sub_type", "common")
      .order("display_order", { ascending: true });

    if (parentId) {
      query = query.eq("parent_id", parentId);
    } else {
      query = query.is("parent_id", null);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const menus = data as Menu[];

    // 각 메뉴에 대해 하위 메뉴 가져오기
    if (depth < 1) {
      for (const menu of menus) {
        menu.children = await getMenuTree(menu.id, depth + 1);
      }
    }

    return menus;
  };

  // 최상위 메뉴부터 트리 구조 시작
  const menuTree = await getMenuTree(null);

  return new Response(
    JSON.stringify({
      data: menuTree,
      successOrNot: "Y",
      statusCode: CommonStatus.SUCCESS,
    } as CommonResponse<Menu[]>),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
