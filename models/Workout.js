import pool from "../src/db.js";

export const WorkoutModel = {
  getAll: async () => {
    const res = await pool.query("SELECT * FROM workouts ORDER BY id ASC");
    return res.rows;
  },

  create: async ({ name, calories_burned, sets, reps, muscle_group }) => {
    const res = await pool.query(
      `INSERT INTO workouts (name, calories_burned, sets, reps, muscle_group)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, calories_burned, sets, reps, JSON.stringify(muscle_group)]
    );
    return res.rows[0];
  },

  deleteById: async (id) => {
    await pool.query("DELETE FROM workouts WHERE id = $1", [id]);
  }
};
