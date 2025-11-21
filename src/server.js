import express from "express";
import cors from "cors";
import usersRouter from "../routes/users.js";
import 'dotenv/config';



import adminRoutes from "../routes/adminRoutes.js";
import userMealsRoutes from "../routes/userMealsRoutes.js";
import authRoutes from '../routes/auth.js';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", usersRouter);
app.use("/api", userMealsRoutes);
app.use("/admin", adminRoutes);


app.use('/api/auth', authRoutes);

// Protect admin routes with JWT middleware
app.use('/admin', authMiddleware, adminRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

