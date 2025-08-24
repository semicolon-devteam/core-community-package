import type { RootState } from "@redux/stores";
interface UIState {
    isMobileMenuOpen: boolean;
    isMobile: boolean;
    isSearchExpanded: boolean;
    isLoading: boolean;
    loadingText: string;
    isMiniLoading: boolean;
    miniLoadingText: string;
    isAutoTransitioned: boolean;
}
export declare const uiSlice: import("@reduxjs/toolkit").Slice<UIState, {
    toggleMobileMenu: (state: import("immer").WritableDraft<UIState>) => void;
    openMobileMenu: (state: import("immer").WritableDraft<UIState>) => void;
    closeMobileMenu: (state: import("immer").WritableDraft<UIState>) => void;
    setIsMobile: (state: import("immer").WritableDraft<UIState>, action: {
        payload: any;
        type: string;
    }) => void;
    toggleSearchExpand: (state: import("immer").WritableDraft<UIState>) => void;
    expandSearch: (state: import("immer").WritableDraft<UIState>) => void;
    collapseSearch: (state: import("immer").WritableDraft<UIState>) => void;
    showLoading: (state: import("immer").WritableDraft<UIState>, action: {
        payload: any;
        type: string;
    }) => void;
    hideLoading: (state: import("immer").WritableDraft<UIState>) => void;
    setLoadingText: (state: import("immer").WritableDraft<UIState>, action: {
        payload: any;
        type: string;
    }) => void;
    showMiniLoading: (state: import("immer").WritableDraft<UIState>, action: {
        payload: any;
        type: string;
    }) => void;
    hideMiniLoading: (state: import("immer").WritableDraft<UIState>) => void;
    setMiniLoadingText: (state: import("immer").WritableDraft<UIState>, action: {
        payload: any;
        type: string;
    }) => void;
    transitionToMiniLoader: (state: import("immer").WritableDraft<UIState>, action: {
        payload: any;
        type: string;
    }) => void;
    hideAllLoaders: (state: import("immer").WritableDraft<UIState>) => void;
}, "ui", "ui", import("@reduxjs/toolkit").SliceSelectors<UIState>>;
export declare const toggleMobileMenu: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"ui/toggleMobileMenu">, openMobileMenu: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"ui/openMobileMenu">, closeMobileMenu: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"ui/closeMobileMenu">, setIsMobile: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "ui/setIsMobile">, toggleSearchExpand: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"ui/toggleSearchExpand">, expandSearch: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"ui/expandSearch">, collapseSearch: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"ui/collapseSearch">, showLoading: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "ui/showLoading">, hideLoading: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"ui/hideLoading">, setLoadingText: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "ui/setLoadingText">, showMiniLoading: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "ui/showMiniLoading">, hideMiniLoading: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"ui/hideMiniLoading">, setMiniLoadingText: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "ui/setMiniLoadingText">, transitionToMiniLoader: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "ui/transitionToMiniLoader">, hideAllLoaders: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"ui/hideAllLoaders">;
export declare const selectUIState: (state: RootState) => any;
declare const _default: import("redux").Reducer<UIState>;
export default _default;
