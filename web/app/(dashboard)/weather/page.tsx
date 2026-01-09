"use client";

import { useState } from "react";
import { useWeather } from "@/hooks/use-weather";
import { WeatherForecast } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Wind,
  Droplets,
  Sunrise,
  Sunset,
  Cloud,
  CloudRain,
  Sun,
  CloudLightning,
  Snowflake,
  CloudDrizzle,
  Waves
} from "lucide-react";
import { format } from "date-fns";
import { LoaderModal } from "@/components/ui/loader-modal";

export default function WeatherPage() {
  const [searchCity, setSearchCity] = useState("Dhaka");
  const [inputCity, setInputCity] = useState("Dhaka");
  const { data, isLoading, error } = useWeather(searchCity);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setSearchCity(inputCity);
    }
  };

  const weather = data?.data;

  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes("clear")) return <Sun className="w-12 h-12 text-yellow-500" />;
    if (cond.includes("cloud")) return <Cloud className="w-12 h-12 text-blue-400" />;
    if (cond.includes("rain")) return <CloudRain className="w-12 h-12 text-blue-600" />;
    if (cond.includes("thunderstorm")) return <CloudLightning className="w-12 h-12 text-purple-600" />;
    if (cond.includes("snow")) return <Snowflake className="w-12 h-12 text-blue-200" />;
    if (cond.includes("drizzle")) return <CloudDrizzle className="w-12 h-12 text-blue-300" />;
    return <Waves className="w-12 h-12 text-blue-500" />;
  };

  if (isLoading) return <LoaderModal text="Fetching weather data..." />;

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sun className="text-yellow-500 w-8 h-8" />
          Nexus Weather
        </h1>
        <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
          <Input
            placeholder="Search city..."
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button type="submit">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      {error ? (
        <Card className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
          <CardContent className="flex items-center justify-center p-12">
            <p className="text-red-700 dark:text-red-400 font-medium text-center">
              Failed to fetch weather data. Please try again or check the city name.
            </p>
          </CardContent>
        </Card>
      ) : weather ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Weather Card */}
          <Card className="md:col-span-2 overflow-hidden border-none bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 dark:from-blue-600 dark:via-blue-800 dark:to-indigo-950 text-white shadow-2xl relative">
            <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-1/4 -translate-y-1/4 scale-150">
              {getWeatherIcon(weather.condition)}
            </div>
            <CardContent className="p-10 relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-5xl font-extrabold mb-2 tracking-tight">{weather.city}</h2>
                  <p className="text-2xl font-medium text-blue-100 mb-8">{weather.country}</p>

                  <div className="flex items-end gap-10">
                    <div className="flex flex-col">
                      <span className="text-8xl font-black leading-none">{Math.round(weather.temp)}°</span>
                      <p className="text-xl font-medium text-blue-100 mt-2 flex items-center gap-2">
                        Feels like {Math.round(weather.feelsLike)}°
                      </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl flex items-center gap-5 shadow-inner">
                      <div className="bg-white/10 p-3 rounded-2xl">
                        {getWeatherIcon(weather.condition)}
                      </div>
                      <div>
                        <p className="text-2xl font-bold capitalize leading-tight">{weather.condition}</p>
                        <p className="text-blue-100 mt-1">{weather.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-white/10 flex gap-12 text-blue-100">
                    <div>
                      <p className="text-xs uppercase font-bold tracking-widest opacity-60 mb-1">Humidity</p>
                      <p className="text-xl font-semibold">{weather.humidity}%</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase font-bold tracking-widest opacity-60 mb-1">Wind</p>
                      <p className="text-xl font-semibold">{weather.windSpeed} km/h</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase font-bold tracking-widest opacity-60 mb-1">Min / Max</p>
                      <p className="text-xl font-semibold">{Math.round(weather.tempMin)}° / {Math.round(weather.tempMax)}°</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur shadow-xl border-gray-100 dark:border-gray-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400">
                Sun & Day
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-1">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2.5 rounded-2xl">
                    <Sunrise className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                  </div>
                  <span className="font-medium">Sunrise</span>
                </div>
                <span className="text-lg font-bold">{format(new Date(weather.sunrise * 1000), 'p')}</span>
              </div>

              <div className="flex items-center justify-between p-1">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-2xl">
                    <Sunset className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                  </div>
                  <span className="font-medium">Sunset</span>
                </div>
                <span className="text-lg font-bold">{format(new Date(weather.sunset * 1000), 'p')}</span>
              </div>

              <div className="pt-6 border-t dark:border-gray-700">
                <p className="text-xs text-center text-gray-400 mb-2">Updated at</p>
                <p className="text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                  {format(new Date(weather.dt * 1000), 'MMMM d, yyyy p')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 5-Day Forecast */}
          <Card className="md:col-span-3 bg-white dark:bg-gray-800 shadow-xl border-gray-100 dark:border-gray-700 overflow-hidden">
            <CardHeader className="bg-gray-50 dark:bg-gray-900/50">
              <CardTitle className="text-lg font-bold">Extended Forecast</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex overflow-x-auto sm:grid sm:grid-cols-5 p-6 gap-6 sm:gap-4 no-scrollbar">
                {weather.forecast?.map((day: WeatherForecast, idx: number) => (
                  <div key={idx} className="flex flex-col items-center min-w-[120px] p-6 rounded-3xl bg-gray-50 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-blue-100 dark:hover:border-blue-900 transition-all cursor-default shadow-sm hover:shadow-md">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter mb-4">
                      {idx === 0 ? "Tomorrow" : format(new Date(day.dt * 1000), 'EEEE')}
                    </span>
                    <div className="mt-2 mb-6 scale-90">
                      {getWeatherIcon(day.condition)}
                    </div>
                    <span className="text-3xl font-black mb-1">{Math.round(day.temp)}°</span>
                    <span className="text-xs font-bold text-gray-400 text-center uppercase tracking-widest">{day.condition}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
