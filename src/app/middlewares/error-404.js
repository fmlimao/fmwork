module.exports = (req, res, next) => {
  // const ret = req.ret()

  // ret.setError(true)
  // ret.setCode(404)
  // ret.addMessage(res.__('Rota não encontrada'))

  // res.status(ret.getCode()).json(ret.generate())

  // if (req.auth) {
  res.status(404).render('app/errors/error-404', {
    selectedProject: null
  })
  // } else {
  //   res.status(404).send('APP: Página não encontrada')
  // }
}
