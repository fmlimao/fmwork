const RoleRepository = require('../repositories/role')

const listGet = async (req, res) => {
  let ret = req.ret()

  try {
    const tenantRoute = req.tenantRoute

    const response = await RoleRepository.listAll({
      req,
      res,
      ret,
      filter: req.query || {},
      tenant: tenantRoute
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
    const tenantRoute = req.tenantRoute

    const role = await RoleRepository.create({
      req,
      res,
      ret,
      fields: req.body || {},
      tenant: tenantRoute
    })

    ret.setCode(201)
    ret.addMessage(res.__('Perfil criado com sucesso.'))
    ret.addContent('data', role)

    res.status(ret.code).json(ret.generate())
  } catch (error) {
    ret = res.errorHandler(error, ret)
    res.status(ret.code).json(ret.generate())
  }
}

const getOneGet = async (req, res) => {
  let ret = req.ret()

  try {
    const role = req.roleRoute
    delete role.roleId

    ret.setCode(200)
    ret.addContent('data', role)

    res.status(ret.code).json(ret.generate())
  } catch (error) {
    ret = res.errorHandler(error, ret)
    res.status(ret.code).json(ret.generate())
  }
}

const updatePut = async (req, res) => {
  let ret = req.ret()

  try {
    const tenantRoute = req.tenantRoute
    const roleRoute = req.roleRoute

    const role = await RoleRepository.update({
      req,
      res,
      ret,
      fields: req.body || {},
      tenant: tenantRoute,
      role: roleRoute
    })

    ret.setCode(200)
    ret.addMessage(res.__('Perfil atualizado com sucesso.'))
    ret.addContent('data', role)

    res.status(ret.code).json(ret.generate())
  } catch (error) {
    ret = res.errorHandler(error, ret)
    res.status(ret.code).json(ret.generate())
  }
}

const deleteDelete = async (req, res) => {
  let ret = req.ret()

  try {
    const tenantRoute = req.tenantRoute
    const roleRoute = req.roleRoute

    await RoleRepository.delete({
      req,
      res,
      ret,
      tenant: tenantRoute,
      role: roleRoute
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
  getOneGet,
  updatePut,
  deleteDelete
}
