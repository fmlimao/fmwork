const TenantRepository = require('../repositories/tenant')

const list = async (req, res) => {
  res.success(await TenantRepository.listAll({
    req,
    res,
    filter: req.query || {}
  }))
}

const create = async (req, res) => {
  res.success({
    code: 201,
    messages: ['Inquilino criado com sucesso.'],
    content: {
      data: await TenantRepository.create({
        req,
        res,
        fields: req.body || {}
      })
    }
  })
}

const getOne = async (req, res) => {
  const tenantRoute = req.tenantRoute
  delete tenantRoute.tenantId

  res.success({
    code: 200,
    messages: ['Inquilino encontrado com sucesso.'],
    content: {
      data: tenantRoute
    }
  })
}

const update = async (req, res) => {
  res.success({
    code: 200,
    messages: ['Inquilino atualizado com sucesso.'],
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

const remove = async (req, res) => {
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
  list,
  create,
  getOne,
  update,
  remove
}
