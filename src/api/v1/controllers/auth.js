const LoginRepository = require('../repositories/login')
const jwt = require('jsonwebtoken')

const loginPost = async (req, res) => {
  let ret = req.ret()

  try {
    // Recebemos o Basic Auth
    const auth = req.headers.authorization || ''

    // Verificamos se o Basic Auth está presente
    if (!auth) {
      ret.setCode(401)
      ret.setError(true)
      ret.addMessage('Basic Auth não informado.')
      throw ret
    }

    // Verificamos se o Basic Auth está no formato correto
    const authParts = auth.split(' ')

    if (authParts.length !== 2) {
      ret.setCode(401)
      ret.setError(true)
      ret.addMessage('Basic Auth inválido.')
      throw ret
    }

    // Verificamos se o Basic Auth está no formato correto
    const [authScheme, authToken] = authParts

    if (!/^Basic$/i.test(authScheme)) {
      ret.setCode(401)
      ret.setError(true)
      ret.addMessage('Basic Auth inválido.')
      throw ret
    }

    // Verificamos se o Basic Auth está no formato correto
    const [email, password] = Buffer.from(authToken, 'base64').toString().split(':')

    if (!email || !password) {
      ret.setCode(401)
      ret.setError(true)
      ret.addMessage('Basic Auth inválido.')
      throw ret
    }

    // Vamos tentar procurar o usuário
    const user = await LoginRepository.findOneByEmailAndPassword({
      req,
      res,
      ret,
      email,
      password
    })

    // Geramos o token
    const JWT_SECRET = process.env.JWT_SECRET || '123_JWT_SECRET_456'
    const JWT_EXPIRE = Number(process.env.JWT_EXPIRE || 0)

    const tokenData = {
      uuid: user.uuid
    }

    if (JWT_EXPIRE) {
      tokenData.exp = Math.floor(Date.now() / 1000) + JWT_EXPIRE
    }

    const token = jwt.sign(tokenData, JWT_SECRET)

    // Retornamos o token
    ret.addContent('accessToken', token)

    res.status(ret.code).json(ret.generate())
  } catch (error) {
    ret = res.errorHandler(error, ret)
    res.status(ret.code).json(ret.generate())
  }
}

const meGet = async (req, res) => {
  let ret = req.ret()

  try {
    ret.addContent('me', req.auth)

    res.status(ret.code).json(ret.generate())
  } catch (error) {
    ret = res.errorHandler(error, ret)
    res.status(ret.code).json(ret.generate())
  }
}

module.exports = {
  loginPost,
  meGet
}
