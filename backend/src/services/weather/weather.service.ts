import axios from 'axios';
import { WeatherData, WeatherForecast } from '@fullstack-master/shared';
import { config } from '@config/index';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetch weather data from OpenWeatherMap API
 * Fallbacks to mock data if API key is missing or request fails
 */
export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
    if (!config.weather.apiKey) {
        return getMockWeather(city);
    }

    try {
        const response = await axios.get(`${BASE_URL}/weather`, {
            params: {
                q: city,
                appid: config.weather.apiKey,
                units: 'metric',
            },
        });

        const data = response.data;
        
        let forecastData: WeatherForecast[] = [];
        try {
            const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
                params: {
                    q: city,
                    appid: config.weather.apiKey,
                    units: 'metric',
                },
            });

            forecastData = forecastResponse.data.list
                .filter((_: any, index: number) => index % 8 === 0) 
                .map((item: any): WeatherForecast => ({
                    dt: item.dt,
                    temp: item.main.temp,
                    description: item.weather[0].description,
                    icon: item.weather[0].icon,
                    condition: item.weather[0].main,
                }));
        } catch (e) {
            console.error('Forecast API error');
        }

        return {
            city: data.name,
            country: data.sys.country,
            description: data.weather[0].description,
            temp: data.main.temp,
            feelsLike: data.main.feels_like,
            tempMin: data.main.temp_min,
            tempMax: data.main.temp_max,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            icon: data.weather[0].icon,
            condition: data.weather[0].main,
            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset,
            dt: data.dt,
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
        country: 'BD',
        description: 'scattered clouds',
        temp: 28.5,
        feelsLike: 31.2,
        tempMin: 27,
        tempMax: 30,
        humidity: 65,
        windSpeed: 4.5,
        icon: '03d',
        condition: 'Clouds',
        sunrise: 1704841200,
        sunset: 1704884400,
        dt: Date.now() / 1000,
        forecast: [
            { dt: Math.floor(Date.now() / 1000) + 86400, temp: 29, description: 'clear sky', icon: '01d', condition: 'Clear' },
            { dt: Math.floor(Date.now() / 1000) + 172800, temp: 27.5, description: 'few clouds', icon: '02d', condition: 'Clouds' },
            { dt: Math.floor(Date.now() / 1000) + 259200, temp: 26, description: 'rain', icon: '10d', condition: 'Rain' },
            { dt: Math.floor(Date.now() / 1000) + 345600, temp: 28, description: 'broken clouds', icon: '04d', condition: 'Clouds' },
            { dt: Math.floor(Date.now() / 1000) + 432000, temp: 30, description: 'clear sky', icon: '01d', condition: 'Clear' },
        ],
    };
};
