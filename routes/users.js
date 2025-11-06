const express = require('express');
const router = express.Router();

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

module.exports = router;
