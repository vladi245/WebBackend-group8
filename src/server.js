import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import usersRouter from '../routes/users.js';
import adminRoutes from "../routes/adminRoutes.js";
import authRoutes from '../routes/auth.js';
import authMiddleware from './middleware/authMiddleware.js';
import adminDashboardRoutes from "../routes/adminDashboardRoutes.js";
import dashboardRoutes from "../routes/dashboardRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes under /api
app.use('/api', usersRouter);
app.use('/api/auth', authRoutes);

// Protect admin routes with JWT middleware
app.use('/admin', authMiddleware, adminRoutes);

app.use('/admin/dashboard', authMiddleware, adminDashboardRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
