import pool from "../src/db.js";

export const UserModel = {
  getAll: async () => {
    const res = await pool.query("SELECT * FROM users ORDER BY id ASC");
    return res.rows;
  },

  deleteById: async (id) => {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
  },

  create: async ({ name, email, password_hash, type = 'standard', current_desk_id = null, standing_height = null, sitting_height = null }) => {
    const res = await pool.query(
      `INSERT INTO users (name, email, password_hash, type, current_desk_id, standing_height, sitting_height)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, type, current_desk_id, standing_height, sitting_height, created_at`,
      [name, email, password_hash, type, current_desk_id, standing_height, sitting_height]
    );
    return res.rows[0];
  },

  findByEmail: async (email) => {
    const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return res.rows[0] || null;
  },

  getById: async (id) => {
    const res = await pool.query("SELECT id, name, email, type, current_desk_id, standing_height, sitting_height, created_at FROM users WHERE id = $1", [id]);
    return res.rows[0] || null;
  }
};