const home = (req, res) => {
  const ret = req.ret()

  ret.addMessage('Servidor rodando com sucesso!')
  ret.addContent('timestamp', new Date().getTime())

  res.status(ret.code).json(ret.generate())
}

module.exports = {
  home
}
