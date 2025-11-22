import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import usersRouter from '../routes/users.js';
import adminRoutes from "../routes/adminRoutes.js";
import authRoutes from '../routes/auth.js';
import authMiddleware from './middleware/authMiddleware.js';
import workoutsRoutes from '../routes/workouts.js';
import exercisesRoutes from '../routes/exercises.js';

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes under /api
app.use('/api', usersRouter);
app.use('/api/auth', authRoutes);

// Workouts endpoints (protected)
app.use('/api/workouts', workoutsRoutes);

// Exercises list (public)
app.use('/api/exercises', exercisesRoutes);

// Protect admin routes with JWT middleware
app.use('/admin', authMiddleware, adminRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
