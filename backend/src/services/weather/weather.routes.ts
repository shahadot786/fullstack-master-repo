import { Router } from 'express';
import * as weatherController from './weather.controller';
import { authenticate } from '@middleware/auth.middleware';
import { rateLimit } from 'express-rate-limit';

const router = Router();

/**
 * @swagger
 * /api/weather:
 *   get:
 *     summary: Get weather information
 *     description: Retrieves current weather and forecast for a specified city
 *     tags: [Weather]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *           default: Dhaka
 *         description: City name to get weather for
 *     responses:
 *       200:
 *         description: Weather data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Weather'
 */
const weatherLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 900, // Global limit of 900 requests per day for the entire service
    message: {
        success: false,
        message: 'Daily global weather API limit exceeded. Please try again tomorrow.',
    },
    keyGenerator: () => 'global-weather-service',
    standardHeaders: true,
    legacyHeaders: false,
});

router.get('/', authenticate, weatherLimiter, weatherController.getWeather);

export default router;
