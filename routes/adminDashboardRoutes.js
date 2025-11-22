import express from "express";
const router = express.Router();

import { adminDashboardController } from "../controllers/adminDashboardController.js";
import authMiddleware from "../src/middleware/authMiddleware.js";


router.use(authMiddleware);
router.get("/stats", adminDashboardController.getStats);
router.get("/user-stats", adminDashboardController.getUserStats);
router.get("/calories-stats", adminDashboardController.getCaloriesStats);
router.get("/food-stats", adminDashboardController.getFoodStats);
router.get("/water-stats", adminDashboardController.getWaterStats);
router.get("/workout-stats", adminDashboardController.getWorkoutStats);
router.get("/standing-stats", adminDashboardController.getStandingStats);
router.get("/recent-activity", adminDashboardController.getRecentActivity);
router.get("/overview", adminDashboardController.getOverview);

export default router;