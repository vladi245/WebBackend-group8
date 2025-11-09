const express = require('express');
const router = express.Router();
const exampleUser = require('../models/User');

// Route to return only the user's name
router.get('/name', (req, res) => {
  res.json({ name: exampleUser.name });
});

router.get('/calorie-intake', (req, res) => {
  res.json({ name: exampleUser.calorieIntake });
});

router.get('/calorie-goal', (req, res) => {
  res.json({ name: exampleUser.caloreiGoal });
});

router.get('/water-card', (req, res) => {
  res.json({ name: exampleUser.water });
});

router.get('/water-card-goal', (req, res) => {
  res.json({ name: exampleUser.caloreiGoal });
});

router.get('/calories-burned', (req, res) => {
  res.json({ name: exampleUser.calories });
});

router.get('/standing-stats', (req, res) => {
  res.json({ name: exampleUser.standingStats });
});

router.get('/workout-card', (req, res) => {
  res.json({ name: exampleUser.workoutCard });
});

router.get('/friends-activtiy', (req, res) => {
  res.json({ name: exampleUser.friendsActivty });
});



module.exports = router;
