const pool = require('../src/db.js');

async function getAllDesks() {
    const res = await pool.query(
        "SELECT * FROM desk_list()",
    );
    return res.rows;
}

async function getDeskById(id) {
    const res = await pool.query(
        "SELECT * FROM desk_get($1)",
        [String(id)]);
    return res.rows[0] || null;
}

async function createDesk({ id, height }) {
    const res = await pool.query(
        "SELECT * FROM insert_desk_with_id($1, $2)",
        [String(id), height]);
    return res.rows[0] || null;
}

async function updateDeskHeight(id, height) {
    const res = await pool.query(
        "SELECT * FROM desk_update($1, $2)",
        [String(id), height]);
    return res.rows[0] || null;
}

module.exports = {
    getAllDesks,
    getDeskById,
    createDesk,
    updateDeskHeight,
};
