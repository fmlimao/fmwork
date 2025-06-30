const RoleRepository = require('../repositories/role')

module.exports = async (req, res, next) => {
  let ret = req.ret()

  try {
    const uuid = req.params.roleUuid

    const role = await RoleRepository.findByUuid({
      req,
      res,
      ret,
      uuid,
      tenant: req.tenantRoute,
      withIds: true
    })

    if (!role) {
      ret.setCode(404)
      ret.addMessage(res.__('Perfil não encontrado.'))
      throw ret
    }

    req.roleRoute = role

    next()
  } catch (error) {
    ret = res.errorHandler(error, ret)
    res.status(ret.code).json(ret.generate())
  }
}
