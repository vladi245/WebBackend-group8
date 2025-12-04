import express from "express";
const router = express.Router()
import authMiddleware from '../src/middleware/authMiddleware.js';

import { adminUsersController } from "../controllers/adminUsersController.js";
import { adminWorkoutsController } from "../controllers/adminWorkoutsController.js";
import { adminFoodsController } from "../controllers/adminFoodsController.js";

// USERS
router.get("/users", authMiddleware, adminUsersController.getAllUsers);
router.delete("/users/:id", authMiddleware, adminUsersController.deleteUser);
router.patch("/users/:id/type", authMiddleware, adminUsersController.changeUserType);

// WORKOUTS
router.get("/workouts", authMiddleware, adminWorkoutsController.getAllWorkouts);
router.post("/workouts", authMiddleware, adminWorkoutsController.createWorkout);
router.delete("/workouts/:id", authMiddleware, adminWorkoutsController.deleteWorkout);

// FOODS
router.get("/foods", authMiddleware, adminFoodsController.getAllFoods);
router.post("/foods", authMiddleware, adminFoodsController.createFood);
router.delete("/foods/:id", authMiddleware, adminFoodsController.deleteFood);

export default router;
