const express = require('express')
const router = express.Router()

const HomeController = require('./controllers/home')
const AuthController = require('./controllers/auth')
const TenantController = require('./controllers/tenant')

const AuthVerifyMiddleware = require('./middlewares/auth-verify')
// const getUserMiddleware = require('../../../middlewares/get-user')

// Home
router.get('/', HomeController.homeGet)

// Autenticação
router.post('/auth', AuthController.loginPost)

// Verificação de autenticação
router.use(AuthVerifyMiddleware)

router.get('/auth/me', AuthController.meGet)

// Inquilinos
router.get('/tenants', TenantController.listGet)

// Erros
router.use(require('./middlewares/error-404'))
router.use(require('./middlewares/error-500'))

module.exports = router
