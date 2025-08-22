import type {
  HomeContents,
  LatestItem,
  Post,
  TrendingItem
} from '@model/board';
import { CommonStatus, type CommonResponse } from '@model/common';
import baseService from '@services/baseService';

const homeService = {
  getHome(): Promise<CommonResponse<HomeContents>> {
    return baseService.get<HomeContents>('/api/home');
  },


  getTrendingItems(
    period?: 'daily' | 'weekly' | 'monthly'
  ): Promise<CommonResponse<TrendingItem[]>> {
    return baseService.getMini<TrendingItem[]>(
      `/api/home/trending${period ? `?period=${period}` : ''}`,
      '인기 게시물 로딩중...'
    );
  },

  getLatestItems(
    type?: 'post' | 'comment'
  ): Promise<CommonResponse<LatestItem[]>> {
    return baseService.getMini<LatestItem[]>(
      `/api/home/latest${type ? `?type=${type}` : ''}`,
      '최신 활동 로딩중...'
    );
  },

  getBoardItems(
    boardId: number
  ): Promise<CommonResponse<Post[]>> {


    if (!boardId || boardId === 0) {
      return Promise.resolve({
        data: [],
        successOrNot: 'N',
        message: '게시판 아이디가 유효하지 않습니다.',
        statusCode: CommonStatus.FAIL,
      } as CommonResponse<Post[]>);
    }

    return baseService.getMini<Post[]>(
      `/api/home/boards?boardId=${boardId}`,
      '게시판 게시물 로딩중...'
    );
  },  

};

export default homeService;
