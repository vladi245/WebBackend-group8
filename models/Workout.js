import pool from "../src/db.js";

export const WorkoutModel = {
  getAll: async () => {
    const res = await pool.query("SELECT * FROM workout_list()");
    return res.rows;
  },

  create: async ({ name, calories_burned, sets, reps, muscle_group }) => {
    const res = await pool.query(
      "SELECT * FROM workout_create($1, $2, $3, $4, $5)",
      [name, calories_burned, sets, reps, JSON.stringify(muscle_group)]
    );
    return res.rows[0];
  },

  deleteById: async (id) => {
    await pool.query("SELECT * FROM workout_delete($1)", [id]);
  }
};
