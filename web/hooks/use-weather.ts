import { useQuery } from "@tanstack/react-query";
import { weatherApi } from "@/lib/api/weather";

export const useWeather = (city: string) => {
  return useQuery({
    queryKey: ["weather", city],
    queryFn: () => weatherApi.getWeather(city),
    enabled: !!city,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
