const RoleRepository = require('../repositories/role')

const listGet = async (req, res) => {
  res.success(await RoleRepository.listAll({
    req,
    res,
    filter: req.query || {},
    tenant: req.tenantRoute
  }))
}

const createPost = async (req, res) => {
  res.success({
    code: 201,
    messages: ['Perfil criado com sucesso.'],
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

const getOneGet = async (req, res) => {
  const roleRoute = req.roleRoute
  delete roleRoute.roleId

  res.success({
    code: 200,
    messages: ['Perfil encontrado com sucesso.'],
    content: {
      data: roleRoute
    }
  })
}

const updatePut = async (req, res) => {
  res.success({
    code: 200,
    messages: ['Perfil atualizado com sucesso.'],
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

const deleteDelete = async (req, res) => {
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
  listGet,
  createPost,
  getOneGet,
  updatePut,
  deleteDelete
}
