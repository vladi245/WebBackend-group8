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

router.put('/users/:id/name', async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { name } = req.body;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const updatedUser = await UserModel.updateName(userId, name.trim());

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('Failed to update user name:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
