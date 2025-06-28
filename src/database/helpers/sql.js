const format = (sql, values) => {
  if (!values) return sql

  return sql.replace(/\?/g, (str, i) => {
    if (i >= values.length) return str
    const value = values[i]
    return escape(value)
  })
}

const escape = (value) => {
  if (value === null || value === undefined) {
    return 'NULL'
  }

  switch (typeof value) {
    case 'boolean':
      return value ? '1' : '0'
    case 'number':
      return value + ''
    case 'object':
      if (value instanceof Date) {
        return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`
      }
      if (Array.isArray(value)) {
        return `(${value.map(escape).join(',')})`
      }
      if (Buffer.isBuffer(value)) {
        return `X'${value.toString('hex')}'`
      }
      return escape(value.toString())
    default:
      value = value.replace(/[\0\n\r\b\t\\'"\x1a]/g, s => {
        switch (s) {
          case '\0': return '\\0'
          case '\n': return '\\n'
          case '\r': return '\\r'
          case '\b': return '\\b'
          case '\t': return '\\t'
          case '\x1a': return '\\Z'
          default: return '\\' + s
        }
      })
      return `'${value}'`
  }
}

module.exports = {
  format,
  escape
}
