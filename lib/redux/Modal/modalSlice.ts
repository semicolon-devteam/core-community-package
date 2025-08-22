import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@redux/stores';

interface ModalState {
  show: boolean;
  loading: boolean;
}

const initialState: ModalState = {
  show: false,
  loading: false,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    handleModal: (state: ModalState, action: PayloadAction<boolean>) => {
      state.show = action.payload;
    },
    onRequest: (state: ModalState) => {
      state.show = true;
      state.loading = true;
    },
    onResponse: (state: ModalState) => {
      state.show = false;
      state.loading = false;
    },
  },
});

export const { handleModal, onRequest, onResponse } = modalSlice.actions;

export const selectModal = (state: RootState): ModalState => state.modalSlice;

export default modalSlice.reducer;
