import express from 'express';
import { UserModel } from '../models/User.js';
import authMiddleware from '../src/middleware/authMiddleware.js';
const router = express.Router();

router.get('/name', (req, res) => {
  res.json({ name: exampleUser.name });
});

router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await UserModel.getAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/users/:id/name', authMiddleware, async (req, res) => {
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

router.get('/users/:id/height', authMiddleware, async (req, res) => {
  try {

    const userId = req.params.id;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const userHeight = await UserModel.getUserHeight(parseInt(userId));

    res.json({ user_height: userHeight });
  } catch (err) {
    console.error('Error fetching user height:', err);
    res.status(500).json({ error: 'Database error' });
  }

});

router.put('/users/:id/heightsave', authMiddleware, async (req, res) => {
  try {

    const userId = req.params.id;
    const { height } = req.body;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    if (height === undefined || height === null || isNaN(height)) {
      return res.status(400).json({ error: 'Height is required and must be a number' });
    }

    const heightNum = parseInt(height);
    if (heightNum < 100 || heightNum > 250) {
      return res.status(400).json({ error: 'Height must be between 100 and 250 cm' });
    }

    const updatedUser = await UserModel.updateUserHeight(parseInt(userId), heightNum);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user_height: updatedUser.user_height });
  } catch (err) {
    console.error('Error updating user height:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
