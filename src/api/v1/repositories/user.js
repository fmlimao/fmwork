const conn = require('../../../database/conn-mysql')
const filters = require('../../../helpers/filters')
const generateOptions = require('../../../helpers/generate-options')
const validator = require('../../../helpers/validator')
const bcrypt = require('bcrypt')

const localFilters = {
  filterUuid: (args, criterias, values) => {
    filters.uuidFilter(
      args,
      criterias,
      values,
      'uuid',
      'u.uuid IN (:uuid)'
    )
  },
  filterName: (args, criterias, values) => {
    filters.stringFilter(
      args,
      criterias,
      values,
      'name',
      'u.name LIKE :name'
    )
  },
  filterCreatedAt: (args, criterias, values) => {
    filters.dateFilter(
      args,
      criterias,
      values,
      'createdAtInitial',
      'DATE(u.created_at) >= :createdAtInitial'
    )

    filters.dateFilter(
      args,
      criterias,
      values,
      'createdAtFinal',
      'DATE(u.created_at) <= :createdAtFinal'
    )
  },
  filterUpdatedAt: (args, criterias, values) => {
    filters.dateFilter(
      args,
      criterias,
      values,
      'updatedAtInitial',
      'DATE(u.updated_at) >= :updatedAtInitial'
    )

    filters.dateFilter(
      args,
      criterias,
      values,
      'updatedAtFinal',
      'DATE(u.updated_at) <= :updatedAtFinal'
    )
  },
  orderColumns: {
    uuid: 'u.uuid',
    name: 'u.name',
    createdAt: 'u.created_at',
    updatedAt: 'u.updated_at'
  },
  totalQuery: `
    SELECT COUNT(u.user_id) AS total
    FROM users u
    WHERE u.deleted_at IS NULL
  `,
  principalQuery: `
    SELECT
      u.uuid,
      u.name,
      u.document,
      u.email,
      r.uuid AS roleUuid,
      r.name AS roleName,
      u.active,
      u.created_at AS createdAt,
      u.updated_at AS updatedAt
    FROM users u
    INNER JOIN roles r ON r.role_id = u.role_id AND r.deleted_at IS NULL
    WHERE u.deleted_at IS NULL
  `,
  principalQueryWithIds: `
    SELECT
      u.user_id AS userId,
      u.uuid,
      u.name,
      u.document,
      u.email,
      r.uuid AS roleUuid,
      r.name AS roleName,
      u.active,
      u.created_at AS createdAt,
      u.updated_at AS updatedAt
    FROM users u
    INNER JOIN roles r ON r.role_id = u.role_id AND r.deleted_at IS NULL
    WHERE u.deleted_at IS NULL
  `
}

