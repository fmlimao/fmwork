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
          SELECT
            u.uuid,
            u.email,
            u.password
          FROM users u
          INNER JOIN tenants t ON u.tenant_id = t.tenant_id AND t.deleted_at IS NULL AND t.active = 1
          WHERE u.deleted_at IS NULL
          AND u.active = 1
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

  static async findOneByUuid (args = {}) {
    const res = args.res
    const ret = args.ret
    const uuid = args.uuid

    return Promise.resolve()
      .then(async () => {
        const query = `
          SELECT
            u.uuid,
            u.name,
            u.document,
            u.email
          FROM users u
          INNER JOIN tenants t ON u.tenant_id = t.tenant_id AND t.deleted_at IS NULL AND t.active = 1
          WHERE u.deleted_at IS NULL
          AND u.active = 1
          AND u.uuid = :uuid
        `

        const values = {
          uuid
        }

        const user = await conn.getOne(query, values)

        if (!user) {
          ret.setCode(401)
          ret.addMessage(res.__('Token inválido.'))
          throw ret
        }

        return user
      })
  }

  static async getTenantByUserUuid (args = {}) {
    const res = args.res
    const ret = args.ret
    const uuid = args.uuid

    return Promise.resolve()
      .then(async () => {
        const query = `
          SELECT
            t.uuid,
            t.name,
            t.description,
            t.app_title,
            t.app_short_title,
            t.is_root
          FROM users u
          INNER JOIN tenants t ON u.tenant_id = t.tenant_id AND t.deleted_at IS NULL AND t.active = 1
          WHERE u.deleted_at IS NULL
          AND u.active = 1
          AND u.uuid = :uuid
        `

        const values = {
          uuid
        }

        const tenant = await conn.getOne(query, values)

        if (!tenant) {
          ret.setCode(401)
          ret.addMessage(res.__('Token inválido.'))
          throw ret
        }

        return tenant
      })
  }

  static async getRoleByUserUuid (args = {}) {
    const res = args.res
    const ret = args.ret
    const uuid = args.uuid

    return Promise.resolve()
      .then(async () => {
        const query = `
          SELECT
            r.uuid,
            r.name,
            r.description
          FROM users u
          INNER JOIN tenants t ON u.tenant_id = t.tenant_id AND t.deleted_at IS NULL AND t.active = 1
          INNER JOIN roles r ON r.tenant_id = t.tenant_id AND r.deleted_at IS NULL AND r.active = 1
          INNER JOIN user_roles ur ON u.user_id = ur.user_id AND t.tenant_id = ur.tenant_id AND ur.deleted_at IS NULL
          WHERE u.deleted_at IS NULL
          AND u.active = 1
          AND u.uuid = :uuid
        `

        const values = {
          uuid
        }

        const role = await conn.getOne(query, values)

        if (!role) {
          ret.setCode(401)
          ret.addMessage(res.__('Token inválido.'))
          throw ret
        }

        return role
      })
  }

  static async getPermissionsByUserUuid (args = {}) {
    const res = args.res
    const ret = args.ret
    const uuid = args.uuid

    return Promise.resolve()
      .then(async () => {
        const query = `
          SELECT
            p.uuid,
            p.name,
            p.slug,
            p.description
          FROM users u
          INNER JOIN tenants t ON u.tenant_id = t.tenant_id AND t.deleted_at IS NULL AND t.active = 1
          INNER JOIN roles r ON r.tenant_id = t.tenant_id AND r.deleted_at IS NULL AND r.active = 1
          INNER JOIN user_roles ur ON u.user_id = ur.user_id AND t.tenant_id = ur.tenant_id AND ur.deleted_at IS NULL
          INNER JOIN role_permissions rp ON r.role_id = rp.role_id AND t.tenant_id = rp.tenant_id AND rp.deleted_at IS NULL
          INNER JOIN permissions p ON rp.permission_id = p.permission_id AND p.deleted_at IS NULL
          WHERE u.deleted_at IS NULL
          AND u.active = 1
          AND u.uuid = :uuid
          ORDER BY p.name
        `

        const values = {
          uuid
        }

        const permissions = await conn.getAll(query, values)

        if (!permissions || permissions.length === 0) {
          ret.setCode(401)
          ret.addMessage(res.__('Token inválido.'))
          throw ret
        }

        return permissions
      })
  }
}
