import apiClient from './client';
import { API_ENDPOINTS } from '@/config/constants';
import { 
  Url, 
  CreateUrlDto, 
  UrlsResponse, 
  UrlQueryParams 
} from '@/types';

/**
 * URL Shortener API
 */
export const urlApi = {
    /**
     * Shorten a URL
     */
    shortenUrl: async (data: CreateUrlDto): Promise<Url> => {
        const response = await apiClient.post(API_ENDPOINTS.URL_SHORTEN, data);
        return response.data.data;
    },

    /**
     * Get all URLs for current user
     */
    getMyUrls: async (params?: UrlQueryParams): Promise<UrlsResponse> => {
        const response = await apiClient.get(API_ENDPOINTS.URL_MY_URLS, { params });
        return response.data;
    },

    /**
     * Delete a shortened URL
     */
    deleteUrl: async (id: string): Promise<void> => {
        await apiClient.delete(`${API_ENDPOINTS.URL_BASE}/${id}`);
    },

    /**
     * Get URL stats
     */
    getUrlStats: async (id: string): Promise<Url> => {
        const response = await apiClient.get(`${API_ENDPOINTS.URL_BASE}/stats/${id}`);
        return response.data.data;
    },
};
