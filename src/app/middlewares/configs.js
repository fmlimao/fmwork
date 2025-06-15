const moment = require('moment')
const p = require('../../../package.json')

module.exports = (req, res, next) => {
  res.locals.__ = req.__
  res.locals.version = p.version
  res.locals.assetsVersion = new Date().getTime()

  res.__ = str => str
  res.locals.pageTitle = process.env.APP_TITLE || 'App Title'
  res.locals.pageShortTitle = process.env.APP_SHORT_TITLE || 'AT'

  // Para o Menu
  res.locals.page = ''

  res.locals.activeMenu = (page, pages, className = 'active') => {
    if (typeof pages === 'string') {
      pages = [pages]
    }

    return pages.includes(page) ? className : ''
  }

  res.locals.toDateTime = (date) => {
    return moment(date).format('DD/MM/YYYY HH:mm:ss')
  }

  next()
}
