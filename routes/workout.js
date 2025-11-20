const express = require('express');
const router = express.Router();
const { getAllWorkouts } = require('../models/Workout');

router.get('/workouts', async (req, res) => {
    try {
        const workouts = await getAllWorkouts();
        res.json(workouts);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;