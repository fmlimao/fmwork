const express = require('express')
const router = express.Router()

const HomeController = require('./controllers/home')
const AuthController = require('./controllers/auth')

const AuthVerifyMiddleware = require('./middlewares/auth-verify')
// const getUserMiddleware = require('../../../middlewares/get-user')

// Home
router.get('/', HomeController.get)

// Autenticação
router.post('/auth', AuthController.post)

// Verificação de autenticação
router.use(AuthVerifyMiddleware)

// router.get('/auth/me', require('./auth/me'))

// Erros
router.use(require('./middlewares/error-404'))
router.use(require('./middlewares/error-500'))

module.exports = router
