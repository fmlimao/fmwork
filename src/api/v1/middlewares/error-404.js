module.exports = (req, res, next) => {
  const ret = req.ret()

  ret.setError(true)
  ret.setCode(404)
  ret.addMessage(res.__('Rota não encontrada'))

  res.status(ret.getCode()).json(ret.generate())
}
