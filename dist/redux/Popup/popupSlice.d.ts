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
export declare const showPopup: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<PopupConfig, "popup/showPopup">, hidePopup: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "popup/hidePopup">, removePopup: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "popup/removePopup">, hideAllPopups: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"popup/hideAllPopups">, removeAllPopups: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"popup/removeAllPopups">;
export declare const selectPopupState: (state: RootState) => PopupState;
declare const _default: import("redux").Reducer<PopupState>;
export default _default;
