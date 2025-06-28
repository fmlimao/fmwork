const express = require('express')
const router = express.Router()

const HomeController = require('./controllers/home')
const AuthController = require('./controllers/auth')

router.get('/', HomeController.get)
router.post('/auth', AuthController.post)

// Erros
router.use(require('./middlewares/error-404'))
router.use(require('./middlewares/error-500'))

module.exports = router
