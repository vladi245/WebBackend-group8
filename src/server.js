import express from 'express';
import cors from 'cors';
import usersRouter from '../routes/users.js';
import adminRoutes from "../routes/adminRoutes.js";
import workoutRoutes from "../routes/workout.js";

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes under /api
app.use('/api', usersRouter);
app.use("/admin", adminRoutes);
app.use("/workout", workoutRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
