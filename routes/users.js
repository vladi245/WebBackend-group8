const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../models/User');


router.get('/name', (req, res) => {
  res.json({ name: exampleUser.name });
});

router.get('/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

//update username
router.put('/users/:id/name', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const { UserModel } = require('../models/User');
    const user = await UserModel.updateName(id, name.trim());

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Name updated', user });
  } catch (err) {
    console.error('Error updating name:', err);
    res.status(500).json({ error: 'Database error while updating name' });
  }
});


module.exports = router;
