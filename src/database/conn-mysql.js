const mysql = require('mysql2/promise')
const sql = require('./helpers/sql')

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '8104',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'secret',
  database: process.env.DB_NAME || 'fmwork',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

const execute = async (query, params) => {
  const connection = await pool.getConnection()
  try {
    const [rows] = await connection.execute(query, params)
    return [rows]
  } finally {
    connection.release()
  }
}

const query = async (query, params) => {
  const connection = await pool.getConnection()
  try {
    const [rows] = await connection.query(query, params)
    return [rows]
  } finally {
    connection.release()
  }
}

const format = (query, params) => {
  return sql.format(query, params)
}

module.exports = {
  execute,
  query,
  format,
  pool
}
