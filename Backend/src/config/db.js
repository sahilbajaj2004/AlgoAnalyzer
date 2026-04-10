const { Pool } = require('pg');
require('dotenv').config();

const ipv4Only = { family: 4 };

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ...ipv4Only,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  : new Pool({
      ...ipv4Only,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

pool.connect()
  .then(() => console.log("PostgreSQL connected successfully"))
  .catch((err) => console.error("DB connection error:", err.message));

module.exports = pool;