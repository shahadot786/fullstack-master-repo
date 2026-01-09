import apiClient from "./client";
import { WeatherData, ApiResponse } from "@/types";

export const weatherApi = {
  getWeather: async (city: string): Promise<ApiResponse<WeatherData>> => {
    const response = await apiClient.get<ApiResponse<WeatherData>>("/weather", {
      params: { city },
    });
    return response.data;
  },
};
