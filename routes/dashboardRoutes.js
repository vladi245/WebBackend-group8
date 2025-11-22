import express from "express";
const router = express.Router();

import { dashboardController } from "../controllers/dashboardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

router.use(authMiddleware);
router.get("/user-stats", dashboardController.getUserStats);
router.get("/calories-stats", dashboardController.getCaloriesStats);
router.get("/food-stats", dashboardController.getFoodStats);
router.get("/water-stats", dashboardController.getWaterStats);
router.get("/workout-stats", dashboardController.getWorkoutStats);
router.get("/standing-stats", dashboardController.getStandingStats);
router.get("/friends-activity", dashboardController.getFriendsActivity);

export default router;