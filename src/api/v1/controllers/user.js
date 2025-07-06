const UserRepository = require('../repositories/user')

const listGet = async (req, res) => {
  res.success(await UserRepository.listAll({
    req,
    res,
    filter: req.query || {},
    tenant: req.tenantRoute
  }))
}

const createPost = async (req, res) => {
  res.success({
    code: 201,
    messages: ['Usuário criado com sucesso.'],
    content: {
      data: await UserRepository.create({
        req,
        res,
        fields: req.body || {},
        tenant: req.tenantRoute
      })
    }
  })
}

const getOneGet = async (req, res) => {
  const userRoute = req.userRoute
  delete userRoute.userId

  res.success({
    code: 200,
    messages: ['Usuário encontrado com sucesso.'],
    content: {
      data: userRoute
    }
  })
}

const updatePut = async (req, res) => {
  res.success({
    code: 200,
    messages: ['Usuário atualizado com sucesso.'],
    content: {
      data: await UserRepository.update({
        req,
        res,
        fields: req.body || {},
        tenant: req.tenantRoute,
        user: req.userRoute
      })
    }
  })
}

const deleteDelete = async (req, res) => {
  await UserRepository.delete({
    req,
    res,
    tenant: req.tenantRoute,
    user: req.userRoute
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
