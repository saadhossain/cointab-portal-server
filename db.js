const { Pool } = require('pg')
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    database: 'cointabusers',
    password: 'SaadHossainDev',
})


module.exports = pool