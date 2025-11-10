const pool = require('../src/db');

const user = {
  id: 1,
  name: "Washington",
  email: "washington@example.com",
  calorieIntake: 1331,
  caloreiGoal: 2500,
  waterIntake: 1.2,
  water: 3,
  calories: 1560,
  standingStats: [
    { day: 'Mon', minutes: 120 },
    { day: 'Tue', minutes: 150 },
    { day: 'Wed', minutes: 90 },
    { day: 'Thu', minutes: 180 },
    { day: 'Fri', minutes: 160 },
    { day: 'Sat', minutes: 1040 },
    { day: 'Sun', minutes: 200 }
  ],
  workoutCard:[
    { day: 'Mon', minutes: 30 },
    { day: 'Tue', minutes: 45 },
    { day: 'Wed', minutes: 20 },
    { day: 'Thu', minutes: 60 },
    { day: 'Fri', minutes: 50 },
    { day: 'Sat', minutes: 40 },
    { day: 'Sun', minutes: 70 },
  ],
  friendsActivty:[
    {
        id: 1,
        username: 'washington',
        action: 'added a new activity',
        timeAgo: '10m ago',
    },
    {
        id: 2,
        username: 'gmail',
        action: 'reached the goal',
        timeAgo: '17m ago',
    },
  ]

};

const getAllUsers = async () => {
  const res = await pool.query('SELECT * FROM users');
  return res.rows;
};

module.exports = { getAllUsers, user };