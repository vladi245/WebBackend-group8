import pool from '../src/db.js';


export const DeskModel = {
    getAllDesks: async () => {
        const res = await pool.query(
            "SELECT * FROM desk_list()"
        );
        return res.rows;
    },

    getDeskById: async (id) => {
        const res = await pool.query(
            "SELECT * FROM desk_get($1)",
            [String(id)]
        );
        return res.rows[0] || null;
    },

    createDesk: async ({ id, height }) => {
        const res = await pool.query(
            "SELECT * FROM desk_create($1, $2)",
            [String(id), height]
        );
        return res.rows[0] || null;
    },

    updateDeskHeight: async (id, height) => {
        const res = await pool.query(
            "SELECT * FROM desk_update($1, $2)",
            [String(id), height]
        );
        return res.rows[0] || null;
    }
};


