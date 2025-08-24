import { type PopupConfig } from "@redux/Features/Popup/popupSlice";
export declare const useGlobalPopup: () => {
    popup: (config: Omit<PopupConfig, "id"> & {
        id?: string;
    }) => any;
    alert: (content: string | React.ReactNode, title?: string, options?: Partial<PopupConfig>) => any;
    confirm: (content: string | React.ReactNode, title?: string, options?: Partial<PopupConfig>) => Promise<boolean>;
    success: (content: string | React.ReactNode, title?: string) => any;
    error: (content: string | React.ReactNode, title?: string) => any;
    warning: (content: string | React.ReactNode, title?: string) => any;
    closeAll: () => void;
};
