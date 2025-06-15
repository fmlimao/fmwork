const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Servidor rodando com sucesso!'
  })
})

module.exports = router
