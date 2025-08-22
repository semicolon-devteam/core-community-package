import type { ToastActionPayload, ToastProps } from '@atoms/Toast';
import type { RootState } from '@redux/stores';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToastState {
  toastList: Array<ToastProps>;
  autoDelete?: boolean;
  autoDeleteTime: number;
}

const initialState: ToastState = {
  toastList: [],
  autoDeleteTime: 3000,
  autoDelete: true,
};

// 유니크한 ID 생성 함수
const generateUniqueId = (prefix: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`;
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state: ToastState, action: PayloadAction<ToastActionPayload>) => {
      // 기존 토스트가 있다면 제거
      const existingToast = state.toastList.find(toast => 
        toast.title === action.payload.title && 
        toast.content === action.payload.content
      );
      if (existingToast) {
        state.toastList = state.toastList.filter(toast => toast.id !== existingToast.id);
      }

      // 새로운 토스트 추가
      const newToast = {
        ...action.payload,
        id: generateUniqueId('toast'),
      };
      state.toastList = [...state.toastList, newToast];
    },
    deleteToast: (state: ToastState, action: PayloadAction<string>) => {
      state.toastList = state.toastList.filter(toast => toast.id !== action.payload);
    },
  },
});

export const { showToast, deleteToast } = toastSlice.actions;

export const selectToast = (state: RootState): ToastState => state.toastSlice;

export default toastSlice.reducer;
