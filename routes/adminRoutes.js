import express from "express";
const router = express.Router();

import { adminUsersController } from "../controllers/adminUsersController.js";
import { adminWorkoutsController } from "../controllers/adminWorkoutsController.js";
import { adminFoodsController } from "../controllers/adminFoodsController.js";

// USERS
router.get("/users", adminUsersController.getAllUsers);
router.delete("/users/:id", adminUsersController.deleteUser);

// WORKOUTS
router.get("/workouts", adminWorkoutsController.getAllWorkouts);
router.post("/workouts", adminWorkoutsController.createWorkout);
router.delete("/workouts/:id", adminWorkoutsController.deleteWorkout);

// FOODS
router.get("/foods", adminFoodsController.getAllFoods);
router.post("/foods", adminFoodsController.createFood);
router.delete("/foods/:id", adminFoodsController.deleteFood);

export default router;
