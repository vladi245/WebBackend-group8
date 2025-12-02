const pool = require('../src/db.js');

async function getAllDesks() {
    const res = await pool.query('SELECT * FROM desk ORDER BY id ASC');
    return res.rows;
}

async function getDeskById(id) {
    const res = await pool.query('SELECT * FROM desk WHERE id = $1', [String(id)]);
    return res.rows[0] || null;
}

async function createDesk({ id, height }) {
    if (id === undefined || id === null) {
        const res = await pool.query('INSERT INTO desk (height) VALUES ($1) RETURNING *', [height]);
        return res.rows[0] || null;
    }

    const res = await pool.query('INSERT INTO desk (id, height) VALUES ($1, $2) RETURNING *', [String(id), height]);
    return res.rows[0] || null;
}

async function updateDeskHeight(id, height) {
    const res = await pool.query('UPDATE desk SET height = $2 WHERE id = $1 RETURNING *', [String(id), height]);
    return res.rows[0] || null;
}

module.exports = {
    getAllDesks,
    getDeskById,
    createDesk,
    updateDeskHeight,
};
