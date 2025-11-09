const pool = require('../src/db');

const user = {
  id: 1,
  name: "Washington",
  email: "washington@example.com",
  calorieIntake: 1.5,
  caloreiGoal: 28,
  waterIntake: 1.2,
};

const getAllUsers = async () => {
  const res = await pool.query('SELECT * FROM users');
  return res.rows;
};

module.exports = { getAllUsers, user };