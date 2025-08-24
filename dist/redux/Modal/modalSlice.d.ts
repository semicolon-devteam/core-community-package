import { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@redux/stores';
interface ModalState {
    show: boolean;
    loading: boolean;
}
export declare const modalSlice: import("@reduxjs/toolkit").Slice<ModalState, {
    handleModal: (state: ModalState, action: PayloadAction<boolean>) => void;
    onRequest: (state: ModalState) => void;
    onResponse: (state: ModalState) => void;
}, "modal", "modal", import("@reduxjs/toolkit").SliceSelectors<ModalState>>;
export declare const handleModal: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<boolean, "modal/handleModal">, onRequest: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"modal/onRequest">, onResponse: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"modal/onResponse">;
export declare const selectModal: (state: RootState) => ModalState;
declare const _default: import("redux").Reducer<ModalState>;
export default _default;
