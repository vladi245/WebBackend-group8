import pool from '../src/db.js';

export async function getAllDesks() {
    const res = await pool.query(
        "SELECT * FROM desk_list()",
    );
    return res.rows;
}

export async function getDeskById(id) {
    const res = await pool.query(
        "SELECT * FROM desk_get($1)",
        [String(id)]);
    return res.rows[0] || null;
}

export async function createDesk({ id, height }) {
    const res = await pool.query(
        "SELECT * FROM desk_create($1, $2)",
        [String(id), height]);
    return res.rows[0] || null;
}

export async function updateDeskHeight(id, height) {
    const res = await pool.query(
        "SELECT * FROM desk_update($1, $2)",
        [String(id), height]);
    return res.rows[0] || null;
}


