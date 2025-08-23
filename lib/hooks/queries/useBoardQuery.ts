import type { CommonResponse } from "../../types/common";
import type { Board } from "../../types/board";
import boardService from "@services/boardService";
import { useQuery } from "@tanstack/react-query";

export const useBoardQuery = (options: { enabled: boolean }) =>
  useQuery<CommonResponse<Board[]>>({
    queryKey: ["boards"],
    queryFn: () => boardService.getBoards(),
    staleTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지
    gcTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 저장
    retry: 3, // 실패 시 3번까지 재시도
    enabled: options?.enabled,
    select: (data: CommonResponse<Board[]>) => {
      if (data.successOrNot === "N" || !data.data) {
        return {
          ...data,
          data: [],
        };
      }
      return data;
    },
  });

export const useSingleBoardQuery = (boardId: number, options?: { enabled?: boolean }) =>
  useQuery<CommonResponse<Board>>({
    queryKey: ["board", boardId],
    queryFn: () => boardService.getBoard(boardId),
    staleTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지
    gcTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 저장
    retry: 3, // 실패 시 3번까지 재시도
    enabled: options?.enabled !== false && boardId > 0,
    select: (data: CommonResponse<Board>) => {
      if (data.successOrNot === "N" || !data.data) {
        return {
          ...data,
          data: null,
        };
      }
      return data;
    },
  });
