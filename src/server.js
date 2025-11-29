import express from "express";
import cors from "cors";
import usersRouter from "../routes/users.js";
import 'dotenv/config';



import adminRoutes from "../routes/adminRoutes.js";
import userMealsRoutes from "../routes/userMealsRoutes.js";
import authRoutes from '../routes/auth.js';
import authMiddleware from './middleware/authMiddleware.js';
import workoutsRoutes from '../routes/workouts.js';
import exercisesRoutes from '../routes/exercises.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", usersRouter);
app.use("/api", userMealsRoutes);
app.use("/admin", adminRoutes);


app.use('/api/auth', authRoutes);

// Workouts endpoints (protected)
app.use('/api/workouts', workoutsRoutes);

// Exercises list (public)
app.use('/api/exercises', exercisesRoutes);

// Protect admin routes with JWT middleware
app.use('/admin', authMiddleware, adminRoutes);


//test endpoint for PICO
app.get("/test", (req, res) => {
  res.status(200).json({ message: "Connection established" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

