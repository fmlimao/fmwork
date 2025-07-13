const TenantRepository = require('../repositories/tenant')

const listGet = async (req, res) => {
  res.success(await TenantRepository.listAll({
    req,
    res,
    filter: req.query || {}
  }))
}

const createPost = async (req, res) => {
  res.success({
    code: 201,
    messages: ['api.tenant.Inquilino criado com sucesso.'],
    content: {
      data: await TenantRepository.create({
        req,
        res,
        fields: req.body || {}
      })
    }
  })
}

const getOneGet = async (req, res) => {
  const tenantRoute = req.tenantRoute
  delete tenantRoute.tenantId

  res.success({
    code: 200,
    messages: ['api.tenant.Inquilino encontrado com sucesso.'],
    content: {
      data: tenantRoute
    }
  })
}

const updatePut = async (req, res) => {
  res.success({
    code: 200,
    messages: ['api.tenant.Inquilino atualizado com sucesso.'],
    content: {
      data: await TenantRepository.update({
        req,
        res,
        fields: req.body || {},
        tenant: req.tenantRoute
      })
    }
  })
}

const deleteDelete = async (req, res) => {
  res.success({
    code: 204,
    content: {
      data: await TenantRepository.delete({
        req,
        res,
        tenant: req.tenantRoute
      })
    }
  })
}

module.exports = {
  listGet,
  createPost,
  getOneGet,
  updatePut,
  deleteDelete
}
