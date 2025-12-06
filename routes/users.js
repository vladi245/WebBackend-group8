import express from "express";
import authMiddleware from "../src/middleware/authMiddleware.js";
import { userController } from "../controllers/userController.js";

const router = express.Router();

router.get("/users", authMiddleware, userController.getAll);
router.put("/users/:id/name", authMiddleware, userController.updateName);
router.get("/users/:id/height", authMiddleware, userController.getUserHeight);
router.put("/users/:id/heightsave", authMiddleware, userController.updateUserHeight);

export default router;
