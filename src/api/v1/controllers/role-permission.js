const RolePermissionRepository = require('../repositories/role-permission')

const listGet = async (req, res) => {
  res.success(await RolePermissionRepository.listAll({
    req,
    res,
    filter: req.query || {},
    tenant: req.tenantRoute,
    role: req.roleRoute
  }))
}

const createPost = async (req, res) => {
  res.success({
    code: 201,
    messages: ['Permissão criada com sucesso.'],
    content: {
      data: await RolePermissionRepository.create({
        req,
        res,
        fields: req.body || {},
        tenant: req.tenantRoute,
        role: req.roleRoute
      })
    }
  })
}

const getOneGet = async (req, res) => {
  const rolePermissionRoute = req.rolePermissionRoute
  delete rolePermissionRoute.permissionId

  res.success({
    code: 200,
    messages: ['Permissão encontrada com sucesso.'],
    content: {
      data: rolePermissionRoute
    }
  })
}

const deleteDelete = async (req, res) => {
  await RolePermissionRepository.delete({
    req,
    res,
    tenant: req.tenantRoute,
    role: req.roleRoute,
    rolePermission: req.rolePermissionRoute
  })

  res.success(204)
}

module.exports = {
  listGet,
  createPost,
  getOneGet,
  deleteDelete
}
