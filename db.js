const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bridge',
  password: '2002',
  port: 5432, 
});


module.exports = pool;