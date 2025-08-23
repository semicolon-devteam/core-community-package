import { Banner } from '../../types/banner';
import bannerService from '@services/bannerService';
import fileService from '@services/fileService';

export const useBannerCommand = () => {
  const createBanner = async (banner: Banner) => {
    try {
      let bannerData = { ...banner };

      // 이미지 파일이 있으면 먼저 업로드 (배너는 즉시 업로드 필요)
      if (banner.image) {
        const imageUploadResponse = await fileService.uploadFile(banner.image, {
          needThumbnailExtract: false,
          doWaterMark: false,
        });
        if (
          imageUploadResponse.successOrNot === 'Y' &&
          imageUploadResponse.data &&
          typeof imageUploadResponse.data === 'object'
        ) {
          bannerData.image_url = (
            imageUploadResponse.data as { url: string }
          ).url;
          // File 객체는 API 전송에서 제외
          delete bannerData.image;
        } else {
          throw new Error('이미지 업로드에 실패했습니다.');
        }
      }

      const response = await bannerService.createBanner(bannerData);
      return response;
    } catch (error) {
      console.error('배너 생성 오류:', error);
      return {
        successOrNot: 'N' as const,
        statusCode: 'FAIL' as const,
        data:
          error instanceof Error
            ? error.message
            : '배너 생성 중 오류가 발생했습니다.',
      };
    }
  };

  return {
    createBanner,
  };
};
