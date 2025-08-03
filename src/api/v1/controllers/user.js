const UserRepository = require('../repositories/user')

const list = async (req, res) => {
  res.success(await UserRepository.listAll({
    req,
    res,
    filter: req.query || {},
    tenant: req.tenantRoute
  }))
}

const create = async (req, res) => {
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

const getOne = async (req, res) => {
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

const update = async (req, res) => {
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

const remove = async (req, res) => {
  res.success({
    code: 204,
    content: {
      data: await UserRepository.delete({
        req,
        res,
        tenant: req.tenantRoute,
        user: req.userRoute
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
