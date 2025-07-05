const JsonReturn = require('../helpers/json-response')
const validator = require('./validator')

function sanitizeArrayFilter (filter, options = {}) {
  filter = String(filter || '')

  const helpers = options.helpers || []
  const list = options.list || []

  filter = filter
    .split(',')
    .map(item => {
      item = item.trim()

      for (const helper of helpers) item = helper(item)

      return item
    })
    .filter(item => item !== null && item !== '')

  if (list.length) filter = filter.filter(item => list.includes(item))

  return filter
}

function orderByColumn (column = null, columns = {}, defaultColumn) {
  if (typeof columns === 'object') {
    if (Array.isArray(columns)) {
      if (columns.includes(column)) {
        return column
      }
    } else {
      if (typeof columns[column] !== 'undefined') {
        return columns[column]
      }
    }
  }

  return defaultColumn
}

function orderByDir (dir = null) {
  if (dir) {
    if (![
      'ASC',
      'DESC'
    ].includes(dir.toUpperCase())) {
      dir = 'ASC'
    }
  } else {
    dir = 'ASC'
  }

  return dir
}

function replaceColumnsName (data, filters) {
  return data.map(item => {
    const newItem = {}

    for (const i in item) {
      if (typeof filters.viewColumns[i] !== 'undefined') {
        newItem[filters.viewColumns[i]] = item[i]
        // newItem = makeObj(newItem, filters.viewColumns[i], item[i])
      }
    }

    return newItem
  })
}

function formatList (next, filters, options = {}) {
  const { start, length } = next.queryOptions
  const pages = Math.ceil(next.filteredCount / length)
  const currentPage = start / length + 1

  const columns = {}
  for (const i in filters.orderColumns) {
    columns[filters.orderColumns[i]] = i
  }

  const ret = new JsonReturn()

  const meta = {
    totalCount: next.totalCount,
    filteredCount: next.filteredCount,
    start,
    length,
    pages,
    currentPage,
    orderBy: {
      column: Array.isArray(filters.orderColumns) ? next.queryOptions.orderByColumn : columns[next.queryOptions.orderByColumn],
      dir: next.queryOptions.orderByDir
    }
  }

  if (Array.isArray(options.jsonObjAgg)) {
    for (const jsonObjAggItem of options.jsonObjAgg) {
      if (jsonObjAggItem) {
        next.data = next.data.map(dataItem => {
          dataItem[jsonObjAggItem] = JSON.parse(dataItem[jsonObjAggItem] || '{}')
          return dataItem
        })
      }
    }
  }

  if (Array.isArray(options.jsonArrayAgg)) {
    for (let jsonArrayAggItem of options.jsonArrayAgg) {
      if (typeof jsonArrayAggItem !== 'object') jsonArrayAggItem = {}
      if (typeof jsonArrayAggItem.queryField !== 'string') jsonArrayAggItem.queryField = null
      if (typeof jsonArrayAggItem.idField !== 'string') jsonArrayAggItem.idField = null

      if (jsonArrayAggItem.queryField) {
        next.data = next.data.map(dataItem => {
          dataItem[jsonArrayAggItem.queryField] = JSON.parse(dataItem[jsonArrayAggItem.queryField] || '[]')

          if (jsonArrayAggItem.idField && Array.isArray(dataItem[jsonArrayAggItem.queryField])) {
            dataItem[jsonArrayAggItem.queryField] = dataItem[jsonArrayAggItem.queryField].filter(item => item[jsonArrayAggItem.idField] !== null)
          }

          return dataItem
        })
      }
    }
  }

  ret.addContent('meta', meta)
  ret.addContent('data', next.data)

  return ret
}

function formatData (data, options = {}) {
  if (!data) {
    return null
  }

  if (Array.isArray(options.jsonObjAgg)) {
    for (const jsonObjAggItem of options.jsonObjAgg) {
      if (jsonObjAggItem) {
        data[jsonObjAggItem] = JSON.parse(data[jsonObjAggItem] || '{}')
      }
    }
  }

  if (Array.isArray(options.jsonArrayAgg)) {
    for (let jsonArrayAggItem of options.jsonArrayAgg) {
      if (typeof jsonArrayAggItem !== 'object') jsonArrayAggItem = {}
      if (typeof jsonArrayAggItem.queryField !== 'string') jsonArrayAggItem.queryField = null
      if (typeof jsonArrayAggItem.idField !== 'string') jsonArrayAggItem.idField = null

      if (jsonArrayAggItem.queryField) {
        data[jsonArrayAggItem.queryField] = JSON.parse(data[jsonArrayAggItem.queryField] || '[]')

        if (jsonArrayAggItem.idField && Array.isArray(data[jsonArrayAggItem.queryField])) {
          data[jsonArrayAggItem.queryField] = data[jsonArrayAggItem.queryField].filter(item => item[jsonArrayAggItem.idField] !== null)
        }
      }
    }
  }

  return data
}

function uuidFilter (
  args,
  criterias,
  values,
  field,
  queryString
) {
  if (args.filter[field] !== undefined) {
    const ids = sanitizeArrayFilter(args.filter[field], {
      helpers: [item => {
        item = String(item).trim()

        if (!validator(args.res, args.ret, {
          [field]: item
        }, {
          [field]: 'required|uuid'
        })) {
          args.ret.setError(true)
          args.ret.setCode(400)
          args.ret.addMessage(args.res.__('Verifique todos os campos.'))
          throw args.ret
        }

        return item
      }]
    })

    if (ids.length) {
      criterias.push(queryString)
      values[field] = ids
    }
  }
}

function stringFilter (
  args,
  criterias,
  values,
  field,
  queryString
) {
  if (args.filter[field] !== undefined) {
    criterias.push(queryString)
    values[field] = `%${args.filter[field]}%`
  }
}

function activeFilter (
  args,
  criterias,
  values,
  field,
  queryString
) {
  if (args.filter[field] !== undefined) {
    const ids = sanitizeArrayFilter(args.filter[field], {
      helpers: [item => {
        item = Number(item)

        if (!validator(args.res, args.ret, {
          [field]: item
        }, {
          [field]: 'required|integer|between:0,1'
        })) {
          args.ret.setError(true)
          args.ret.setCode(400)
          args.ret.addMessage(args.res.__('Verifique todos os campos.'))
          throw args.ret
        }

        return item
      }]
    })

    if (ids.length) {
      criterias.push(queryString)
      values[field] = ids
    }
  }
}

function dateFilter (
  args,
  criterias,
  values,
  field,
  queryString
) {
  if (args.filter[field] !== undefined) {
    if (!validator(args.res, args.ret, {
      privilegeCreatedAtInitial: args.filter[field]
    }, {
      privilegeCreatedAtInitial: 'required|dateformat'
    })) {
      args.ret.setError(true)
      args.ret.setCode(400)
      args.ret.addMessage(args.res.__('Verifique todos os campos.'))
      throw args.ret
    }

    if (isNaN((new Date(args.filter[field])).getTime())) {
      args.ret.setError(true)
      args.ret.setCode(400)
      args.ret.addMessage(args.res.__('Verifique todos os campos.'))

      args.ret.setFieldError(field, true)
      args.ret.addFieldMessage(field, args.res.__('Data inválida.'))
      throw args.ret
    }

    criterias.push(queryString)
    values[field] = args.filter[field]
  }
}

module.exports = {
  sanitizeArrayFilter,
  orderByColumn,
  orderByDir,
  replaceColumnsName,
  formatList,
  formatData,
  uuidFilter,
  stringFilter,
  activeFilter,
  dateFilter
}
