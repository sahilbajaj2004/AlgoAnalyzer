const { Pool } = require('pg');
require('dotenv').config();

const ipv4Only = { family: 4 };

function getDbTargetInfo() {
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      return {
        mode: 'DATABASE_URL',
        user: url.username || 'missing',
        host: url.hostname,
        port: url.port || '5432',
      };
    } catch (err) {
      return {
        mode: 'DATABASE_URL_INVALID',
        user: 'invalid',
        host: 'invalid',
        port: 'invalid',
      };
    }
  }

  return {
    mode: 'DB_HOST',
    user: process.env.DB_USER || 'missing',
    host: process.env.DB_HOST || 'missing',
    port: process.env.DB_PORT || '5432',
  };
}

const dbTarget = getDbTargetInfo();
console.log(`[DB] mode=${dbTarget.mode} user=${dbTarget.user} target=${dbTarget.host}:${dbTarget.port}`);

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