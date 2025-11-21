import express from 'express';
const router = express.Router();

import { authController } from '../controllers/authController.js';
import authMiddleware from '../src/middleware/authMiddleware.js';

// POST /auth/register
router.post('/register', authController.register);

// POST /auth/login
router.post('/login', authController.login);

// GET /auth/me
router.get('/me', authMiddleware, authController.me);

export default router;
