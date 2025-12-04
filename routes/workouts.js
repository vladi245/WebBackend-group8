import express from 'express';
import authMiddleware from '../src/middleware/authMiddleware.js';
import { workoutsController } from '../controllers/workoutsController.js';

const router = express.Router();

// Protected endpoints for user's workout records and stats
router.post('/', authMiddleware, workoutsController.addCompletedWorkout);
router.get('/', authMiddleware, workoutsController.getUserWorkouts);
router.get('/all', authMiddleware, workoutsController.getAllWorkouts);
router.get('/stats', authMiddleware, workoutsController.getUserStats);
router.delete('/:id', authMiddleware, workoutsController.deleteRecord);

export default router;
