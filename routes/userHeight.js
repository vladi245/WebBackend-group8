import userController from "../controllers/userController.js";
import express from "express";

export const userHeightRouter = express.Router();

// GET /users/:id/height - Get user's height
router.get('/:id/height', userController.getUserHeight);

// PATCH /users/:id/height - Update user's height
router.patch('/:id/height', userController.updateUserHeight);


export default userHeightRouter;