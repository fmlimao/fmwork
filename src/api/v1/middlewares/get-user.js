const UserRepository = require('../repositories/user')

module.exports = async (req, res, next) => {
  let ret = req.ret()

  try {
    const uuid = req.params.userUuid

    const user = await UserRepository.findByUuid({
      req,
      res,
      ret,
      uuid,
      tenant: req.tenantRoute,
      withIds: true
    })

    if (!user) {
      ret.setCode(404)
      ret.addMessage('Usuário não encontrado.')
      throw ret
    }

    req.userRoute = user

    next()
  } catch (error) {
    ret = res.errorHandler(error, ret)
    res.status(ret.code).json(ret.generate())
  }
}
