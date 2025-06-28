const JsonResponse = require('../helpers/json-response')
const errorHandler = require('../helpers/error-handler')

module.exports = (req, res, next) => {
  req.ret = () => {
    return new JsonResponse()
  }
  res.errorHandler = errorHandler
  next()
}
