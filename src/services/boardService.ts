import type { CommonResponse } from "@model/common";
import baseService from "@services/baseService";

import { Board, BoardCategory } from "@model/board";

const boardService = {
  getBoards: (): Promise<CommonResponse<Board[]>> =>
    baseService.getMini("/api/boards", '게시판 목록 로딩중...'),
  getBoard: (boardId: number): Promise<CommonResponse<Board>> =>
    baseService.getMini<Board>(`/api/boards/${boardId}`, '게시판 정보 로딩중...'),
  getBoardCategories: (boardId: number): Promise<CommonResponse<BoardCategory[]>> =>
    baseService.getMini<BoardCategory[]>(`/api/boards/${boardId}/categories`, '카테고리 로딩중...'),
};

export default boardService;
