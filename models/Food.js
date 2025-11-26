import pool from "../src/db.js";

export const FoodModel = {
  getAll: async () => {
    const res = await pool.query("SELECT * FROM list_food()");
    return res.rows;
  },

  create: async ({ name, calories_intake }) => {
    const res = await pool.query(
      "SELECT * FROM create_food($1, $2)",
      [name, calories_intake]
    );
    return res.rows[0];
  },

  deleteById: async (id) => {
    await pool.query("SELECT delete_food($1)", [id]);
  }
};
