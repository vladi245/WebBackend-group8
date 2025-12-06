import express from "express";
import { hydrationController } from "../controllers/hydrationController.js";
import authMiddleware from "../src/middleware/authMiddleware.js";

const router = express.Router();

// Get today's hydration data
router.get("/hydration", authMiddleware , hydrationController.getToday);

// Add water to today's intake
router.post("/hydration/add", authMiddleware, hydrationController.addWater);

// Remove water from today's intake
router.post("/hydration/remove", authMiddleware, hydrationController.removeWater);

// Reset today's intake
router.post("/hydration/reset", authMiddleware, hydrationController.resetToday);

// Update the daily goal
router.put("/hydration/goal", authMiddleware, hydrationController.updateGoal);

// Get weekly stats
router.get("/hydration/weekly", authMiddleware, hydrationController.getWeeklyStats);

export default router;
