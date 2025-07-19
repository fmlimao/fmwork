const express = require('express')

const router = express.Router()

// const getProjectMiddleware = require('./middlewares/get-project')
const ConfigsMiddleware = require('./middlewares/configs')

// const AuthController = require('./controllers/auth')

router.use(ConfigsMiddleware)

router.get('/', require('./controllers/home-get'))

// Inquilinos
router.get('/tenants', require('./controllers/tenants/list'))
router.get('/tenants/create', require('./controllers/tenants/create'))
router.get('/tenants/:tenantUuid', require('./controllers/tenants/update'))

// Papéis
router.get('/tenants/:tenantUuid/roles/create', require('./controllers/roles/create'))

// // Autenticação
// router.get('/login', AuthController.loginGet)
// router.get('/logout', AuthController.logoutGet)
// router.get('/forgot-password', AuthController.forgotPasswordGet)
// router.get('/project-select', AuthController.projectSelectGet)

// // Rotas internas do projeto
// router.get('/my-projects', require('./controllers/project/my-projects-get'))
// router.use('/:projectUuid', getProjectMiddleware, require('./controllers/project/routes'))

// // Erros
router.use(require('./middlewares/error-404'))
// router.use(require('./middlewares/error-500'))

module.exports = router
