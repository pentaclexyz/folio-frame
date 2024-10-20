// db.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Pool } = require('pg');

// Configure the PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'railway',
    password: 'pop',
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
