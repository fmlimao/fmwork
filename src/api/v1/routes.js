const express = require('express')
const router = express.Router()

const HomeController = require('./controllers/home')

router.get('/', HomeController.get)

// Erros
router.use(require('./middlewares/error-404'))
router.use(require('./middlewares/error-500'))

module.exports = router
