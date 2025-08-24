export declare const useGlobalLoader: () => {
    showLoader: (text?: string) => void;
    hideLoader: () => void;
    withLoader: <T>(asyncFn: () => Promise<T>) => Promise<T>;
    setLoaderText: (text?: string) => void;
    showPostLoader: (text?: string) => void;
    hidePostLoader: () => void;
    withPostLoader: <T>(asyncFn: () => Promise<T>) => Promise<T>;
    setPostLoaderText: (text?: string) => void;
    showMiniLoader: (text?: string) => void;
    hideMiniLoader: () => void;
    withMiniLoader: <T>(asyncFn: () => Promise<T>) => Promise<T>;
    setMiniLoaderText: (text?: string) => void;
};
