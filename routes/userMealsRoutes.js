import express from "express";
import { userMealsController } from "../controllers/userMealsController.js";

const router = express.Router();

router.post("/meals", userMealsController.addMealEntry);
router.delete("/meals", userMealsController.removeMealEntry);
router.get("/meals/stats", userMealsController.getTodayStats);
router.get("/meals/entries", userMealsController.getMeals);

export default router;


