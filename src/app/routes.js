const express = require('express')

const router = express.Router()

const getProjectMiddleware = require('./middlewares/get-project')
const configsMiddleware = require('./middlewares/configs')

const AuthController = require('./controllers/auth')

router.use(configsMiddleware)

router.get('/', require('./controllers/home-get'))

// Autenticação
router.get('/login', AuthController.loginGet)
router.get('/logout', AuthController.logoutGet)
router.get('/forgot-password', AuthController.forgotPasswordGet)
router.get('/project-select', AuthController.projectSelectGet)

// Rotas internas do projeto
router.use('/:projectUuid', getProjectMiddleware, require('./controllers/project/routes'))

module.exports = router
