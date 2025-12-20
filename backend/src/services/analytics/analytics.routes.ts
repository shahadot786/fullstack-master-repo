import { Router } from "express";
import { getAnalytics } from "./analytics.controller";

const router = Router();

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get global analytics for all users and services
 *     description: Retrieve comprehensive analytics data including user activities and service statistics. This endpoint is publicly accessible.
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Analytics retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           imageUrl:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           services:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                 total:
 *                                   type: integer
 *                                 completed:
 *                                   type: integer
 *                                 pending:
 *                                   type: integer
 *                     services:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           total:
 *                             type: integer
 *                           completed:
 *                             type: integer
 *                           pending:
 *                             type: integer
 *       500:
 *         description: Server error
 */
router.get("/", getAnalytics);

export default router;
