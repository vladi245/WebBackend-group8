import express from 'express';
import { WorkoutModel } from '../models/Workout.js';

const router = express.Router();

// Public endpoint to get available exercises/workouts
router.get('/', async (req, res) => {
    try {
        const workouts = await WorkoutModel.getAll();
        // ensure muscle_group parsed to array if stored as JSON string
        const normalized = workouts.map(w => ({
            id: w.id,
            name: w.name,
            calories_burned: w.calories_burned,
            sets: w.sets,
            reps: w.reps,
            muscle_group: Array.isArray(w.muscle_group) ? w.muscle_group : (w.muscle_group ? JSON.parse(w.muscle_group) : [])
        }));
        res.json(normalized);
    } catch (err) {
        console.error('Error fetching exercises:', err);
        res.status(500).json({ error: 'Database error while fetching exercises' });
    }
});

export default router;
