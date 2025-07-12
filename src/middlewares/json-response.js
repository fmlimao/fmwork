const JsonResponse = require('../helpers/json-response')
const errorHandler = require('../helpers/error-handler')

module.exports = (req, res, next) => {
  req.ret = () => {
    return new JsonResponse()
  }

  res.errorHandler = errorHandler

  res.error = error => {
    const ret = res.errorHandler(error, req.ret())
    res.status(ret.getCode()).json(ret.generate())
  }

  res.success = response => {
    if (response instanceof JsonResponse) {
      return res.status(response.getCode()).json(response.generate())
    }

    const ret = new JsonResponse()

    if (typeof response === 'object') {
      if (typeof response.code !== 'undefined') {
        ret.setCode(response.code)
      }

      if (typeof response.messages !== 'undefined' && Array.isArray(response.messages)) {
        for (const message of response.messages) {
          ret.addMessage(res.__(message))
        }
      }

      if (typeof response.content === 'object') {
        for (const key in response.content) {
          ret.addContent(key, response.content[key])
        }
      }

      if (
        typeof response.code === 'undefined' &&
        typeof response.messages === 'undefined' &&
        typeof response.content === 'undefined'
      ) {
        for (const key in response) {
          ret.addContent(key, response[key])
        }
      }
    }

    if (typeof response === 'number') {
      ret.setCode(response)
    }

    if (typeof response === 'string') {
      ret.addMessage(res.__(response))
    }

    res.status(ret.getCode()).json(ret.generate())
  }

  next()
}
