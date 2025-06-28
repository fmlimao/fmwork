class Sql {
  constructor (connection) {
    this.connection = connection
  }

  getAll (query, args = [], trx = null) {
    const q = this.connection.raw(query, args)
    if (trx) q.transacting(trx)
    return q.then(data => data[0].map(row => {
      return JSON.parse(JSON.stringify(row))
    }))
  }

  getOne (query, args = [], trx = null) {
    return this.getAll(query, args, trx)
      .then(data => data[0] || false)
  }

  insert (query, args, trx = null) {
    const q = this.connection.raw(query, args)
    if (trx) q.transacting(trx)
    return q.then(data => data[0].insertId)
  }

  update (query, args, trx = null) {
    const q = this.connection.raw(query, args)
    if (trx) q.transacting(trx)
    return q.then(data => data[0].affectedRows)
  }

  delete (query, args, trx = null) {
    const q = this.connection.raw(query, args)
    if (trx) q.transacting(trx)
    return q.then(data => data[0].affectedRows)
  }

  uuid () {
    return this.getOne('SELECT uuid() AS id;', [])
      .then(data => data.id)
  }

  transaction (cb) {
    return this.connection.transaction(trx => {
      return cb(trx)
    })
  }

  getTransaction () {
    return this.connection.transaction()
  }

  disconnect () {
    this.connection.destroy()
    return true
  }
}

module.exports = Sql
