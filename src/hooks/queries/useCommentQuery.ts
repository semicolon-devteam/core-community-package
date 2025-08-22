import type { CommonResponse } from "@model/common";
import commentService from "@services/commentService";
import { useQuery } from "@tanstack/react-query";
import { timeAgo } from "@util/dateUtil";

// 댓글 조회를 위한 인터페이스
interface CommentQueryParams {
  postId: number;
  page: number;
  pageSize?: number;
}

// 댓글 조회 훅
export const useCommentQuery = (
  params: CommentQueryParams,
  options?: { enabled?: boolean }
) => {

  
  return useQuery({
    queryKey: ["comments", params],
    queryFn: () => {
      return commentService.getComments(params);
    },
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
    gcTime: 1000 * 60 * 30, // 30분 동안 캐시 저장
    retry: 2, // 실패 시 2번까지 재시도
    enabled: options?.enabled ?? true,
    select: (data: CommonResponse<any>) => {
      
      if (data.successOrNot === "N") {
        return {
          data: {
            items: [],
            totalCount: 0,
          },
        };
      }
      if (!data.data) {
        return {
          data: {
            items: [],
            totalCount: 0,
          },
        };
      }
      
      const result = {
        data: {
          items: Array.isArray(data.data.items)
            ? data.data.items.map((item: any) => ({
                ...item,
                created_at: timeAgo(item.created_at),
              }))
            : [],
          totalCount: data.data.totalCount || 0,
        },
      };
      
      return result;
    },
  });
};
