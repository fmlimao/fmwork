const get = (req, res) => {
  res.status(200).json({
    message: 'Servidor rodando com sucesso!'
  })
}

module.exports = {
  get
}
