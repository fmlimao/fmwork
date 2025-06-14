console.clear()

require('dotenv').config()

const DEBUG = !!Number(process.env.DEBUG || 1)
const PORT = process.env.PORT
const HOST = process.env.HOST

const express = require('express')
const morgan = require('morgan')

const app = express()

// Middlewares básicas
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

if (DEBUG) {
  app.use(morgan('dev'))
}

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Servidor rodando com sucesso!'
  })
})

// Starting the server
app.listen(PORT, () => {
  console.log(`Servidor rodando no endereço ${HOST}`)
})
