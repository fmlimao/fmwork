const JsonResponse = require('./json-response')

const DEBUG = Number(process.env.DEBUG)

const errorHandler = function (err, ret) {
  const res = this

  if (err instanceof JsonResponse) {
    return err
  }

  if (process.env && DEBUG && DEBUG === 1) {
    console.error(`[API ERRO INTERNO]: ${err}`)
  }

  if (ret.getCode() === 200) {
    ret = new JsonResponse()

    ret.setError(true)
    ret.setCode(500)
    ret.addMessage(res.__('Erro interno. Por favor, tente novamente.'))

    if (process.env && DEBUG && DEBUG === 1) ret.addMessage(err.message)
  } else {
    ret.setError(true)
    if (err.message) {
      ret.addMessage(err.message)
    }
  }

  return ret
}

module.exports = errorHandler
