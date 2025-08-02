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

const addPost = async (req, res) => {
  res.success({
    code: 201,
    messages: ['Permissão adicionada com sucesso.'],
    content: {
      data: await RolePermissionRepository.add({
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

const removeDelete = async (req, res) => {
  res.success({
    code: 204,
    content: {
      data: await RolePermissionRepository.remove({
        req,
        res,
        tenant: req.tenantRoute,
        role: req.roleRoute,
        rolePermission: req.rolePermissionRoute
      })
    }
  })
}

module.exports = {
  listGet,
  addPost,
  getOneGet,
  removeDelete
}
