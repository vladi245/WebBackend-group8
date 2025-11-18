import pool from "../src/db.js";

export const UserModel = {
  getAll: async () => {
    const res = await pool.query("SELECT * FROM users ORDER BY id ASC");
    return res.rows;
  },

  deleteById: async (id) => {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
  }
};