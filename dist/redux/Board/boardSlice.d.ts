import type { Board } from '../../types/board';
import type { BoardType } from '@organisms/BoardTypes/boardtype.model';
interface BoardState {
    currentBoardType: BoardType | null;
    boards: Board[];
}
export declare const setBoardType: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "board/setBoardType">, clearBoardType: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"board/clearBoardType">, setBoardList: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<Board[], "board/setBoardList">, clearBoardList: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"board/clearBoardList">;
declare const _default: import("redux").Reducer<BoardState>;
export default _default;
