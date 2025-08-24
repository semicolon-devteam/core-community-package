export declare const useRouterWithLoader: () => {
    push: (href: string, options?: {
        scroll?: boolean;
    }) => void;
    replace: (href: string, options?: {
        scroll?: boolean;
    }) => void;
    back(): void;
    forward(): void;
    refresh(): void;
    prefetch(href: string, options?: import("next/dist/shared/lib/app-router-context.shared-runtime").PrefetchOptions): void;
};
