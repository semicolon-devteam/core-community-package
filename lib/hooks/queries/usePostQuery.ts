import { SearchType, SortBy } from "../../types/board";
import type { CommonResponse } from "../../types/common";
import type { GalleryListItem, Post } from "../../types/post";
import postService from "@services/postService";
import { useQuery } from "@tanstack/react-query";
import { timeAgo } from "@util/dateUtil";

interface PostService {
  boardId: number;
  page: number;
  pageSize?: number;
  sortBy?: SortBy;
  searchType?: SearchType;
  searchText?: string;
  categoryId?: string | number | null;
}

export const usePostQuery = (
  params: PostService,
  options: { enabled: boolean }
) =>
  useQuery({
    queryKey: ["post", params],
    queryFn: () => postService.getPost(params),
    staleTime: 10000, // 10초 동안 캐시 유지
    gcTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 저장
    retry: 3, // 실패 시 3번까지 재시도
    enabled: options?.enabled,
    placeholderData: (prev) => prev,
    refetchOnMount: false,
    select: (data: CommonResponse<Post>) => {
      if (data.successOrNot === "N") {
        return {
          data: {
            items: [],
            totalCount: 0,
            notices: [],
          },
        };
      }
      if (!data.data) {
        return {
          data: {
            items: [],
            totalCount: 0,
            notices: [],
          },
        };
      }
      return {
        data: {
          items: data.data.items.map((item) => ({
            ...item,
            created_at: timeAgo(item.created_at || new Date().toISOString()),
          })),
          totalCount: data.data.totalCount,
          notices: data.data.notices,
        },
      };
    },
  });

export const usePostBookmarkQuery = () =>
  useQuery({
    queryKey: ["postBookmark"],
    queryFn: () => postService.getBookmarkPosts(),
    staleTime: 1000 * 30, // 30초 동안 캐시 유지
    gcTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 저장
    retry: 3, // 실패 시 3번까지 재시도
    select: (data: CommonResponse<GalleryListItem[]>) => {
      if (data.successOrNot === "N") {
        return {
          data: [],
        };
      }
      return data.data;
    },
  });

export const useDraftPostQuery = (
  params: {
    page?: number;
    pageSize?: number;
    sortBy?: SortBy;
    writerId?: number;
  } = {},
  options: { enabled: boolean; enablePolling?: boolean } = { enabled: true, enablePolling: false }
) =>
  useQuery({
    queryKey: ["draftPost", params],
    queryFn: () => postService.getDraftPosts(params),
    staleTime: 0, // 폴링 사용 시 캐시 비활성화
    gcTime: 1000 * 60 * 5, // 5분 동안 캐시 저장
    retry: 3, // 실패 시 3번까지 재시도
    enabled: options?.enabled,
    refetchInterval: (query) => {
      // 폴링이 비활성화된 경우
      if (!options?.enablePolling) return false;
      
      // 쿼리 결과를 확인하여 모든 업로드가 완료되었으면 폴링 중지
      const result = query.state.data;
      if (result && result.data && Array.isArray(result.data)) {
        const allCompleted = result.data.every((post: any) => {
          if (!post.attachments || post.attachments.length === 0) return true;
          return post.attachments.every((attachment: any) => attachment.status === 'uploaded');
        });
        
        if (allCompleted) {
          console.log('✅ 모든 파일 업로드가 완료되어 폴링을 중지합니다.');
          return false;
        }
      }
      
      return 2000; // 2초마다 폴링
    },
    refetchIntervalInBackground: false, // 백그라운드에서는 폴링 비활성화
    select: (data: CommonResponse<Post>) => {
      if (data.successOrNot === "N") {
        return {
          data: {
            items: [],
            totalCount: 0,
            notices: [],
          },
        };
      }
      if (!data.data) {
        return {
          data: {
            items: [],
            totalCount: 0,
            notices: [],
          },
        };
      }
      return {
        data: {
          items: data.data.items.map((item) => ({
            ...item,
            created_at: timeAgo(item.created_at || new Date().toISOString()),
          })),
          totalCount: data.data.totalCount,
          notices: data.data.notices,
        },
      };
    },
  });