const TenantRepository = require('../repositories/tenant')

const listGet = async (req, res) => {
  let ret = req.ret()

  try {
    const response = await TenantRepository.listAll({
      req,
      res,
      ret,
      filter: req.query || {}
    })

    ret.mergeResponse(response)

    const { data } = ret.getContents()

    ret.addContent('data', data)

    res.status(ret.code).json(ret.generate())
  } catch (error) {
    ret = res.errorHandler(error, ret)
    res.status(ret.code).json(ret.generate())
  }
}

const createPost = async (req, res) => {
  let ret = req.ret()

  try {
    const tenant = await TenantRepository.create({
      req,
      res,
      ret,
      fields: req.body || {}
    })

    ret.setCode(201)
    ret.addMessage(res.__('Inquilino criado com sucesso.'))
    ret.addContent('tenant', tenant)

    res.status(ret.code).json(ret.generate())
  } catch (error) {
    ret = res.errorHandler(error, ret)
    res.status(ret.code).json(ret.generate())
  }
}

module.exports = {
  listGet,
  createPost
}
