import express from "express";
import { hydrationController } from "../controllers/hydrationController.js";

const router = express.Router();

// Get today's hydration data
router.get("/hydration", hydrationController.getToday);

// Add water to today's intake
router.post("/hydration/add", hydrationController.addWater);

// Remove water from today's intake
router.post("/hydration/remove", hydrationController.removeWater);

// Reset today's intake
router.post("/hydration/reset", hydrationController.resetToday);

// Update the daily goal
router.put("/hydration/goal", hydrationController.updateGoal);

// Get weekly stats
router.get("/hydration/weekly", hydrationController.getWeeklyStats);

export default router;
