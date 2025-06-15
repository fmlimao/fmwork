const express = require('express')
const router = express.Router()

router.get('/', require('./home-get'))

router.get('/my-account', require('./my-account-get'))
router.get('/users', require('./users-get'))
router.get('/profiles', require('./profiles-get'))

module.exports = router
