import type { Banner } from "@model/banner";
import type { CommonResponse } from "@model/common";
import { CommonStatus } from "@model/common";
import baseService from "@services/baseService";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1초

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const bannerService = {
  async getBanners(retryCount = 0): Promise<CommonResponse<Banner[]>> {
    try {
      return await baseService.getSilent<Banner[]>("/api/banners");
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        await sleep(RETRY_DELAY);
        return this.getBanners(retryCount + 1);
      }
      return {
        successOrNot: "N",
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
        status: 500,
        message: "배너 정보를 가져오는데 실패했습니다.",
        data: [],
      };
    }
  },

  async createBanner(banner: Banner): Promise<CommonResponse<Banner>> {
    try {
      return await baseService.postMini<Banner, Banner>("/api/banners", banner, '배너 생성중...');
    } catch (error) {
      return {
        successOrNot: "N",
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
        status: 500,
        message: "배너 생성에 실패했습니다.",
        data: null,
      };
    }
  },

  async updateBanner(banner: Banner): Promise<CommonResponse<Banner>> {
    try {
      return await baseService.putMini<Banner, Banner>(`/api/banners/${banner.id}`, banner, '배너 수정중...');
    } catch (error) {
      return {
        successOrNot: "N",
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
        status: 500,
        message: "배너 수정에 실패했습니다.",
        data: null,
      };
    }
  },

  async deleteBanner(id: number): Promise<CommonResponse<null>> {
    try {
      return await baseService.deleteMini<null>(`/api/banners/${id}`, '배너 삭제중...');
    } catch (error) {
      return {
        successOrNot: "N",
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
        status: 500,
        message: "배너 삭제에 실패했습니다.",
        data: null,
      };
    }
  },
};

export default bannerService;
