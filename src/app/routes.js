const express = require('express')

const router = express.Router()

const getProjectMiddleware = require('./middlewares/get-project')
const configsMiddleware = require('./middlewares/configs')
const authMiddleware = require('./middlewares/auth')

const AuthController = require('./controllers/auth')

router.use(configsMiddleware)

// Autenticação
router.get('/login', AuthController.loginGet)
router.post('/login', AuthController.loginPost)
router.get('/logout', AuthController.logoutGet)
router.get('/forgot-password', AuthController.forgotPasswordGet)
router.get('/project-select', AuthController.projectSelectGet)

// Middleware de autenticação para todas as rotas abaixo
router.use(authMiddleware)

router.get('/', require('./controllers/home-get'))

// Rotas internas do projeto
router.get('/my-projects', require('./controllers/project/my-projects-get'))
router.use('/:projectUuid', getProjectMiddleware, require('./controllers/project/routes'))

// Erros
router.use(require('./middlewares/error-404'))
router.use(require('./middlewares/error-500'))

module.exports = router
