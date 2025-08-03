console.clear()

require('dotenv').config()

const DEBUG = !!Number(process.env.DEBUG || 1)
const PORT = process.env.PORT
const HOST = process.env.HOST

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const morgan = require('morgan')
const path = require('path')
const swaggerUi = require('swagger-ui-express')
const swaggerSpecs = require('./src/api/v1/swagger')
// const { I18n } = require('i18n')

const app = express()

// const i18n = new I18n({
//   locales: ['en', 'pt-BR'],
//   defaultLocale: 'pt-BR',
//   directory: path.join(__dirname, './src/locales')
// })

// app.use(i18n.init)

app.use(require('./src/middlewares/configs'))

// Middlewares básicas
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, './public')))

// Configuração do EJS
app.set('views', path.join(__dirname, './src/views'))
app.set('view engine', 'ejs')
app.set('layout', 'app/layout/index')
app.use(expressLayouts)

app.use(require('./src/middlewares/json-response'))
app.use(require('./src/middlewares/sintaxe-error'))

if (DEBUG) {
  app.use(morgan('dev'))
}

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

// API
app.use('/api/v1', require('./src/api/v1/routes'))

// APP
app.use('/app', require('./src/app/routes'))

// SITE
// app.get('/', require('./src/site/routes'))

// Starting the server
app.listen(PORT, () => {
  console.log(`Servidor rodando no endereço ${HOST}`)
})
