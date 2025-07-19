const jwt = require('jsonwebtoken')
const LoginRepository = require('../repositories/login')

module.exports = async (req, res, next) => {
  let ret = req.ret()

  try {
    const auth = req.headers.authorization || ''

    if (!auth) {
      ret.setCode(401)
      ret.addMessage('Bearer Auth não informado.')
      throw ret
    }

    const authParts = auth.split(' ')
    if (authParts.length !== 2) {
      ret.setCode(401)
      ret.addMessage('Bearer Auth inválido.')
      throw ret
    }

    const [authScheme, authToken] = authParts
    if (!/^Bearer$/i.test(authScheme)) {
      ret.setCode(401)
      ret.addMessage('Bearer Auth inválido.')
      throw ret
    }

    const JWT_SECRET = process.env.JWT_SECRET || '123_JWT_SECRET_456'
    const decoded = jwt.verify(authToken, JWT_SECRET)

    const uuid = decoded.uuid

    // Verifico se tem um usuário com o uuid informado
    const user = await LoginRepository.findOneByUuid({
      req,
      res,
      ret,
      uuid
    })

    // Buscar os dados do tenant
    const tenant = await LoginRepository.getTenantByUserUuid({
      req,
      res,
      ret,
      uuid: user.uuid
    })

    // Buscar os dados do perfil
    const role = await LoginRepository.getRoleByUserUuid({
      req,
      res,
      ret,
      uuid: user.uuid
    })

    // Buscar as permissões do usuário
    const permissions = await LoginRepository.getPermissionsByUserUuid({
      req,
      res,
      ret,
      uuid: user.uuid
    })

    req.auth = {
      user,
      tenant,
      role,
      permissions
    }

    next()
    // res.json(req.auth)
  } catch (error) {
    /*

    TokenExpiredError
    name: 'TokenExpiredError'
    message: 'jwt expired'
    expiredAt: [ExpDate]

    JsonWebTokenError
    name: 'JsonWebTokenError'
    message:
    'jwt malformed'
    'jwt signature is required'
    'invalid signature'
    'jwt audience invalid. expected: [OPTIONS AUDIENCE]'
    'jwt issuer invalid. expected: [OPTIONS ISSUER]'
    'jwt id invalid. expected: [OPTIONS JWT ID]'
    'jwt subject invalid. expected: [OPTIONS SUBJECT]'

    NotBeforeError
    Thrown if current time is before the nbf claim.
    name: 'NotBeforeError'
    message: 'jwt not active'
    date: 2018-10-04T16:10:44.000Z

    */

    if (error.name === 'JsonWebTokenError') {
      ret.addErrorCode('INVALID_TOKEN')
      ret.addErrorCodeDetail(error.message)

      error.message = 'Token inválido.'
      ret.setCode(401)
      ret = res.errorHandler(error, ret)
      return res.status(ret.getCode()).json(ret.generate())
    } else if (error.name === 'TokenExpiredError') {
      ret.addErrorCode('EXPIRED_TOKEN')

      ret.setCode(401)
      ret.addMessage('Token expirado.')
      return res.status(ret.getCode()).json(ret.generate())
    }

    ret = res.errorHandler(error, ret)
    res.status(ret.getCode()).json(ret.generate())
  }
}
