import type { PartnerListResponse } from "../../types/partner";
import partnerService from "@services/partnerService";
import { useQuery } from "@tanstack/react-query";


export const usePartnerQuery = ({ page = 1 }: { page?: number }) => {
    return useQuery<PartnerListResponse, Error>({
        queryKey: ["partners", page],
        queryFn: async () => {
            const response = await partnerService.getPartners({ page });
            if (response.successOrNot === "N") {
                throw new Error(response.message || '파트너 목록을 불러오는데 실패했습니다.');
            }
            return response.data ?? { items: [], totalCount: 0, totalPage: 0 };
        },
        staleTime: 1000 * 60 * 5, // 5분
    });
}; 