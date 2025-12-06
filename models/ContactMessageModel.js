import pool from "../src/db.js";

export const ContactMessageModel = {
    create: async({name, email, message}) => {
        const res = await pool.query(
            "SELECT * FROM contactmessage_create($1, $2, $3)",
            [name, email, message]
        );
        return res.rows[0] || null;
    },

    getAll: async () => {
        const res = await pool.query(
            "SELECT * FROM contactmessage_list()"
        );
        return res.rows;
    }
};

