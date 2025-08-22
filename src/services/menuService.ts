import type { CommonResponse } from "@model/common";
import type { Menu } from "@model/menu";
import baseService from "@services/baseService";

const menuService = {
  getMenu(): Promise<CommonResponse<Menu>> {
    return baseService.getMini<Menu>("/api/navigation", '메뉴 로딩중...');
  },
};

export default menuService;
