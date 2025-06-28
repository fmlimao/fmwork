const TenantRepository = require('../repositories/tenant')

module.exports = async (req, res, next) => {
  let ret = req.ret()

  try {
    const uuid = req.params.uuid

    const tenant = await TenantRepository.findByUuid({
      req,
      res,
      ret,
      uuid
    })

    if (!tenant) {
      ret.setCode(404)
      ret.addMessage(res.__('Inquilino não encontrado.'))
      throw ret
    }

    req.tenantRoute = tenant

    next()
  } catch (error) {
    ret = res.errorHandler(error, ret)
    res.status(ret.code).json(ret.generate())
  }
}
