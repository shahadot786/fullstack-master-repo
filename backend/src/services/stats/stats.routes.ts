import { Router } from "express";
import * as statsController from "./stats.controller";
import { authenticate } from "@middleware/auth.middleware";

const router = Router();

/**
 * @route   GET /stats
 * @desc    Get comprehensive stats for all services
 * @access  Private
 */
router.get("/", authenticate, statsController.getStats);

export default router;
