module.exports = (error, req, res, next) => {
  console.error(error)
  res.error(error)
}
