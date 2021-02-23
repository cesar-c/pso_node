const {Pool} = require('pg');

const { PG_HOST,PG_USER,PG_DB,PG_PASS} = process.env;

const pool = new Pool({
    user: PG_USER,
    host: PG_HOST,
    database: PG_DB,
    password: PG_PASS
});

module.exports = pool;