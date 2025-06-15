const express = require('express')
const router = express.Router()

router.get('/', require('./home-get'))

router.get('/projects', require('./projects-get'))

module.exports = router
