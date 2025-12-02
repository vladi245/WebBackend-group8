const pool = require("../src/db.js");

class ContactMessageModel {
    static async create({ name, email, message }) {
        const res = await pool.query(
            `INSERT INTO contact_messages (name, email, message)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [name, email, message]
        );
        return res.rows[0] || null;
    }

    static async getAll() {
        const res = await pool.query(
            `SELECT * FROM contact_messages ORDER BY created_at DESC`
        );
        return res.rows;
    }
}

module.exports = { ContactMessageModel };
