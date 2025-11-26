import pool from "../src/db.js";

export const FoodModel = {
  getAll: async () => {
    const res = await pool.query("SELECT * FROM list_foods()");
    return res.rows;
  },

  create: async ({ name, calories_intake }) => {
    const res = await pool.query(
      "SELECT * FROM food_create($1, $2)",
      [name, calories_intake]
    );
    return res.rows[0];
  },

  deleteById: async (id) => {
    await pool.query("SELECT food_delete($1)", [id]);
  }
};
