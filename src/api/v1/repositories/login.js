const conn = require('../../../database/conn-mysql')
const bcrypt = require('bcrypt')

module.exports = class LoginRepository {
  static async findOneByEmailAndPassword (args = {}) {
    const res = args.res
    const ret = args.ret
    const email = args.email
    const password = args.password

    return Promise.resolve()
      .then(async () => {
        const query = `
          SELECT u.uuid, u.email, u.password
          FROM users u
          WHERE u.deleted_at IS NULL
          AND u.email = :email
          LIMIT 1;
        `

        const values = {
          email
        }

        const user = await conn.getOne(query, values)

        if (!user) {
          ret.setCode(401)
          ret.setError(true)
          ret.addMessage(res.__('Usuário não encontrado.'))
          throw ret
        }

        // Verificamos se a senha está correta
        const passwordCompare = bcrypt.compareSync(password, user.password)

        if (!passwordCompare) {
          ret.setCode(401)
          ret.setError(true)
          ret.addMessage(res.__('Usuário não encontrado.'))
          throw ret
        }

        return user
      })
  }

  // static async findOneByUuid (args = {}) {
  //   const res = args.res
  //   const ret = args.ret
  //   const uuid = args.uuid

  //   return Promise.resolve()
  //     .then(async () => {
  //       const query = `
  //         SELECT
  //           u.uuid,
  //           u.name,
  //           u.email,
  //           u.phone_number AS phoneNumber
  //         FROM users u
  //         WHERE u.deleted_at IS NULL
  //         AND u.active = 1
  //         AND u.uuid = :uuid
  //       `

  //       const values = {
  //         uuid
  //       }

  //       const userData = await conn.getOne(query, values)

  //       if (!userData) {
  //         ret.setCode(401)
  //         ret.addMessage(res.__('Token inválido.'))
  //         throw ret
  //       }

  //       return userData
  //     })
  // }
}
