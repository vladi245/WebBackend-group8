import express from 'express';
import { UserModel } from '../models/User.js';
const router = express.Router();

router.get('/name', (req, res) => {
  res.json({ name: exampleUser.name });
});

router.get('/users', async (req, res) => {
  try {
    const users = await UserModel.getAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
