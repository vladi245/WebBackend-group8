const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../models/User');

// Route to return only the user's name
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

module.exports = router;
