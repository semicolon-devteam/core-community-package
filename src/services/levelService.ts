import type { CommonResponse, LevelInfo } from "@model/common";
import baseService from "@services/baseService";

const levelService = {
  getLevels: (): Promise<CommonResponse<LevelInfo[]>> => {
    return baseService.getMini<LevelInfo[]>("/api/levels", '레벨 정보 로딩중...');
  },
};

export default levelService;