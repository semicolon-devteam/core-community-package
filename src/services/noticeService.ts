import baseService from '@services/baseService';
import { CommonResponse } from '@model/common';
import { Notice } from '@model/post';

const noticeService = {
  getNotices(): Promise<CommonResponse<Notice[]>> {
    return baseService.getMini<Notice[]>('/api/notice', '공지사항 로딩중...');
  },
};

export default noticeService;
