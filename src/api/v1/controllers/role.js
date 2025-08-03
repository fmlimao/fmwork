const RoleRepository = require('../repositories/role')

const list = async (req, res) => {
  res.success(await RoleRepository.listAll({
    req,
    res,
    filter: req.query || {},
    tenant: req.tenantRoute
  }))
}

const create = async (req, res) => {
  res.success({
    code: 201,
    messages: ['Papel criado com sucesso.'],
    content: {
      data: await RoleRepository.create({
        req,
        res,
        fields: req.body || {},
        tenant: req.tenantRoute
      })
    }
  })
}

const getOne = async (req, res) => {
  const roleRoute = req.roleRoute
  delete roleRoute.roleId

  res.success({
    code: 200,
    messages: ['Papel encontrado com sucesso.'],
    content: {
      data: roleRoute
    }
  })
}

const update = async (req, res) => {
  res.success({
    code: 200,
    messages: ['Papel atualizado com sucesso.'],
    content: {
      data: await RoleRepository.update({
        req,
        res,
        fields: req.body || {},
        tenant: req.tenantRoute,
        role: req.roleRoute
      })
    }
  })
}

const remove = async (req, res) => {
  res.success({
    code: 204,
    content: {
      data: await RoleRepository.delete({
        req,
        res,
        tenant: req.tenantRoute,
        role: req.roleRoute
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
