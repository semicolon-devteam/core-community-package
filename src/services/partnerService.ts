import type { CommonResponse } from '@model/common';
import type { PartnerListResponse } from '@model/partner';
import baseService from '@services/baseService';

const partnerService = {
  getPartners({ page = 1 }: { page?: number }): Promise<CommonResponse<PartnerListResponse>> {
    return baseService.get<PartnerListResponse>(`/api/partners?page=${page}`);
  },
};

export default partnerService; 