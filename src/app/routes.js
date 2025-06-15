const express = require('express')
const router = express.Router()

const getProjectMiddleware = require('./middlewares/get-project')

router.get('/', (req, res) => {
  res.redirect('/app/login')
})

router.get('/login', require('./controllers/auth/login-get'))

router.get('/logout', require('./controllers/auth/logout-get'))

router.get('/forgot-password', require('./controllers/auth/forgot-password-get'))

router.get('/project-select', require('./controllers/auth/project-select-get'))

router.use('/:projectUuid', getProjectMiddleware, require('./controllers/project/routes'))

module.exports = router
