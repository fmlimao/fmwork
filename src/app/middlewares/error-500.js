module.exports = (error, req, res, next) => {
  // const ret = res.errorHandler(error, req.ret())
  // res.status(ret.getCode()).json(ret.generate())

  console.error('ERRO INTERNO NO SISTEMA:')
  console.error(error.message)

  // const route = req.route ? req.route.path : ''
  // if (route === '/avatar-upload') {
  //   return res.json({
  //     success: false,
  //     error: error.message,
  //     errorcode: 'relevant_error_code'
  //   })
  // }

  // if (req.cookies.login) {
  res.status(500).render('app/errors/error-500', {
    selectedProject: null
  })
  // } else {
  //   res.status(500).send(`APP: Erro Interno: ${error.message}`)
  // }
}
