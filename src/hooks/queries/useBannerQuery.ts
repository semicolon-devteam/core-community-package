import type { Banner } from "@model/banner";
import type { CommonResponse } from "@model/common";
import bannerService from "@services/bannerService";
import { useQuery } from "@tanstack/react-query";

export const useBannerQuery = (options: { enabled: boolean }) =>
  useQuery<CommonResponse<Banner[]>>({
    queryKey: ["banners"],
    queryFn: () => bannerService.getBanners(),
    staleTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지
    gcTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 저장
    retry: 3, // 실패 시 3번까지 재시도
    enabled: options?.enabled,
    select: (data: CommonResponse<Banner[]>) => {
      if (data.successOrNot === "N" || !data.data) {
        return {
          ...data,
          data: [],
        };
      }
      return data;
    },
  });
