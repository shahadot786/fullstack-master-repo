import { Router } from "express";
import * as urlController from "./url.controller";
import { authenticate } from "@middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: URL Shortener
 *   description: URL shortening and redirection
 */

/**
 * @swagger
 * /api/url/shorten:
 *   post:
 *     summary: Shorten a URL
 *     tags: [URL Shortener]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalUrl
 *             properties:
 *               originalUrl:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: URL shortened successfully
 */
router.post("/shorten", authenticate, urlController.shortenUrl);

/**
 * @swagger
 * /api/url/my-urls:
 *   get:
 *     summary: Get all URLs for current user
 *     tags: [URL Shortener]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of URLs
 */
router.get("/my-urls", authenticate, urlController.getMyUrls);

/**
 * @swagger
 * /api/url/stats/{id}:
 *   get:
 *     summary: Get stats for a URL
 *     tags: [URL Shortener]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL stats
 */
router.get("/stats/:id", authenticate, urlController.getUrlStats);

/**
 * @swagger
 * /api/url/{id}:
 *   delete:
 *     summary: Delete a shortened URL
 *     tags: [URL Shortener]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL deleted successfully
 */
router.delete("/:id", authenticate, urlController.deleteUrl);

/**
 * @swagger
 * /api/url/{shortId}:
 *   get:
 *     summary: Redirect from short URL
 *     tags: [URL Shortener]
 *     parameters:
 *       - in: path
 *         name: shortId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to original URL
 */
router.get("/:shortId", urlController.redirectUrl);

export default router;
