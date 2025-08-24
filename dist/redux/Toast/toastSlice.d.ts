import type { ToastActionPayload, ToastProps } from '@atoms/Toast';
import type { RootState } from '@redux/stores';
import { PayloadAction } from '@reduxjs/toolkit';
interface ToastState {
    toastList: Array<ToastProps>;
    autoDelete?: boolean;
    autoDeleteTime: number;
}
export declare const toastSlice: import("@reduxjs/toolkit").Slice<ToastState, {
    showToast: (state: ToastState, action: PayloadAction<ToastActionPayload>) => void;
    deleteToast: (state: ToastState, action: PayloadAction<string>) => void;
}, "toast", "toast", import("@reduxjs/toolkit").SliceSelectors<ToastState>>;
export declare const showToast: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "toast/showToast">, deleteToast: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "toast/deleteToast">;
export declare const selectToast: (state: RootState) => ToastState;
declare const _default: import("redux").Reducer<ToastState>;
export default _default;
