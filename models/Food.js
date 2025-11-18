import pool from "../src/db.js";

export const FoodModel = {
  getAll: async () => {
    const res = await pool.query("SELECT * FROM foods ORDER BY id ASC");
    return res.rows;
  },

  create: async ({ name, calories_intake }) => {
    const res = await pool.query(
      `INSERT INTO foods (name, calories_intake)
       VALUES ($1, $2)
       RETURNING *`,
      [name, calories_intake]
    );
    return res.rows[0];
  },

  deleteById: async (id) => {
    await pool.query("DELETE FROM foods WHERE id = $1", [id]);
  }
};
