const express = require('express');
const router = express.Router();
const { getAllUsers, UserModel } = require('../models/User');

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


router.delete('/users/id', async (req, res) => {
  try {
    const userId = req.params.id;
    await UserModel.deleteById(userId);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Couldn't delete user" });
  }
});

module.exports = router;

