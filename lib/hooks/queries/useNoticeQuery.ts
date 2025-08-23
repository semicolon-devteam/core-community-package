import { Notice } from '../../types/post';
import noticeService from '@services/noticeService';
import { useQuery } from '@tanstack/react-query';

export const useNoticeQuery = () => {
  return useQuery<Notice[]>({
    queryKey: ['notices'],
    queryFn: async () => {
      const response = await noticeService.getNotices();
      // response.data가 배열이 아닐 경우 빈 배열 반환
      if (response.successOrNot !== 'Y' || !Array.isArray(response.data)) {
        return [];
      }
      // NoticeService → Notice 변환
      return response.data;
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: 3,
  });
};
