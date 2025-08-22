import { serverFetch } from '@config/fetch';
import type { HomeContents } from '@model/board';
import { CommonStatus, type CommonResponse } from '@model/common';

const HomeServiceByServerSide = {
  getHome: async (): Promise<CommonResponse<HomeContents>> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/home`;
    const res = await serverFetch(url);
    if (!res.ok) {
      throw new Error('Failed to fetch home data');
    }

    const json = await res.json();

    if (json.successOrNot === 'N') {
      return {
        data: null,
        message: json.message || 'Failed to fetch home data',
        successOrNot: 'N',
        statusCode: CommonStatus.NOT_FOUND,
      } as CommonResponse<HomeContents>;
    }
    return json;
  },
};

export default HomeServiceByServerSide;
