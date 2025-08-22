import axiosInstance from "@config/axios";
import { CommonResponse } from "@model/common";
import { AxiosResponse } from "axios";

const baseService = {
  async get<T>(endpoint: string): Promise<CommonResponse<T>> {
    const response: AxiosResponse<CommonResponse<T>> = await axiosInstance.get(
      endpoint
    );
    return response.data;
  },

  async post<T, D>(endpoint: string, data: D): Promise<CommonResponse<T>> {
    const response: AxiosResponse<CommonResponse<T>> = await axiosInstance.post(
      endpoint,
      data
    );
    return response.data;
  },

  async put<T, D>(endpoint: string, data: D): Promise<CommonResponse<T>> {
    const response: AxiosResponse<CommonResponse<T>> = await axiosInstance.put(
      endpoint,
      data
    );
    return response.data;
  },

  async patch<T, D>(endpoint: string, data: D): Promise<CommonResponse<T>> {
    const response: AxiosResponse<CommonResponse<T>> = await axiosInstance.patch(
      endpoint,
      data
    );
    return response.data;
  },

  async delete<T>(endpoint: string): Promise<CommonResponse<T>> {
    const response: AxiosResponse<CommonResponse<T>> = await axiosInstance.delete(
      endpoint
    );
    return response.data;
  },

  // 로더 없이 API 요청하는 메서드들 (silent 버전)
  async getSilent<T>(endpoint: string): Promise<CommonResponse<T>> {
    const response: AxiosResponse<CommonResponse<T>> = await axiosInstance.get(
      endpoint,
      { metadata: { skipLoader: true } } as any
    );
    return response.data;
  },

  async postSilent<T, D>(endpoint: string, data: D): Promise<CommonResponse<T>> {
    const response: AxiosResponse<CommonResponse<T>> = await axiosInstance.post(
      endpoint,
      data,
      { metadata: { skipLoader: true } } as any
    );
    return response.data;
  },

  async putSilent<T, D>(endpoint: string, data: D): Promise<CommonResponse<T>> {
    const response: AxiosResponse<CommonResponse<T>> = await axiosInstance.put(
      endpoint,
      data,
      { metadata: { skipLoader: true } } as any
    );
    return response.data;
  },

  async deleteSilent<T>(endpoint: string): Promise<CommonResponse<T>> {
    const response: AxiosResponse<CommonResponse<T>> = await axiosInstance.delete(
      endpoint,
      { metadata: { skipLoader: true } } as any
    );
    return response.data;
  },

  // 미니 로더를 사용하는 메서드들
  async getMini<T>(endpoint: string, text?: string): Promise<CommonResponse<T>> {
    const response: AxiosResponse<CommonResponse<T>> = await axiosInstance.get(
      endpoint,
      { metadata: { useMiniLoader: true, loaderText: text } } as any
    );
    return response.data;
  },

  async postMini<T, D>(endpoint: string, data: D, text?: string): Promise<CommonResponse<T>> {
    const response: AxiosResponse<CommonResponse<T>> = await axiosInstance.post(
      endpoint,
      data,
      { metadata: { useMiniLoader: true, loaderText: text } } as any
    );
    return response.data;
  },

  async putMini<T, D>(endpoint: string, data: D, text?: string): Promise<CommonResponse<T>> {
    const response: AxiosResponse<CommonResponse<T>> = await axiosInstance.put(
      endpoint,
      data,
      { metadata: { useMiniLoader: true, loaderText: text } } as any
    );
    return response.data;
  },

  async patchMini<T, D>(endpoint: string, data: D, text?: string): Promise<CommonResponse<T>> {
    const response: AxiosResponse<CommonResponse<T>> = await axiosInstance.patch(
      endpoint,
      data,
      { metadata: { useMiniLoader: true, loaderText: text } } as any
    );
    return response.data;
  },

  async deleteMini<T>(endpoint: string, text?: string): Promise<CommonResponse<T>> {
    const response: AxiosResponse<CommonResponse<T>> = await axiosInstance.delete(
      endpoint,
      { metadata: { useMiniLoader: true, loaderText: text } } as any
    );
    return response.data;
  },
};

export default baseService;
