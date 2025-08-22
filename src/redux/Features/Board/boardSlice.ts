import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Board } from '@model/board';
import type { BoardType } from '@organisms/BoardTypes/boardtype.model';

interface BoardState {
  currentBoardType: BoardType | null;
  boards: Board[];
}

const initialState: BoardState = {
  currentBoardType: null,
  boards: [],
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoardType: (state, action: PayloadAction<BoardType>) => {
      state.currentBoardType = action.payload;
    },
    clearBoardType: state => {
      state.currentBoardType = null;
    },
    setBoardList: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    },
    clearBoardList: state => {
      state.boards = [];
    },
  },
});

export const { setBoardType, clearBoardType, setBoardList, clearBoardList } =
  boardSlice.actions;
export default boardSlice.reducer;
