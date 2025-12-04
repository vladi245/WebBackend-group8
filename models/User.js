import pool from "../src/db.js";

export const UserModel = {
  getAll: async () => {
    const res = await pool.query("SELECT * FROM user_get()");
    return res.rows;
  },

  deleteById: async (id) => {
    await pool.query("SELECT * FROM user_delete($1)", [id]);
  },

  create: async ({ name, email, password_hash, type = 'standard', current_desk_id = null, standing_height = null, sitting_height = null, user_height = null }) => {
    const res = await pool.query(
      "SELECT * FROM user_create($1, $2, $3, $4, $5, $6, $7, $8)",
      [name, email, password_hash, type, current_desk_id, standing_height, sitting_height, user_height]
    );
    return res.rows[0];
  },

  findByEmail: async (email) => {
    const res = await pool.query("SELECT * FROM user_email($1)", [email]);
    return res.rows[0] || null;
  },

  getById: async (id) => {
    const res = await pool.query("SELECT * FROM user_id($1)", [id]);
    return res.rows[0] || null;
  }
  ,
  updateType: async (id, type) => {
    const res = await pool.query(
      "SELECT * FROM user_update($1, $2)",
      [id, type]
    );
    return res.rows[0] || null;
  },
  getUserHeight: async (id) => {
    const res = await pool.query(
      "SELECT * FROM user_getheight($1)",
      [id]
    );
    return res.rows[0] ? res.rows[0].user_height : null;
  }
  ,
  updateUserHeight: async (id, height) => {
    const res = await pool.query(
      "SELECT * FROM user_updateheight($1, $2)",
      [id, height]
    );
    return res.rows[0] || null;
  }
};