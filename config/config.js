const { Pool } = require('pg');

const pool = new Pool({
  user: 'posgreadmin',
  host: 'serveurlogistrans.postgres.database.azure.com',
  database: 'postgres',
  password: 'Emilie1969',
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
