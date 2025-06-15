const knex = require('knex')
const Sql = require('../helpers/sql')

const DB_HOST = process.env.DB_HOST || ''
const DB_PORT = process.env.DB_PORT || ''
const DB_NAME = process.env.DB_NAME || ''
const DB_USER = process.env.DB_USER || ''
const DB_PASS = process.env.DB_PASS || ''
// const DB_TIMEZONE = process.env.DB_TIMEZONE || ''

const connection = knex({
  client: 'mysql',
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASS,
    charset: 'utf8',
    dateStrings: true
  },
  pool: {
    // afterCreate: function (connection, callback) {
    //   connection.query(`SET time_zone = '${DB_TIMEZONE}';`, function (err) {
    //     callback(err, connection)
    //   })
    // }
  },
  useNullAsDefault: true
})

module.exports = new Sql(connection)
