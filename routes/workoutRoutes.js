import express from "express";
import { userWorkoutController } from "../controllers/userWorkoutController.js";

const router = express.Router();

router.post("/workout", userWorkoutController.addWorkoutEntry);
router.delete("/workout", userWorkoutController.removeWorkoutEntry);
router.get("/workout/stats/today", userWorkoutController.getTodayStats);
router.get("/workouts", userWorkoutController.getWorkouts);
router.get("/workout/stats/week", userWorkoutController.getWeeklyStats);

export default router;