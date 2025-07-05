const RolePermissionRepository = require('../repositories/role-permission')

module.exports = async (req, res, next) => {
  let ret = req.ret()

  try {
    const uuid = req.params.permissionUuid

    const rolePermission = await RolePermissionRepository.findByUuid({
      req,
      res,
      ret,
      uuid,
      tenant: req.tenantRoute,
      role: req.roleRoute,
      withIds: true
    })

    if (!rolePermission) {
      ret.setCode(404)
      ret.addMessage(res.__('Permissão não encontrada.'))
      throw ret
    }

    req.rolePermissionRoute = rolePermission

    next()
  } catch (error) {
    ret = res.errorHandler(error, ret)
    res.status(ret.code).json(ret.generate())
  }
}
