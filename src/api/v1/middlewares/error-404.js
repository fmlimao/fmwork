module.exports = (req, res, next) => {
  const ret = req.ret()

  ret.setError(true)
  ret.setCode(404)
  ret.addMessage(res.__('api.error.Rota não encontrada'))

  return res.status(ret.getCode()).json(ret.generate())
}
