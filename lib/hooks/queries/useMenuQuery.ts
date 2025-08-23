import type { CommonResponse } from "../../types/common";
import type { Menu } from "../../types/menu";
import menuService from "@services/menuService";
import { useQuery } from "@tanstack/react-query";

export const useMenuQuery = () =>
  useQuery({
    queryKey: ["navigation"],
    queryFn: menuService.getMenu,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지 (토큰 만료 이슈로 인해 시간 단축)
    gcTime: 1000 * 60 * 60, // 1시간 동안 캐시 저장
    retry: (failureCount, error: any) => {
      // JWT 만료 오류는 3번까지만 재시도
      if (error?.message?.includes("JWT")) {
        return failureCount < 3;
      }
      
      // 다른 오류는 1번만 재시도
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // 지수 백오프
    select: (data: CommonResponse<Menu>) => {
      if (data.successOrNot === "N") return [];
      return data.data || [];
    },
  });
