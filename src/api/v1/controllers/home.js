const homeGet = (req, res) => {
  const ret = req.ret()

  ret.addMessage(res.__('Servidor rodando com sucesso!'))
  ret.addContent('timestamp', new Date().getTime())

  res.status(ret.code).json(ret.generate())
}

module.exports = {
  homeGet
}
