import { Response } from 'express';
import { asyncHandler } from '@common/utils/async-handler.util';
import { sendSuccess } from '@common/utils/response.util';
import * as weatherService from './weather.service';
import { AuthRequest } from '@middleware/auth.middleware';

/**
 * Get weather for a city
 * GET /api/weather?city=Dhaka
 */
export const getWeather = asyncHandler(async (req: AuthRequest, res: Response) => {
    const city = (req.query.city as string) || 'Dhaka';
    const weather = await weatherService.getWeatherByCity(city);
    sendSuccess(res, weather);
});
