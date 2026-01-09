import apiClient from './client';
import { WeatherData, ApiResponse } from '@/types';

export const weatherApi = {
    getWeather: async (city: string): Promise<WeatherData> => {
        const response = await apiClient.get<ApiResponse<WeatherData>>('/weather', {
            params: { city },
        });
        
        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || 'Failed to fetch weather');
        }
        
        return response.data.data;
    },
};
