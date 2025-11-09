const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'fitness_user',
  password: 'fitness_pass',
  database: 'fitness_db',
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

module.exports = pool;
