import { CommonResponse } from "../types/common";
/**
 * HTTP Method types for API requests
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
/**
 * Request options for API calls
 */
export interface RequestOptions {
    headers?: Record<string, string>;
    params?: Record<string, any>;
    timeout?: number;
    skipLoader?: boolean;
    useMiniLoader?: boolean;
    loaderText?: string;
}
/**
 * Base API Service Class
 * Provides standardized HTTP methods with global loading indicator integration
 * and consistent error handling following CommonResponse<T> pattern
 */
export declare class BaseService<T = any> {
    protected baseUrl: string;
    protected defaultHeaders: Record<string, string>;
    constructor(baseUrl?: string, defaultHeaders?: Record<string, string>);
    /**
     * Handle API errors and transform them to CommonResponse format
     */
    protected handleError<R>(error: any): CommonResponse<R>;
    /**
     * Build complete endpoint URL
     */
    protected buildUrl(endpoint: string): string;
    /**
     * Prepare request config with options
     */
    protected prepareConfig(options?: RequestOptions): any;
    get<R = T>(endpoint: string, options?: RequestOptions): Promise<CommonResponse<R>>;
    post<R = T, D = any>(endpoint: string, data?: D, options?: RequestOptions): Promise<CommonResponse<R>>;
    put<R = T, D = any>(endpoint: string, data: D, options?: RequestOptions): Promise<CommonResponse<R>>;
    patch<R = T, D = any>(endpoint: string, data: D, options?: RequestOptions): Promise<CommonResponse<R>>;
    delete<R = T>(endpoint: string, options?: RequestOptions): Promise<CommonResponse<R>>;
    getSilent<R = T>(endpoint: string, options?: RequestOptions): Promise<CommonResponse<R>>;
    postSilent<R = T, D = any>(endpoint: string, data?: D, options?: RequestOptions): Promise<CommonResponse<R>>;
    putSilent<R = T, D = any>(endpoint: string, data: D, options?: RequestOptions): Promise<CommonResponse<R>>;
    patchSilent<R = T, D = any>(endpoint: string, data: D, options?: RequestOptions): Promise<CommonResponse<R>>;
    deleteSilent<R = T>(endpoint: string, options?: RequestOptions): Promise<CommonResponse<R>>;
    getMini<R = T>(endpoint: string, text?: string, options?: RequestOptions): Promise<CommonResponse<R>>;
    postMini<R = T, D = any>(endpoint: string, data?: D, text?: string, options?: RequestOptions): Promise<CommonResponse<R>>;
    putMini<R = T, D = any>(endpoint: string, data: D, text?: string, options?: RequestOptions): Promise<CommonResponse<R>>;
    patchMini<R = T, D = any>(endpoint: string, data: D, text?: string, options?: RequestOptions): Promise<CommonResponse<R>>;
    deleteMini<R = T>(endpoint: string, text?: string, options?: RequestOptions): Promise<CommonResponse<R>>;
}
declare const baseService: {
    get<T>(endpoint: string): Promise<CommonResponse<T>>;
    post<T, D>(endpoint: string, data: D): Promise<CommonResponse<T>>;
    put<T, D>(endpoint: string, data: D): Promise<CommonResponse<T>>;
    patch<T, D>(endpoint: string, data: D): Promise<CommonResponse<T>>;
    delete<T>(endpoint: string): Promise<CommonResponse<T>>;
    getSilent<T>(endpoint: string): Promise<CommonResponse<T>>;
    postSilent<T, D>(endpoint: string, data: D): Promise<CommonResponse<T>>;
    putSilent<T, D>(endpoint: string, data: D): Promise<CommonResponse<T>>;
    deleteSilent<T>(endpoint: string): Promise<CommonResponse<T>>;
    getMini<T>(endpoint: string, text?: string): Promise<CommonResponse<T>>;
    postMini<T, D>(endpoint: string, data: D, text?: string): Promise<CommonResponse<T>>;
    putMini<T, D>(endpoint: string, data: D, text?: string): Promise<CommonResponse<T>>;
    patchMini<T, D>(endpoint: string, data: D, text?: string): Promise<CommonResponse<T>>;
    deleteMini<T>(endpoint: string, text?: string): Promise<CommonResponse<T>>;
};
export { baseService };
export default BaseService;
