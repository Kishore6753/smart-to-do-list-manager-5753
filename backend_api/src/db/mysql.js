'use strict';

const mysql = require('mysql2/promise');

/**
 * MySQL connection pool module.
 * Uses environment variables configured by the database container:
 * - MYSQL_URL (optional, DSN), MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB, MYSQL_PORT
 * Connections are pooled for efficiency.
 */
const createPoolConfig = () => {
  // Prefer DSN if provided
  if (process.env.MYSQL_URL) {
    return process.env.MYSQL_URL;
  }
  return {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DB || 'mysql',
    waitForConnections: true,
    connectionLimit: Number(process.env.MYSQL_POOL_SIZE || 10),
    queueLimit: 0,
  };
};

let pool;

/**
 * Initialize a singleton MySQL pool
 */
function getPool() {
  if (!pool) {
    pool = mysql.createPool(createPoolConfig());
  }
  return pool;
}

// PUBLIC_INTERFACE
async function query(sql, params = []) {
  /** Execute a parameterized query using the pool. Returns rows and fields. */
  const [rows, fields] = await getPool().execute(sql, params);
  return { rows, fields };
}

// PUBLIC_INTERFACE
async function transaction(callback) {
  /** Execute a callback within a MySQL transaction. Commits on success, rolls back on error. */
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (err) {
    try { await conn.rollback(); } catch (e) {}
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = {
  getPool,
  query,
  transaction,
};
