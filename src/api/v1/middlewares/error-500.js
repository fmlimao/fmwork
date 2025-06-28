module.exports = (error, req, res, next) => {
  console.error(error)
  const ret = res.errorHandler(error, req.ret())
  res.status(ret.getCode()).json(ret.generate())
}
