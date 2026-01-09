import axios from 'axios';
import { WeatherData, WeatherForecast } from '@fullstack-master/shared';
import { config } from '@config/index';

const BASE_URL = 'https://api.weatherapi.com/v1';

/**
 * Fetch weather data from WeatherAPI.com
 * Uses forecast.json endpoint which provides both current weather AND forecast
 */
export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
    if (!config.weather.apiKey) {
        return getMockWeather(city);
    }

    try {
        const response = await axios.get(`${BASE_URL}/forecast.json`, {
            params: {
                key: config.weather.apiKey,
                q: city,
                days: 5,
                aqi: 'no',
                alerts: 'no',
            },
        });

        const data = response.data;
        const current = data.current;
        const location = data.location;

        const forecastData: WeatherForecast[] = data.forecast.forecastday.map((day: any): WeatherForecast => ({
            dt: day.date_epoch,
            temp: day.day.avgtemp_c,
            description: day.day.condition.text,
            icon: day.day.condition.icon,
            condition: day.day.condition.text,
        }));

        return {
            city: location.name,
            country: location.country,
            description: current.condition.text,
            temp: current.temp_c,
            feelsLike: current.feelslike_c,
            tempMin: data.forecast.forecastday[0]?.day.mintemp_c || current.temp_c,
            tempMax: data.forecast.forecastday[0]?.day.maxtemp_c || current.temp_c,
            humidity: current.humidity,
            windSpeed: parseFloat((current.wind_kph / 3.6).toFixed(2)), // Convert to m/s, rounded
            icon: current.condition.icon,
            condition: current.condition.text,
            sunrise: 0,
            sunset: 0,
            dt: current.last_updated_epoch,
            forecast: forecastData,
        };
    } catch (error: any) {
        console.error('Weather API error:', error.response?.data || error.message);
        return getMockWeather(city);
    }
};

const getMockWeather = (city: string): WeatherData => {
    return {
        city: city || 'Dhaka',
        country: 'Bangladesh',
        description: 'scattered clouds',
        temp: 28.5,
        feelsLike: 31.2,
        tempMin: 27,
        tempMax: 30,
        humidity: 65,
        windSpeed: 4.5,
        icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
        condition: 'Clouds',
        sunrise: 1704841200,
        sunset: 1704884400,
        dt: Date.now() / 1000,
        forecast: [
            { dt: Math.floor(Date.now() / 1000) + 86400, temp: 29, description: 'clear sky', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png', condition: 'Clear' },
            { dt: Math.floor(Date.now() / 1000) + 172800, temp: 27.5, description: 'few clouds', icon: '//cdn.weatherapi.com/weather/64x64/day/116.png', condition: 'Clouds' },
            { dt: Math.floor(Date.now() / 1000) + 259200, temp: 26, description: 'rain', icon: '//cdn.weatherapi.com/weather/64x64/day/176.png', condition: 'Rain' },
            { dt: Math.floor(Date.now() / 1000) + 345600, temp: 28, description: 'broken clouds', icon: '//cdn.weatherapi.com/weather/64x64/day/119.png', condition: 'Clouds' },
            { dt: Math.floor(Date.now() / 1000) + 432000, temp: 30, description: 'clear sky', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png', condition: 'Clear' },
        ],
    };
};
