import axiosInstance from "../config/axios";
import { CommonResponse, CommonStatus } from "../types/common";
import { AxiosResponse, AxiosError } from "axios";

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
export class BaseService<T = any> {
  protected baseUrl: string;
  protected defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = '', defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }

  /**
   * Handle API errors and transform them to CommonResponse format
   */
  protected handleError<R>(error: any): CommonResponse<R> {
    if (error instanceof AxiosError) {
      const status = error.response?.status || CommonStatus.INTERNAL_SERVER_ERROR;
      const message = error.response?.data?.message || error.message || 'An error occurred';
      
      return {
        successOrNot: 'N',
        statusCode: status,
        message,
        data: null,
      };
    }

    return {
      successOrNot: 'N',
      statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'Unknown error occurred',
      data: null,
    };
  }

  /**
   * Build complete endpoint URL
   */
  protected buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    return `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }

  /**
   * Prepare request config with options
   */
  protected prepareConfig(options?: RequestOptions) {
    const config: any = {
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
      params: options?.params,
      timeout: options?.timeout,
    };

    // Add metadata for loader control
    if (options?.skipLoader || options?.useMiniLoader || options?.loaderText) {
      config.metadata = {
        skipLoader: options.skipLoader,
        useMiniLoader: options.useMiniLoader,
        loaderText: options.loaderText,
      };
    }

    return config;
  }

  // Standard HTTP methods with global loader
  public async get<R = T>(endpoint: string, options?: RequestOptions): Promise<CommonResponse<R>> {
    try {
      const url = this.buildUrl(endpoint);
      const config = this.prepareConfig(options);
      
      const response: AxiosResponse<CommonResponse<R>> = await axiosInstance.get(url, config);
      return response.data;
    } catch (error) {
      return this.handleError<R>(error);
    }
  }

  public async post<R = T, D = any>(
    endpoint: string, 
    data?: D, 
    options?: RequestOptions
  ): Promise<CommonResponse<R>> {
    try {
      const url = this.buildUrl(endpoint);
      const config = this.prepareConfig(options);
      
      const response: AxiosResponse<CommonResponse<R>> = await axiosInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError<R>(error);
    }
  }

  public async put<R = T, D = any>(
    endpoint: string, 
    data: D, 
    options?: RequestOptions
  ): Promise<CommonResponse<R>> {
    try {
      const url = this.buildUrl(endpoint);
      const config = this.prepareConfig(options);
      
      const response: AxiosResponse<CommonResponse<R>> = await axiosInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError<R>(error);
    }
  }

  public async patch<R = T, D = any>(
    endpoint: string, 
    data: D, 
    options?: RequestOptions
  ): Promise<CommonResponse<R>> {
    try {
      const url = this.buildUrl(endpoint);
      const config = this.prepareConfig(options);
      
      const response: AxiosResponse<CommonResponse<R>> = await axiosInstance.patch(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError<R>(error);
    }
  }

  public async delete<R = T>(endpoint: string, options?: RequestOptions): Promise<CommonResponse<R>> {
    try {
      const url = this.buildUrl(endpoint);
      const config = this.prepareConfig(options);
      
      const response: AxiosResponse<CommonResponse<R>> = await axiosInstance.delete(url, config);
      return response.data;
    } catch (error) {
      return this.handleError<R>(error);
    }
  }

  // Silent methods (bypass global loader)
  public async getSilent<R = T>(endpoint: string, options?: RequestOptions): Promise<CommonResponse<R>> {
    return this.get<R>(endpoint, { ...options, skipLoader: true });
  }

  public async postSilent<R = T, D = any>(
    endpoint: string, 
    data?: D, 
    options?: RequestOptions
  ): Promise<CommonResponse<R>> {
    return this.post<R, D>(endpoint, data, { ...options, skipLoader: true });
  }

  public async putSilent<R = T, D = any>(
    endpoint: string, 
    data: D, 
    options?: RequestOptions
  ): Promise<CommonResponse<R>> {
    return this.put<R, D>(endpoint, data, { ...options, skipLoader: true });
  }

  public async patchSilent<R = T, D = any>(
    endpoint: string, 
    data: D, 
    options?: RequestOptions
  ): Promise<CommonResponse<R>> {
    return this.patch<R, D>(endpoint, data, { ...options, skipLoader: true });
  }

  public async deleteSilent<R = T>(endpoint: string, options?: RequestOptions): Promise<CommonResponse<R>> {
    return this.delete<R>(endpoint, { ...options, skipLoader: true });
  }

  // Mini loader methods (use mini loader instead of global loader)
  public async getMini<R = T>(
    endpoint: string, 
    text?: string, 
    options?: RequestOptions
  ): Promise<CommonResponse<R>> {
    return this.get<R>(endpoint, { ...options, useMiniLoader: true, loaderText: text });
  }

  public async postMini<R = T, D = any>(
    endpoint: string, 
    data?: D, 
    text?: string, 
    options?: RequestOptions
  ): Promise<CommonResponse<R>> {
    return this.post<R, D>(endpoint, data, { ...options, useMiniLoader: true, loaderText: text });
  }

  public async putMini<R = T, D = any>(
    endpoint: string, 
    data: D, 
    text?: string, 
    options?: RequestOptions
  ): Promise<CommonResponse<R>> {
    return this.put<R, D>(endpoint, data, { ...options, useMiniLoader: true, loaderText: text });
  }

  public async patchMini<R = T, D = any>(
    endpoint: string, 
    data: D, 
    text?: string, 
    options?: RequestOptions
  ): Promise<CommonResponse<R>> {
    return this.patch<R, D>(endpoint, data, { ...options, useMiniLoader: true, loaderText: text });
  }

  public async deleteMini<R = T>(
    endpoint: string, 
    text?: string, 
    options?: RequestOptions
  ): Promise<CommonResponse<R>> {
    return this.delete<R>(endpoint, { ...options, useMiniLoader: true, loaderText: text });
  }
}

// Legacy support - functional interface (deprecated, use BaseService class instead)
const baseService = {
  async get<T>(endpoint: string): Promise<CommonResponse<T>> {
    const service = new BaseService();
    return service.get<T>(endpoint);
  },

  async post<T, D>(endpoint: string, data: D): Promise<CommonResponse<T>> {
    const service = new BaseService();
    return service.post<T, D>(endpoint, data);
  },

  async put<T, D>(endpoint: string, data: D): Promise<CommonResponse<T>> {
    const service = new BaseService();
    return service.put<T, D>(endpoint, data);
  },

  async patch<T, D>(endpoint: string, data: D): Promise<CommonResponse<T>> {
    const service = new BaseService();
    return service.patch<T, D>(endpoint, data);
  },

  async delete<T>(endpoint: string): Promise<CommonResponse<T>> {
    const service = new BaseService();
    return service.delete<T>(endpoint);
  },

  // Silent methods
  async getSilent<T>(endpoint: string): Promise<CommonResponse<T>> {
    const service = new BaseService();
    return service.getSilent<T>(endpoint);
  },

  async postSilent<T, D>(endpoint: string, data: D): Promise<CommonResponse<T>> {
    const service = new BaseService();
    return service.postSilent<T, D>(endpoint, data);
  },

  async putSilent<T, D>(endpoint: string, data: D): Promise<CommonResponse<T>> {
    const service = new BaseService();
    return service.putSilent<T, D>(endpoint, data);
  },

  async deleteSilent<T>(endpoint: string): Promise<CommonResponse<T>> {
    const service = new BaseService();
    return service.deleteSilent<T>(endpoint);
  },

  // Mini loader methods
  async getMini<T>(endpoint: string, text?: string): Promise<CommonResponse<T>> {
    const service = new BaseService();
    return service.getMini<T>(endpoint, text);
  },

  async postMini<T, D>(endpoint: string, data: D, text?: string): Promise<CommonResponse<T>> {
    const service = new BaseService();
    return service.postMini<T, D>(endpoint, data, text);
  },

  async putMini<T, D>(endpoint: string, data: D, text?: string): Promise<CommonResponse<T>> {
    const service = new BaseService();
    return service.putMini<T, D>(endpoint, data, text);
  },

  async patchMini<T, D>(endpoint: string, data: D, text?: string): Promise<CommonResponse<T>> {
    const service = new BaseService();
    return service.patchMini<T, D>(endpoint, data, text);
  },

  async deleteMini<T>(endpoint: string, text?: string): Promise<CommonResponse<T>> {
    const service = new BaseService();
    return service.deleteMini<T>(endpoint, text);
  },
};

export { baseService };
export default BaseService;
