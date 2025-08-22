import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@redux/stores";

export interface PopupConfig {
  id: string;
  title?: string;
  content: React.ReactNode | string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  onClose?: () => void;
  showCancel?: boolean;
  showConfirm?: boolean;
  type?: "info" | "warning" | "error" | "success" | "confirm";
  width?: string;
  height?: string;
  closable?: boolean;
  backdrop?: boolean;
}

interface PopupState {
  popups: PopupConfig[];
  isVisible: Record<string, boolean>;
}

const initialState: PopupState = {
  popups: [],
  isVisible: {},
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    showPopup: (state, action: PayloadAction<PopupConfig>) => {
      const popup = action.payload;

      // 기존에 같은 ID의 팝업이 있으면 제거
      state.popups = state.popups.filter((p) => p.id !== popup.id);

      // 새 팝업 추가
      state.popups.push(popup);
      state.isVisible[popup.id] = true;
    },
    hidePopup: (state, action: PayloadAction<string>) => {
      const popupId = action.payload;
      state.isVisible[popupId] = false;
    },

    removePopup: (state, action: PayloadAction<string>) => {
      const popupId = action.payload;
      state.popups = state.popups.filter((p) => p.id !== popupId);
      delete state.isVisible[popupId];
    },

    hideAllPopups: (state) => {
      state.popups.forEach((popup) => {
        state.isVisible[popup.id] = false;
      });
    },

    removeAllPopups: (state) => {
      state.popups = [];
      state.isVisible = {};
    },
  },
});

export const {
  showPopup,
  hidePopup,
  removePopup,
  hideAllPopups,
  removeAllPopups,
} = popupSlice.actions;

export const selectPopupState = (state: RootState) => state.popup;

export default popupSlice.reducer;
