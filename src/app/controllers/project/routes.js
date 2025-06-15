const express = require('express')
const router = express.Router()

router.get('/', require('./home-get'))

router.get('/my-account', require('./my-account-get'))

module.exports = router
