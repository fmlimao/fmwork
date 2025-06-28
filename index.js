require('dotenv').config()

const DEBUG = !!Number(process.env.DEBUG || 1)
const PORT = process.env.PORT
const HOST = process.env.HOST

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const morgan = require('morgan')
const path = require('path')
const cookieParser = require('cookie-parser')

const app = express()

// Middlewares básicas
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, './public')))
app.use(cookieParser())

// Configuração do EJS
app.set('views', path.join(__dirname, './src/views'))
app.set('view engine', 'ejs')
app.set('layout', 'app/layout/index')
app.use(expressLayouts)

if (DEBUG) {
  app.use(morgan('dev'))
}

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
