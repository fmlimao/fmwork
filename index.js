console.clear()

require('dotenv').config()

const DEBUG = !!Number(process.env.DEBUG || 1)
const PORT = process.env.PORT
const HOST = process.env.HOST

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const moment = require('moment')
const morgan = require('morgan')
const path = require('path')
const p = require('./package.json')

const app = express()

// Middlewares básicas
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, './public')))

// Configuração do EJS
app.set('views', path.join(__dirname, './src/views'))
app.set('view engine', 'ejs')
app.set('layout', 'app/layout/index')
app.use(expressLayouts)

if (DEBUG) {
  app.use(morgan('dev'))
}

app.use((req, res, next) => {
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
})

// API
app.get('/api', require('./src/api/routes'))

// APP
app.use('/app', require('./src/app/routes'))

// SITE
app.get('/', require('./src/site/routes'))

// Starting the server
app.listen(PORT, () => {
  console.log(`Servidor rodando no endereço ${HOST}`)
})
