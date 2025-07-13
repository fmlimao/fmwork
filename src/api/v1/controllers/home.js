const homeGet = (req, res) => {
  const ret = req.ret()

  ret.addMessage(res.__('api.home.Servidor rodando com sucesso!'))
  ret.addContent('timestamp', new Date().getTime())

  res.status(ret.code).json(ret.generate())
}

module.exports = {
  homeGet
}
