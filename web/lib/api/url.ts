 import apiClient from "./client";
import {
  Url,
  CreateUrlDto,
  UrlsResponse,
  UrlQueryParams,
} from "@/types";

const URL_API = "/url";

/**
 * URL Shortener API Client
 */
export const urlApi = {
  /**
   * Shorten a URL
   */
  shortenUrl: async (data: CreateUrlDto): Promise<Url> => {
    const response = await apiClient.post(`${URL_API}/shorten`, data);
    return response.data.data;
  },

  /**
   * Get all URLs for current user
   */
  getMyUrls: async (params?: UrlQueryParams): Promise<UrlsResponse> => {
    const response = await apiClient.get(`${URL_API}/my-urls`, { params });
    return response.data;
  },

  /**
   * Delete a shortened URL
   */
  deleteUrl: async (id: string): Promise<void> => {
    await apiClient.delete(`${URL_API}/${id}`);
  },

  /**
   * Get URL stats
   */
  getUrlStats: async (id: string): Promise<Url> => {
    const response = await apiClient.get(`${URL_API}/stats/${id}`);
    return response.data.data;
  },
};

export default urlApi;
