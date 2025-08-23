import type { GalleryItem, LatestItem, Post, TrendingItem, WithoutBoardNamePost } from '../../types/board';
import { OpenLoungeType, SportsType } from '../../types/board/enum';
import type { CommonResponse } from '../../types/common';
import homeService from '@services/homeService';
import { useQuery } from '@tanstack/react-query';
import { timeAgo } from '@util/dateUtil';

export const useTrendingQuery = (options: {
  period: 'daily' | 'weekly' | 'monthly';
  initialData?: CommonResponse<TrendingItem[]>;
  forceRefetch?: boolean;
}) => 
  useQuery({
    queryKey: ['trending', options.period], 
    queryFn: () => homeService.getTrendingItems(options.period),
    // 5초마다 캐시 무효화
    // staleTime: 1000 * 5,
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7일 동안 캐시 저장
    retry: 3, // 실패 시 3번까지 재시도
    initialData: options?.initialData,
    enabled: true,
    placeholderData: (prev) => prev,
    refetchOnMount: false,
    select: (data) => {
      if (!data || data.successOrNot === 'N' || !data.data) {
        return [];
      }

      return data.data.map((item: TrendingItem, index: number) => ({
        ...item,
        id: item.post_id,
        created_at: timeAgo(item.created_at),
        rank: index + 1,  
      }));
    },
  });



export const useLatestQuery = (options?: { type?: 'post' | 'comment', initialData?: CommonResponse<LatestItem[]> }) =>
  useQuery({
    queryKey: ['latest', options?.type],
    queryFn: () => homeService.getLatestItems(options?.type),
    // staleTime: 1000 * 5, // 5초 동안 캐시 유지
    gcTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 저장
    retry: 3, // 실패 시 3번까지 재시도
    initialData: options?.initialData,
    placeholderData: (prev) => prev,
    refetchOnMount: false,
    select: (data) => {
      if (!data || data.successOrNot === 'N' || !data.data) {
        return [];
      }



      return data.data.map((item: LatestItem) => ({
        ...item,
        board_id: item.board?.id ?? 0,
        comment_count: item.comment_count ?? 0,
        name: item.board?.name ?? '',
        created_at: timeAgo(item.created_at), 
        link: options?.type === 'post' ? `/post/${item.id}` : `/post/${item.post_id}?comment-id=${item.id}`,
      }));
    },
  });

const sportsTypeToBoardId = (type: 'football' | 'baseball' | 'basketball' | 'volleyball'): number | null => {
  return type === 'football' ? SportsType.FOOTBALL
    : type === 'baseball' ? SportsType.BASEBALL
    : type === 'basketball' ? SportsType.BASKETBALL
    : type === 'volleyball' ? SportsType.VOLLEYBALL
    : null;
}

export const useSportsQuery = (options: { 
  type: 'football' | 'baseball' | 'basketball' | 'volleyball', 
  initialData?: CommonResponse<WithoutBoardNamePost[]> 
}) =>
  useQuery({
    queryKey: ['sports', options?.type],
    queryFn: () => homeService.getBoardItems(sportsTypeToBoardId(options.type) ?? 0),
    // staleTime: 1000 * 5, // 5초 동안 캐시 유지
    gcTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 저장
    retry: 3, // 실패 시 3번까지 재시도
    initialData: options?.initialData,
    placeholderData: (prev) => prev,
    refetchOnMount: false,
    select: (data: CommonResponse<Post[] | WithoutBoardNamePost[]>) => {
      if (!data || data.successOrNot === 'N' || !data.data) {
        return [];
      }
      return data.data.map((item: any) => ({
        ...item,
        created_at: timeAgo(item.created_at),
      })) as WithoutBoardNamePost[];
    },
  });

export const useFreeBoardQuery = (options?: { 
  initialData?: CommonResponse<WithoutBoardNamePost[]> 
}) =>
  useQuery({
    queryKey: ['freeBoard'],
    queryFn: () => homeService.getBoardItems(OpenLoungeType.FREE),
    gcTime: 1000 * 60 * 60 * 24,
    retry: 3,
    initialData: options?.initialData,
    placeholderData: (prev) => prev,
    refetchOnMount: false,
    select: (data: CommonResponse<Post[] | WithoutBoardNamePost[]>) => {
      if (!data || data.successOrNot === 'N' || !data.data) {
        return [];
      }
      return data.data.slice(0, 5).map((item: any) => ({
        ...item,
        created_at: timeAgo(item.created_at),
      })) as unknown as WithoutBoardNamePost[];
    },
  });

const galleryTypeToBoardId = (type: 'challenge' | 'social' | 'broadcast' | 'analytics'): number | null => {

  return type === 'challenge' ? OpenLoungeType.CHALLENGE
    : type === 'social' ? OpenLoungeType.SOCIAL
    : type === 'broadcast' ? OpenLoungeType.BROADCAST
    : type === 'analytics' ? OpenLoungeType.ANALYTICS
    : null;
}

export const useGalleryQuery = (options: {
  type: 'challenge' | 'social' | 'broadcast' | 'analytics',
  initialData?: CommonResponse<GalleryItem[]>
}) =>
  useQuery({
    queryKey: ['gallery', options.type],
    queryFn: () => homeService.getBoardItems(galleryTypeToBoardId(options.type) ?? 0),
    // staleTime: 1000 * 5, // 5초 동안 캐시 유지
    gcTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 저장
    retry: 3, // 실패 시 3번까지 재시도
    initialData: options?.initialData,
    placeholderData: (prev) => prev,
    refetchOnMount: false,
    select: (data: CommonResponse<Post[] | GalleryItem[]>) => {
      if (!data || data.successOrNot === 'N' || !data.data) {
        return [];
      }
      return (data.data.map((item: Post | GalleryItem) => ({
        ...item,
        id: item.id,
        title: item.title,
        image: item.metadata?.thumbnail ?? '', 
        comment_count: item.comment_count ?? 0,
        metadata: {
          thumbnail: item.metadata?.thumbnail ?? '',
        },
      })).slice(0, 4)) as unknown as GalleryItem[];
    },
  });
