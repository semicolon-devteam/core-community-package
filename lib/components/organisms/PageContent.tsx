'use client';
/**
 * MainPageContent 컴포넌트
 *
 * TODO: Lazy Loading 구현 계획
 * 1. 현재: 서버에서 모든 데이터를 미리 받아서 탭 클릭 시 교체
 * 2. 변경 예정: 탭 클릭 시 해당 데이터만 서버에서 fetch
 *
 * 구현 필요사항:
 * - React Query를 활용한 데이터 fetching
 * - 로딩 상태 UI 표시
 * - 에러 처리 및 재시도 로직
 * - 캐싱 전략 (staleTime, cacheTime 설정)
 * - 무한 스크롤 또는 페이지네이션
 */

import { useGalleryQuery, useLatestQuery, useSportsQuery, useTrendingQuery } from '@hooks/queries/useHomeQuery';
import type {
  GalleryItem,
  LatestItem,
  MediaItem,
  TrendingItem,
  WithoutBoardNamePost
} from '../../types/board';
import { CommonStatus } from '../../types/common';
import BoardPostFeed from '@organisms/BoardPostFeed';
import FreeBoard from '@organisms/FreeBoard';
import GalleryBoard from '@organisms/GalleryBoard';
import HumorBoard from '@organisms/HumorBoard';
import LatestBoard from '@organisms/LatestBoard';
import MediaBoard from '@organisms/MediaBoard';
import NewsBoard from '@organisms/NewsBoard';
import TrendingBoardItem from '@organisms/TrendingBoardItem';
import { useState } from 'react';

interface MainPageContentProps {
  trendingItems: TrendingItem[];
  latestItems: LatestItem[];
  sportsItems: WithoutBoardNamePost[];
  mediaItems: MediaItem[];
  newsItems: WithoutBoardNamePost[];
  galleryItems: GalleryItem[];
  humorItems: WithoutBoardNamePost[];
} 

export default function MainPageContent({
  trendingItems = [],
  latestItems = [], 
  sportsItems = [],
  mediaItems = [],
  newsItems = [],
  galleryItems = [],
  humorItems = [],
}: MainPageContentProps) {

  // TODO: Lazy loading을 위한 상태 관리
  // - 각 탭별 데이터를 필요할 때 서버에서 fetch
  // - 로딩 상태 관리
  // - 캐싱 전략 구현
  const [selectedTrendingItem, setSelectedTrendingItem] = useState<number>(0);

  const [selectedLatestItem, setSelectedLatestItem] = useState<number>(0);

  const [selectedBoardItem, setSelectedBoardItem] = useState<number>(0);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<number>(0);


  const currentPeriod = ['daily', 'weekly', 'monthly'][selectedTrendingItem] as 'daily' | 'weekly' | 'monthly';
  
  const { data: queryTrendingItems } = useTrendingQuery({
    period: currentPeriod,
    initialData: {
      data: trendingItems,
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
    } 
  });

  const currentSportsItemType = ['football', 'baseball', 'basketball', 'volleyball'][selectedBoardItem] as 'football' | 'baseball' | 'basketball' | 'volleyball';

  const { data: querySportsItems } = useSportsQuery({
    type: currentSportsItemType,
    initialData: {
      data: sportsItems,
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
    }
  });

  const currentGalleryItemType = ['challenge', 'social', 'broadcast', 'analytics'][selectedGalleryItem] as 'challenge' | 'social' | 'broadcast' | 'analytics';

  const { data: queryGalleryItems, isFetching: isGalleryLoading } = useGalleryQuery({
    type: currentGalleryItemType,
    initialData: {
      data: galleryItems,
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
    }
  });

  return (
    <>
      {/* Trending Items */}
      <TrendingBoardItem
        selectedItem={selectedTrendingItem}
        setSelectedItem={setSelectedTrendingItem}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Latest Posts */}
        <LatestBoard
          selectedItem={selectedLatestItem}
          setSelectedItem={setSelectedLatestItem}
        />

        {/* Sports Feed */}
        <BoardPostFeed
          selectedItem={selectedBoardItem}
          setSelectedItem={setSelectedBoardItem}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Media Board (빈 데이터) */}
        <MediaBoard items={mediaItems} />

        {/* VR News */}
        <NewsBoard items={newsItems} />
      </div>

      {/* Gallery Board */}
      <GalleryBoard
        items={queryGalleryItems ?? []}
        selectedItem={selectedGalleryItem}
        setSelectedItem={setSelectedGalleryItem}
        isLoading={isGalleryLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Free Board */}
        <FreeBoard />

        {/* Humor Board */}
        <HumorBoard items={humorItems} />
      </div>
    </>
  );
}
