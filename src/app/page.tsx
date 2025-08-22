import {
  GalleryItem,
  MediaItem,
  Post,
  RequestedBoardItems,
  WithoutBoardNamePost,
} from '@model/board';
import { BoardType, OpenLoungeType, SportsType } from '@model/board/enum';
import ErrorHandler from '@organisms/ErrorHandler';
import MainPageContent from '@organisms/PageContent';
import HomeServiceByServerSide from '@services/homeServiceByServerSide';
import { timeAgo } from '@util/dateUtil';

// 동적 렌더링 강제 (cookies 사용으로 인해)
export const dynamic = 'force-dynamic';

export default async function Home() {
  const homeData = await HomeServiceByServerSide.getHome();

  if (homeData.successOrNot === 'N' || !homeData.data) {
    return <ErrorHandler message="메인페이지 데이터 로딩 실패" />;
  }

  const trendingItems =
    homeData.data?.trendingItems.map((item, index) => ({
      ...item,
      created_at: timeAgo(item.created_at),
      rank: index + 1,
    })) ?? [];

  const latestItems =
    homeData.data?.latestItems.map(item => ({
      ...item,
      created_at: timeAgo(item.created_at),
    })) ?? [];

  const footballItems: WithoutBoardNamePost[] =
    homeData.data?.requestedBoardItems
      .filter(
        (item: RequestedBoardItems) => item.board_id === SportsType.FOOTBALL
      )?.[0]
      ?.posts.map((post: Post) => ({
        ...post,
        created_at: timeAgo(post.created_at),
      })) ?? [];

  const vrItems: MediaItem[] =
    homeData.data?.requestedBoardItems
      .filter(
        (item: RequestedBoardItems) => item.board_id === BoardType.VR
      )?.[0]
      ?.posts.map((post: Post) => ({
        ...post,
        cast: post.metadata?.cast ?? '',
        releaseDate: post.metadata?.releaseDate ?? '',
        thumbnailUrl: post.metadata?.thumbnail ?? '',
      })) ?? [];

  const newsItems: WithoutBoardNamePost[] =
    homeData.data?.requestedBoardItems
      .filter(
        (item: RequestedBoardItems) => item.board_id === BoardType.SPORTS
      )?.[0]
      ?.posts.map((post: Post) => ({
        ...post,
        created_at: timeAgo(post.created_at),
      })) ?? [];

  const galleryItems: GalleryItem[] =
    homeData.data.requestedBoardItems
      .find(
        (item: RequestedBoardItems) =>
          item.board_id === OpenLoungeType.CHALLENGE
      )
      ?.posts.map((post: Post) => ({
        id: post.id,
        title: post.title,
        image: post.metadata?.thumbnail ?? '',
        comment_count: post.comment_count ?? 0,
        like_count: post.like_count ?? 0,
        metadata: {
          thumbnail: post.metadata?.thumbnail ?? '',
        },
      }))
      .slice(0, 4) ?? [];

  const humorItems: WithoutBoardNamePost[] =
    homeData.data?.requestedBoardItems
      .filter(
        (item: RequestedBoardItems) => item.board_id === OpenLoungeType.HUMOR
      )?.[0]
      ?.posts.map((post: Post) => ({
        ...post,
        created_at: timeAgo(post.created_at),
      })) ?? [];

  return (
    <MainPageContent
      trendingItems={trendingItems}
      latestItems={latestItems}
      sportsItems={footballItems}
      mediaItems={vrItems}
      newsItems={newsItems}
      galleryItems={galleryItems}
      humorItems={humorItems}
    />
  );
}
