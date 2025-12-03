const pool = require("../src/db.js");

class ContactMessageModel {
    static async create({ name, email, message }) {
        const res = await pool.query(
            "SELECT * FROM contactmessage_create$1, $2, $3)",
            [name, email, message]
        );
        return res.rows[0] || null;
    }

    static async getAll() {
        const res = await pool.query(
            "SELECT * FROM contactmessage_list()",
        );
        return res.rows;
    }
}

module.exports = { ContactMessageModel };