module.exports = class UserRepository {
  static async listAll (args = {}) {
    const tenant = args.tenant
    const withIds = args.withIds || false

    return Promise.resolve()
      .then(async () => {
        const queryOptions = generateOptions(args.filter)

        const fixedWhereCriteria = ['u.tenant_id = :tenantId']
        const fixedWhereValues = { tenantId: tenant.tenantId }

        const dynamicWhereCriteria = []
        const dynamicWhereValues = {}

        localFilters.filterUuid(args, dynamicWhereCriteria, dynamicWhereValues)
        localFilters.filterName(args, dynamicWhereCriteria, dynamicWhereValues)
        localFilters.filterCreatedAt(args, dynamicWhereCriteria, dynamicWhereValues)
        localFilters.filterUpdatedAt(args, dynamicWhereCriteria, dynamicWhereValues)

        queryOptions.orderByColumn = filters.orderByColumn(queryOptions.orderByColumn, localFilters.orderColumns, localFilters.orderColumns.name)

        return {
          queryOptions,
          fixedWhereCriteria,
          fixedWhereValues,
          dynamicWhereCriteria,
          dynamicWhereValues
        }
      })
      // Essa promise recupera o total de registros (sem filtro)
      .then(async next => {
        const values = Object.assign({}, next.fixedWhereValues)

        const query = `
          ${localFilters.totalQuery}
          ${next.fixedWhereCriteria.length ? ` AND (${next.fixedWhereCriteria.join(' AND ')})` : ''}
          ;
        `

        next.totalCount = (await conn.getOne(query, values)).total

        return next
      })
      // Essa promise recupera o total de registros (com filtro)
      .then(async next => {
        const values = Object.assign({}, next.fixedWhereValues, next.dynamicWhereValues)

        const query = `
          ${localFilters.totalQuery}
          ${next.fixedWhereCriteria.length ? ` AND (${next.fixedWhereCriteria.join(' AND ')})` : ''}
          ${next.dynamicWhereCriteria.length ? ` AND (${next.dynamicWhereCriteria.join(' AND ')})` : ''}
          ;
        `

        next.filteredCount = (await conn.getOne(query, values)).total

        return next
      })
      // Essa promise recupera os registros (com filtro)
      .then(async next => {
        const values = Object.assign({}, next.fixedWhereValues, next.dynamicWhereValues)

        const query = `
          ${withIds ? localFilters.principalQueryWithIds : localFilters.principalQuery}
          ${next.fixedWhereCriteria.length ? ` AND (${next.fixedWhereCriteria.join(' AND ')})` : ''}
          ${next.dynamicWhereCriteria.length ? ` AND (${next.dynamicWhereCriteria.join(' AND ')})` : ''}
          ORDER BY ${next.queryOptions.orderByColumn} ${next.queryOptions.orderByDir}
          ${next.queryOptions.limit ? next.queryOptions.limit : ''};
          ;
        `
        next.data = await conn.getAll(query, values)

        return next
      })
      // Essa promise retorna os dados no padrão do sistema
      .then(next => {
        return filters.formatList(next, localFilters)
      })
  }

  static async findByUuid (args = {}) {
    const req = args.req
    const res = args.res
    const ret = req.ret()
    const uuid = args.uuid
    const tenant = args.tenant
    const withIds = args.withIds || false

    return Promise.resolve()
      .then(() => {
        if (!validator(res, null, {
          uuid
        }, {
          uuid: 'required|uuid'
        })) {
          ret.setError(true)
          ret.setCode(400)
          ret.addMessage('Id inválido.')
          throw ret
        }

        const query = `
          ${withIds ? localFilters.principalQueryWithIds : localFilters.principalQuery}
          AND u.tenant_id = :tenantId
          AND u.uuid = :userUuid;
        `

        const values = {
          tenantId: tenant.tenantId,
          userUuid: uuid
        }

        return conn.getOne(query, values)
      })
  }

  static async create (args = {}) {
    const req = args.req
    const res = args.res
    const ret = req.ret()
    const fields = args.fields
    const tenant = args.tenant

    return Promise.resolve()
      .then(async () => {
        // Recebemos as variáveis
        const { name, document, email, password, roleUuid } = fields

        if (!validator(res, ret, {
          name,
          document,
          email,
          password,
          roleUuid
        }, {
          name: 'required|string|min:3|max:255',
          document: 'string|min:11|max:14',
          email: 'required|email',
          password: 'required|string|min:6|max:255',
          roleUuid: 'required|uuid'
        })) {
          ret.setError(true)
          ret.setCode(400)
          ret.addMessage('Verifique todos os campos.')
          throw ret
        }

        return {
          fields: {
            name,
            document,
            email,
            password,
            roleUuid
          }
        }
      })
      // Verifico se o papel existe
      .then(async next => {
        const role = await conn.getOne(`
          SELECT role_id AS roleId
          FROM roles
          WHERE deleted_at IS NULL
          AND active = 1
          AND tenant_id = ?
          AND uuid = ?
          LIMIT 1;
        `, [
          tenant.tenantId,
          next.fields.roleUuid
        ])

        if (!role) {
          ret.setCode(400)
          ret.setFieldError('roleUuid', true)
          ret.addFieldMessage('roleUuid', 'Papel não encontrado.')
          ret.addMessage('Verifique todos os campos.')
          throw ret
        }

        next.fields.roleId = role.roleId

        return next
      })
      // Verificamos se o registro já existe
      .then(async next => {
        const user = await conn.getOne(`
          SELECT uuid, name, document, email, active
          FROM users
          WHERE deleted_at IS NULL
          AND tenant_id = ?
          AND email = ?
          LIMIT 1;
        `, [
          tenant.tenantId,
          next.fields.email
        ])

        if (user) {
          ret.setCode(400)
          ret.setFieldError('email', true)
          ret.addFieldMessage('email', 'Já temos um usuário com este e-mail.')
          ret.addMessage('Verifique todos os campos.')
          throw ret
        }

        return next
      })
      // Vamos criptografar a senha
      .then(async next => {
        next.fields.password = await bcrypt.hash(next.fields.password, 10)

        return next
      })
      // Vamos criar o registro
      .then(async next => {
        const uuid = await conn.uuid()

        const userId = await conn.insert(`
          INSERT INTO users (uuid, name, document, email, password, tenant_id, role_id)
          VALUES (?, ?, ?, ?, ?, ?, ?);
        `, [
          uuid,
          next.fields.name,
          next.fields.document || null,
          next.fields.email,
          next.fields.password,
          tenant.tenantId,
          next.fields.roleId
        ])

        if (!userId) {
          ret.setCode(400)
          ret.addMessage('Erro ao cadastrar usuário.')
          throw ret
        }

        return this.findByUuid({
          req,
          res,
          uuid,
          tenant
        })
      })
  }

  static async update (args = {}) {
    const req = args.req
    const res = args.res
    const ret = req.ret()
    const fields = args.fields
    const tenant = args.tenant
    const user = args.user

    return Promise.resolve()
      .then(async () => {
        // Recebemos as variáveis
        const { name, document, email, password, roleUuid } = fields

        let fieldCount = 0
        const updateFields = {}
        const updateValidates = {}

        if (name !== undefined) {
          fieldCount++
          updateFields.name = name
          updateValidates.name = 'required|string|min:3|max:255'
        }

        if (document !== undefined) {
          fieldCount++
          updateFields.document = document
          updateValidates.document = 'string|min:11|max:14'
        }

        if (email !== undefined) {
          fieldCount++
          updateFields.email = email
          updateValidates.email = 'required|email'
        }

        if (roleUuid !== undefined) {
          fieldCount++
          updateFields.roleUuid = roleUuid
          updateValidates.roleUuid = 'uuid'
        }

        if (password !== undefined) {
          fieldCount++
          updateFields.password = password
          updateValidates.password = 'required|string|min:6|max:255'
        }

        if (!fieldCount) {
          ret.setError(true)
          ret.setCode(400)
          ret.addMessage('Nenhum campo foi informado.')
          throw ret
        }

        if (!validator(res, ret, fields, updateValidates)) {
          ret.setError(true)
          ret.setCode(400)
          ret.addMessage('Verifique todos os campos.')
          throw ret
        }

        return {
          fields: updateFields
        }
      })
      // Verifico se o papel existe
      .then(async next => {
        if (next.fields.roleUuid) {
          const role = await conn.getOne(`
            SELECT role_id AS roleId
            FROM roles
            WHERE deleted_at IS NULL
            AND active = 1
            AND tenant_id = ?
            AND uuid = ?
            LIMIT 1;
          `, [
            tenant.tenantId,
            next.fields.roleUuid
          ])

          if (!role) {
            ret.setCode(400)
            ret.setFieldError('roleUuid', true)
            ret.addFieldMessage('roleUuid', 'Papel não encontrado.')
            ret.addMessage('Verifique todos os campos.')
            throw ret
          }

          next.fields.role_id = role.roleId
          delete next.fields.roleUuid
        }

        return next
      })
      // Verificamos se o registro já existe
      .then(async next => {
        if (next.fields.email) {
          const userExists = await conn.getOne(`
            SELECT uuid, email
            FROM users
            WHERE deleted_at IS NULL
            AND tenant_id = ?
            AND user_id != ?
            AND email = ?
            LIMIT 1;
          `, [
            tenant.tenantId,
            user.userId,
            next.fields.email
          ])

          if (userExists) {
            ret.setCode(400)
            ret.setFieldError('email', true)
            ret.addFieldMessage('email', 'Já temos um usuário com este e-mail.')
            ret.addMessage('Verifique todos os campos.')
            throw ret
          }
        }

        return next
      })
      // Vamos criptografar a senha
      .then(async next => {
        if (next.fields.password) {
          next.fields.password = await bcrypt.hash(next.fields.password, 10)
        }

        return next
      })
      // Vamos atualizar o perfil
      .then(async next => {
        try {
          await conn.update(`
            UPDATE users
            SET ${Object.keys(next.fields).map(key => `${key} = :${key}`).join(', ')},
            updated_at = NOW()
            WHERE user_id = :userId
            LIMIT 1;
          `, Object.assign({}, next.fields, {
            userId: user.userId
          }))
        } catch (error) {
          ret.setCode(400)
          ret.addMessage('Erro ao atualizar usuário.')
          ret.addMessage(error.message)
          throw ret
        }

        return this.findByUuid({
          req,
          res,
          uuid: user.uuid,
          tenant
        })
      })
  }

  static async delete (args = {}) {
    const req = args.req
    const res = args.res
    const ret = req.ret()
    const tenant = args.tenant
    const user = args.user

    return Promise.resolve()
      .then(async () => {
        // Vamos deletar o perfil
        try {
          await conn.update(`
            UPDATE users
            SET deleted_at = NOW()
            WHERE user_id = :userId
            LIMIT 1;
          `, {
            userId: user.userId
          })
        } catch (error) {
          ret.setCode(400)
          ret.addMessage('Erro ao deletar usuário.')
          ret.addMessage(error.message)
          throw ret
        }

        return await this.findByUuid({
          req,
          res,
          uuid: user.uuid,
          tenant
        })
      })
  }

  static async getRole (args = {}) {
    const tenant = args.tenant
    const user = args.user

    return Promise.resolve()
      .then(async () => {
        const role = await conn.getOne(`
          SELECT
            r.uuid,
            r.name,
            r.description,
            r.created_at AS createdAt,
            r.updated_at AS updatedAt
          FROM roles r
          INNER JOIN user_roles ur ON r.role_id = ur.role_id AND ur.deleted_at IS NULL
          WHERE r.deleted_at IS NULL
          AND r.tenant_id = ?
          AND ur.user_id = ?
          LIMIT 1;
        `, [
          tenant.tenantId,
          user.userId
        ])

        return role || null
      })
  }

  static async updateRole (args = {}) {
    const req = args.req
    const res = args.res
    const ret = req.ret()
    const fields = args.fields
    const tenant = args.tenant
    const user = args.user

    return Promise.resolve()
      .then(async () => {
        // Recebemos as variáveis
        const { roleUuid } = fields

        let fieldCount = 0
        const updateFields = {}
        const updateValidates = {}

        if (roleUuid !== undefined) {
          fieldCount++
          updateFields.roleUuid = roleUuid
          updateValidates.roleUuid = 'uuid'
        }

        if (!fieldCount) {
          ret.setError(true)
          ret.setCode(400)
          ret.addMessage('Nenhum campo foi informado.')
          throw ret
        }

        if (!validator(res, ret, fields, updateValidates)) {
          ret.setError(true)
          ret.setCode(400)
          ret.addMessage('Verifique todos os campos.')
          throw ret
        }

        return {
          fields: updateFields
        }
      })
      // Verificamos se o perfil existe
      .then(async next => {
        if (next.fields.roleUuid) {
          const roleExists = await conn.getOne(`
            SELECT role_id AS roleId
            FROM roles
            WHERE deleted_at IS NULL
            AND tenant_id = ?
            AND uuid = ?
            LIMIT 1;
          `, [
            tenant.tenantId,
            next.fields.roleUuid
          ])

          if (!roleExists) {
            ret.setCode(400)
            ret.setFieldError('roleUuid', true)
            ret.addFieldMessage('roleUuid', 'Perfil não encontrado.')
            ret.addMessage('Verifique todos os campos.')
            throw ret
          }

          next.fields.roleId = roleExists.roleId
        } else {
          next.fields.roleId = null
        }

        return next
      })
      // Vamos atualizar o perfil do usuário
      .then(async next => {
        try {
          // Se o ID for nulo, então vamos deletar o perfil do usuário
          if (next.fields.roleId === null) {
            await conn.update(`
              UPDATE user_roles
              SET deleted_at = NOW()
              WHERE deleted_at IS NULL
              AND tenant_id = :tenantId
              AND user_id = :userId
              LIMIT 1;
            `, {
              tenantId: tenant.tenantId,
              userId: user.userId
            })
          } else {
            await conn.insert(`
              INSERT INTO user_roles (tenant_id, user_id, role_id)
              VALUES (:tenantId, :userId, :roleId);
            `, {
              userId: user.userId,
              roleId: next.fields.roleId,
              tenantId: tenant.tenantId
            })
          }
        } catch (error) {
          ret.setCode(400)
          ret.addMessage('Erro ao atualizar perfil do usuário.')
          ret.addMessage(error.message)
          throw ret
        }

        return this.getRole({
          req,
          res,
          tenant,
          user
        })
      })
  }
}
