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
  res.success({
    code: 200,
    messages: ['Perfil encontrado com sucesso.'],
    content: {
      data: req.roleRoute
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
  await RoleRepository.delete({
    req,
    res,
    tenant: req.tenantRoute,
    role: req.roleRoute
  })

  res.success(204)
}

module.exports = {
  listGet,
  createPost,
  getOneGet,
  updatePut,
  deleteDelete
}
