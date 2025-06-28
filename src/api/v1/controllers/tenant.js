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
    ret.addContent('data', tenant)

    res.status(ret.code).json(ret.generate())
  } catch (error) {
    ret = res.errorHandler(error, ret)
    res.status(ret.code).json(ret.generate())
  }
}

const getGet = async (req, res) => {
  let ret = req.ret()

  try {
    const tenant = req.tenantRoute

    ret.setCode(200)
    ret.addContent('data', tenant)

    res.status(ret.code).json(ret.generate())
  } catch (error) {
    ret = res.errorHandler(error, ret)
    res.status(ret.code).json(ret.generate())
  }
}

const updatePut = async (req, res) => {
  let ret = req.ret()

  try {
    const tenant = await TenantRepository.update({
      req,
      res,
      ret,
      uuid: req.params.uuid,
      fields: req.body || {}
    })

    ret.setCode(200)
    ret.addMessage(res.__('Inquilino atualizado com sucesso.'))
    ret.addContent('data', tenant)

    res.status(ret.code).json(ret.generate())
  } catch (error) {
    ret = res.errorHandler(error, ret)
    res.status(ret.code).json(ret.generate())
  }
}

const deleteDelete = async (req, res) => {
  let ret = req.ret()

  try {
    await TenantRepository.delete({
      req,
      res,
      ret,
      uuid: req.params.uuid
    })

    ret.setCode(204)
    res.status(ret.code).json(ret.generate())
  } catch (error) {
    ret = res.errorHandler(error, ret)
    res.status(ret.code).json(ret.generate())
  }
}

module.exports = {
  listGet,
  createPost,
  getGet,
  updatePut,
  deleteDelete
}
