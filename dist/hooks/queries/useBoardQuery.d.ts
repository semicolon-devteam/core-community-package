import type { CommonResponse } from "../../types/common";
import type { Board } from "../../types/board";
export declare const useBoardQuery: (options: {
    enabled: boolean;
}) => import("@tanstack/react-query").UseQueryResult<CommonResponse<Board[]>, Error>;
export declare const useSingleBoardQuery: (boardId: number, options?: {
    enabled?: boolean;
}) => import("@tanstack/react-query").UseQueryResult<CommonResponse<Board>, Error>;
