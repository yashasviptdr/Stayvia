/**
 * Stayvia Database Configuration
 * 
 * Sets up a MySQL connection pool using mysql2/promise.
 * Designed safely:
 * - Does not crash the application if MySQL is not running or if credentials are placeholders.
 * - Allows the frontend and Express server to run smoothly in standalone / demo mode.
 * - Provides an explicit connection test function to check connectivity on demand.
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Track connectivity state safely
let pool = null;
let connectionState = {
  tested: false,
  connected: false,
  message: 'Database not initialized. Please verify your .env configuration.'
};

/**
 * Validates whether environment credentials are placeholders or actually configured.
 */
function isConfigured() {
  const pass = process.env.DB_PASSWORD || '';
  const isDefaultPlaceholder = pass === 'your_mysql_password_here' || pass === '';
  return !isDefaultPlaceholder;
}

/**
 * Initializes the MySQL connection pool.
 */
function getPool() {
  if (pool) {
    return pool;
  }

  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'stayvia_db';
  const connectionLimit = parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10);

  try {
    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
    return pool;
  } catch (err) {
    console.warn(`[Stayvia DB] Pool creation failed: ${err.message}`);
    return null;
  }
}

/**
 * Safely tests the MySQL connection.
 * Does not throw errors; returns status object.
 */
async function testConnection() {
  if (!isConfigured()) {
    connectionState = {
      tested: true,
      connected: false,
      message: 'Database credentials not yet configured. Server is running in demonstration mode.'
    };
    return connectionState;
  }

  try {
    const currentPool = getPool();
    if (!currentPool) {
      throw new Error('Could not initialize connection pool.');
    }
    const connection = await currentPool.getConnection();
    await connection.ping();
    connection.release();

    connectionState = {
      tested: true,
      connected: true,
      message: `Successfully connected to MySQL database: ${process.env.DB_NAME || 'stayvia_db'}`
    };
  } catch (error) {
    connectionState = {
      tested: true,
      connected: false,
      message: `MySQL unreachable (${error.code || error.message}). Running in standalone mode.`
    };
  }

  return connectionState;
}

/**
 * Returns current known database status for health checks.
 */
function getStatus() {
  return connectionState;
}

/**
 * Helper to execute queries safely with clear errors if disconnected.
 */
async function query(sql, params = []) {
  const currentPool = getPool();
  if (!currentPool || !connectionState.connected) {
    throw new Error('Database is not currently connected. Please configure your .env file and ensure MySQL is running.');
  }
  return await currentPool.query(sql, params);
}

module.exports = {
  getPool,
  testConnection,
  getStatus,
  query,
  isConfigured
};
