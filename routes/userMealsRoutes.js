import express from "express";
import { userMealsController } from "../controllers/userMealsController.js";
import authMiddleware from "../src/middleware/authMiddleware.js";

const router = express.Router();

router.post("/meals", authMiddleware, userMealsController.addMealEntry);
router.delete("/meals", authMiddleware,userMealsController.removeMealEntry);
router.get("/meals/stats", authMiddleware,userMealsController.getTodayStats);
router.get("/meals/weekly", authMiddleware,userMealsController.getWeeklyStats);
router.get("/meals/entries",authMiddleware, userMealsController.getMeals);
router.get("/foods",userMealsController.getFoods);

export default router;


