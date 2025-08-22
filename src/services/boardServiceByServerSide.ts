import { serverFetch } from '@config/fetch';
// import { clientSupabase } from '@config/Supabase/client';
import { getServerSupabase } from "@config/Supabase/server";

import { HomeContents } from '@model/board';
import { BoardType, CloseLoungeType, OpenLoungeType, SportsType } from '@model/board/enum';
import { CommonResponse, CommonStatus } from '@model/common';
interface BoardService {
  boardId: number;
}

const BoardServiceByServerSide = {
  getBoard: async ({ boardId }: BoardService) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/boards/${boardId}`;
    const res = await serverFetch(url);

    if (!res.ok) {
      console.error(`게시판 정보 API 요청 실패: ${res.status}`);
      console.error(`요청 실패상세:`, res.statusText);
      return {
        data: null,
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
      };
    }

    const json = await res.json();
    return {
      ...json,
      data: json.data,
    };
  },
  getBoardCategories: async ({ boardId }: BoardService) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/boards/${boardId}/categories`;
    const res = await serverFetch(url);
    if (!res.ok) {
      console.error(`게시판 카테고리 정보 API 요청 실패: ${res.status}`);
      console.error(`요청 실패상세:`, res.statusText);
      return {
        data: null,
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
      };
    }
    const json = await res.json();
    return {
      ...json,
      data: json.data,
    };
  },

  getHomeContents: async (): Promise<CommonResponse<HomeContents>> => {
    const supabase = await getServerSupabase();

    const { data: dailyPopularData, error: dailyPopularError } =
      await supabase.rpc('posts_get_daily_popular', {
        p_date: new Date().toISOString().split('T')[0],
        p_limit: 10,
      }); // 일간 인기 게시글

    if (dailyPopularError) {
      return {
        data: null,
        successOrNot: 'N',
        message: dailyPopularError.message,
        statusCode: CommonStatus.FAIL,
      } as CommonResponse<HomeContents>;
    }

    const { data: latestPostData, error: latestPostError } = await supabase
      .from('posts')
      .select(
        `
        id,
        title,
        comment_count,
        created_at,
        view_count,
        board:boards(id, name)
        `
      )
      .eq('status', 'published')
      .is('deleted_at', null)
      .in('board_id', [
        OpenLoungeType.CHALLENGE,
        OpenLoungeType.SOCIAL,
        OpenLoungeType.BROADCAST,
        OpenLoungeType.ANALYTICS,
        CloseLoungeType.BRONZE,
      ])
      .order('id', { ascending: false })
      .range(0, 4);

    if (latestPostError) {
      return {
        data: null,
        successOrNot: 'N',
        message: latestPostError.message,
        statusCode: CommonStatus.FAIL,
      } as CommonResponse<HomeContents>;
    }

    const { data: boardData, error } = await supabase.rpc(
      'posts_get_dashboard_recent',
      {
        p_board_ids: [
          SportsType.FOOTBALL,
          BoardType.VR,
          BoardType.SPORTS,
          OpenLoungeType.CHALLENGE,
          OpenLoungeType.FREE,
          OpenLoungeType.HUMOR,
        ],
        p_limit_per_board: 5,
      }
    );

    const response = {
      trendingItems: dailyPopularData,
      latestItems: latestPostData,
      requestedBoardItems: boardData,
    };

    if (error) {
      return {
        data: null,
        successOrNot: 'N',
        message: error.message,
        statusCode: CommonStatus.FAIL,
      } as CommonResponse<HomeContents>;
    }
    return {
      data: response as unknown as HomeContents,
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
    } as CommonResponse<HomeContents>;
  },

  getAllBoards: async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/boards/all`;
    const res = await serverFetch(url);
    if (!res.ok) {
      console.error(`게시판 전체 정보 API 요청 실패: ${res.status}`);
      console.error(`요청 실패상세:`, res.statusText);
      return {
        data: null,
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
      };
    }
    const json = await res.json();
    return {
      ...json,
      data: json.data,
    };
  },
  getBoardSettings: async ({ boardId }: BoardService) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/boards/${boardId}/settings`;
    const res = await serverFetch(url);
    const json = await res.json();

    return json.data;
  },
  getForbiddenWords: async ({ boardId }: BoardService) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/boards/${boardId}/settings`;
    const res = await serverFetch(url);
    const json = await res.json();

    return json.data.feature_settings?.forbidden_words ?? [];
  },
};

export default BoardServiceByServerSide;
