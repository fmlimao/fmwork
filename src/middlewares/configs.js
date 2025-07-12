const p = require('../../package.json')

module.exports = (req, res, next) => {
  res.locals.DEBUG = !!Number(process.env.DEBUG || 1)
  res.locals.HOST = process.env.HOST || 'http://localhost:16000'
  res.locals.PORT = process.env.PORT || 16000
  res.locals.APP_TITLE = process.env.APP_TITLE || 'APP_TITLE'
  res.locals.APP_SMALL_TITLE = process.env.APP_SMALL_TITLE || 'APP_SMALL_TITLE'
  res.locals.version = p.version

  // res.__ = str => str
  // res.locals.__ = req.__

  next()
}
