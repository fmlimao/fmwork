const conn = require('../../../database/conn-mysql')
const filters = require('../../../helpers/filters')
const generateOptions = require('../../../helpers/generate-options')
const validator = require('../../../helpers/validator')

const localFilters = {
  filterUuid: (args, criterias, values) => {
    filters.uuidFilter(
      args,
      criterias,
      values,
      'uuid',
      'r.uuid IN (:uuid)'
    )
  },
  filterName: (args, criterias, values) => {
    filters.stringFilter(
      args,
      criterias,
      values,
      'name',
      'r.name LIKE :name'
    )
  },
  filterCreatedAt: (args, criterias, values) => {
    filters.dateFilter(
      args,
      criterias,
      values,
      'createdAtInitial',
      'DATE(r.created_at) >= :createdAtInitial'
    )

    filters.dateFilter(
      args,
      criterias,
      values,
      'createdAtFinal',
      'DATE(r.created_at) <= :createdAtFinal'
    )
  },
  filterUpdatedAt: (args, criterias, values) => {
    filters.dateFilter(
      args,
      criterias,
      values,
      'updatedAtInitial',
      'DATE(r.updated_at) >= :updatedAtInitial'
    )

    filters.dateFilter(
      args,
      criterias,
      values,
      'updatedAtFinal',
      'DATE(r.updated_at) <= :updatedAtFinal'
    )
  },
  orderColumns: {
    uuid: 'r.uuid',
    name: 'r.name',
    createdAt: 'r.created_at',
    updatedAt: 'r.updated_at'
  },
  totalQuery: `
    SELECT COUNT(r.role_id) AS total
    FROM roles r
    WHERE r.deleted_at IS NULL
  `,
  principalQuery: `
    SELECT
      r.uuid,
      r.name,
      r.description,
      r.active,
      r.created_at AS createdAt,
      r.updated_at AS updatedAt
    FROM roles r
    WHERE r.deleted_at IS NULL
  `,
  principalQueryWithIds: `
    SELECT
      r.role_id AS roleId,
      r.uuid,
      r.name,
      r.description,
      r.active,
      r.created_at AS createdAt,
      r.updated_at AS updatedAt
    FROM roles r
    WHERE r.deleted_at IS NULL
  `
}

module.exports = class RoleRepository {
  static async listAll (args = {}) {
    const tenant = args.tenant
    const withIds = args.withIds || false

    return Promise.resolve()
      .then(async () => {
        const queryOptions = generateOptions(args.filter)

        const fixedWhereCriteria = ['r.tenant_id = :tenantId']
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
          AND r.tenant_id = :tenantId
          AND r.uuid = :roleUuid;
        `

        const values = {
          tenantId: tenant.tenantId,
          roleUuid: uuid
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
        const { name, description } = fields

        if (!validator(res, ret, {
          name,
          description
        }, {
          name: 'required|string|min:3|max:255',
          description: 'string|min:3|max:255'
        })) {
          ret.setError(true)
          ret.setCode(400)
          ret.addMessage('Verifique todos os campos.')
          throw ret
        }

        return {
          fields: {
            name,
            description
          }
        }
      })
      // Verificamos se o registro já existe
      .then(async next => {
        const role = await conn.getOne(`
          SELECT uuid, name
          FROM roles
          WHERE deleted_at IS NULL
          AND tenant_id = ?
          AND name = ?
          LIMIT 1;
        `, [
          tenant.tenantId,
          next.fields.name
        ])

        if (role) {
          ret.setCode(400)
          ret.setFieldError('name', true)
          ret.addFieldMessage('name', 'Já temos um papel com este nome.')
          ret.addMessage('Verifique todos os campos.')
          throw ret
        }

        return next
      })
      // Vamos criar o registro
      .then(async next => {
        const uuid = await conn.uuid()

        const tenantId = await conn.insert(`
          INSERT INTO roles (uuid, name, description, tenant_id)
          VALUES (?, ?, ?, ?);
        `, [
          uuid,
          next.fields.name,
          next.fields.description || null,
          tenant.tenantId
        ])

        if (!tenantId) {
          ret.setCode(400)
          ret.addMessage('Erro ao cadastrar papel.')
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
    const role = args.role

    return Promise.resolve()
      .then(async () => {
        // Recebemos as variáveis
        const { name, description, active } = fields

        let fieldCount = 0
        const updateFields = {}
        const updateValidates = {}

        if (name !== undefined) {
          fieldCount++
          updateFields.name = name
          updateValidates.name = 'required|string|min:3|max:255'
        }

        if (description !== undefined) {
          fieldCount++
          updateFields.description = description
          updateValidates.description = 'string|min:3|max:255'
        }

        if (active !== undefined) {
          fieldCount++
          updateFields.active = active
          updateValidates.active = 'boolean'
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
      // Verificamos se o registro já existe
      .then(async next => {
        if (next.fields.name) {
          const roleExists = await conn.getOne(`
            SELECT uuid, name
            FROM roles
            WHERE deleted_at IS NULL
            AND tenant_id = ?
            AND role_id != ?
            AND name = ?
            LIMIT 1;
          `, [
            tenant.tenantId,
            role.roleId,
            next.fields.name
          ])

          if (roleExists) {
            ret.setCode(400)
            ret.setFieldError('name', true)
            ret.addFieldMessage('name', 'Já temos um papel com este nome.')
            ret.addMessage('Verifique todos os campos.')
            throw ret
          }
        }

        return next
      })
      // Vamos atualizar o perfil
      .then(async next => {
        try {
          await conn.update(`
            UPDATE roles
            SET ${Object.keys(next.fields).map(key => `${key} = :${key}`).join(', ')},
            updated_at = NOW()
            WHERE role_id = :roleId
            LIMIT 1;
          `, Object.assign({}, next.fields, {
            roleId: role.roleId
          }))
        } catch (error) {
          ret.setCode(400)
          ret.addMessage('Erro ao atualizar papel.')
          ret.addMessage(error.message)
          throw ret
        }

        return this.findByUuid({
          req,
          res,
          uuid: role.uuid,
          tenant
        })
      })
  }

  static async delete (args = {}) {
    const req = args.req
    // const res = args.res
    const ret = req.ret()
    const tenant = args.tenant
    const role = args.role

    return Promise.resolve()
      .then(async () => {
        // Verificamos se o perfil tem usuários vinculados
        const hasUsers = await conn.getOne(`
          SELECT COUNT(*) as total
          FROM users u
          WHERE u.deleted_at IS NULL
          AND u.active = 1
          AND u.tenant_id = ?
          AND u.role_id = ?
          LIMIT 1;
        `, [
          tenant.tenantId,
          role.roleId
        ])

        if (hasUsers && hasUsers.total > 0) {
          ret.setCode(400)
          ret.addMessage('Não é possível excluir um papel que possui usuários vinculados.')
          throw ret
        }

        // Vamos deletar o registro
        try {
          await conn.update(`
            UPDATE roles
            SET deleted_at = NOW()
            WHERE role_id = :roleId
            LIMIT 1;
          `, {
            roleId: role.roleId
          })
        } catch (error) {
          ret.setCode(400)
          ret.addMessage('Erro ao deletar papel.')
          ret.addMessage(error.message)
          throw ret
        }

        return null
      })
  }
}
