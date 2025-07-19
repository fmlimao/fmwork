const JsonResponse = require('../helpers/json-response')

module.exports = (err, req, res, next) => {
  if (err.name === 'SyntaxError') {
    const ret = new JsonResponse()

    ret.setError(true)
    ret.setCode(400)
    ret.addMessage('Um erro interno aconteceu. Verifique as variáveis enviadas.')

    return res.status(ret.getCode()).json(ret.generate())
    // throw new Error('Um erro interno aconteceu. Verifique as variáveis enviadas.')
  }
  next()
}
