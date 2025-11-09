const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../models/User');

// Route: GET /
router.get('/', (req, res) => {
  res.json({
    user: {
      name: "John",
      email: "test@example.com",
    },
  });
});

// Route: GET /water
router.get('/water', (req, res) => {
  res.json({
    user: {
      water: 1.5,
    },
  });
});

// Route: GET /user
router.get('/user', (req, res) => {
  res.json({
    user: {
      name: "Washington",
    },
  });
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
