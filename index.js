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

app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Servidor rodando com sucesso!'
  })
})

// APP

app.get('/app', (req, res) => {
  res.redirect('/app/login')
})

app.get('/app/login', (req, res) => {
  res.render('app/auth/login', {
    layout: false
  })
})

app.get('/app/logout', (req, res) => {
  res.redirect('/app/login')
})

app.get('/app/forgot-password', (req, res) => {
  res.render('app/auth/forgot-password', {
    layout: false
  })
})

app.get('/app/project-select', (req, res) => {
  res.render('app/auth/project-select', {
    layout: false
  })
})

app.get('/app/:projectUuid', (req, res) => {
  const selectedProject = {
    uuid: '1dfb7cc4-7a73-4dec-a0ee-1f876d457a4d',
    name: 'Projeto Exemplo',
    description: 'Este é um projeto de exemplo para demonstração.',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  res.render('app/project/home', {
    page: 'home',
    selectedProject
  })
})

// SITE

app.get('/', (req, res) => {
  res.status(200).send('Site OK')
})

// Starting the server
app.listen(PORT, () => {
  console.log(`Servidor rodando no endereço ${HOST}`)
})
