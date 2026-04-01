const { Pool } = require('pg');

function getDatabaseUrl() {
  return process.env.DATABASE_URL || '';
}

let pool = null;

function getPool() {
  if (!pool) {
    const connectionString = getDatabaseUrl();
    if (!connectionString) {
      throw new Error('DATABASE_URL is not configured.');
    }

    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('neon.tech')
        ? { rejectUnauthorized: false }
        : undefined
    });
  }

  return pool;
}

async function query(text, params = []) {
  return getPool().query(text, params);
}

async function withTransaction(callback) {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  getPool,
  query,
  withTransaction
};
