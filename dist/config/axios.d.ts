export declare const axiosInstance: import("axios").AxiosInstance;
export declare const setGlobalLoaderFunctions: (showLoader: (text?: string) => void, hideLoader: () => void, setLoaderText: (text: string) => void, showMiniLoader?: (text?: string) => void, hideMiniLoader?: () => void, setMiniLoaderText?: (text: string) => void) => void;
export declare const setApiLoaderText: (text: string) => void;
export declare const apiWithCustomLoader: <T = any>(apiCall: () => Promise<T>, loaderText: string) => Promise<T>;
export default axiosInstance;
