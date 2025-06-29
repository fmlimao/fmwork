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
    INNER JOIN tenants t ON r.tenant_id = t.tenant_id AND t.deleted_at IS NULL
    WHERE r.deleted_at IS NULL
  `,
  principalQuery: `
    SELECT
      r.uuid,
      r.name,
      r.description,
      r.created_at AS createdAt,
      r.updated_at AS updatedAt
    FROM roles r
    INNER JOIN tenants t ON r.tenant_id = t.tenant_id AND t.deleted_at IS NULL
    WHERE r.deleted_at IS NULL
  `
}

module.exports = class RoleRepository {
  static async listAll (args = {}) {
    const tenant = args.tenant

    return Promise.resolve()
      .then(async () => {
        const queryOptions = generateOptions(args.filter)

        const fixedWhereCriteria = ['t.uuid = :tenantUuid']
        const fixedWhereValues = { tenantUuid: tenant.uuid }

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
          ${localFilters.principalQuery}
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
    const res = args.res
    const ret = args.ret
    const uuid = args.uuid
    const tenant = args.tenant

    return Promise.resolve()
      .then(() => {
        if (!validator(res, null, {
          uuid
        }, {
          uuid: 'required|uuid'
        })) {
          ret.setError(true)
          ret.setCode(400)
          ret.addMessage(res.__('Id inválido.'))
          throw ret
        }

        const query = `
          ${localFilters.principalQuery}
          AND t.uuid = :tenantUuid
          AND r.uuid = :roleUuid;
        `

        const values = {
          tenantUuid: tenant.uuid,
          roleUuid: uuid
        }

        return conn.getOne(query, values)
      })
  }

  static async create (args = {}) {
    const req = args.req
    const res = args.res
    const ret = args.ret
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
          ret.addMessage(res.__('Verifique todos os campos.'))
          throw ret
        }

        return {
          fields: {
            name,
            description,
            tenantUuid: tenant.uuid
          }
        }
      })
      // Vamos verificar e buscar o id do inquilino
      .then(async next => {
        const tenant = await conn.getOne(`
          SELECT tenant_id
          FROM tenants
          WHERE deleted_at IS NULL
          AND uuid = ?
          LIMIT 1;
        `, [
          next.fields.tenantUuid
        ])

        if (!tenant) {
          ret.setCode(400)
          ret.addMessage(res.__('Inquilino não encontrado.'))
          throw ret
        }

        next.fields.tenantId = tenant.tenant_id

        return next
      })
      // Verificamos se o registro já existe
      .then(async next => {
        const role = await conn.getOne(`
          SELECT uuid, name
          FROM roles
          WHERE deleted_at IS NULL
          AND name = ?
          LIMIT 1;
        `, [
          next.fields.name
        ])

        if (role) {
          ret.setCode(400)
          ret.setFieldError('name', true)
          ret.addFieldMessage('name', res.__('Já temos um perfil com este nome.'))
          ret.addMessage(res.__('Verifique todos os campos.'))
          throw ret
        }

        return next
      })
      // Vamos criar o registro
      .then(async next => {
        const uuid = await conn.uuid()

        const tenantId = await conn.insert(`
          INSERT INTO tenants (uuid, name, description, app_title, app_short_title, is_root)
          VALUES (?, ?, ?, ?, ?, ?);
        `, [
          uuid,
          next.fields.name,
          next.fields.description || null,
          next.fields.appTitle || null,
          next.fields.appShortTitle || null,
          next.fields.isRoot || 0
        ])

        if (!tenantId) {
          ret.setCode(400)
          ret.addMessage(res.__('Erro ao cadastrar inquilino.'))
          throw ret
        }

        return this.findByUuid({
          req,
          res,
          ret,
          uuid
        })
      })
  }

  static async update (args = {}) {
    const req = args.req
    const res = args.res
    const ret = args.ret
    const uuid = args.uuid
    const fields = args.fields
    const tenant = args.tenant

    return Promise.resolve()
      .then(async () => {
        // Recebemos as variáveis
        const { name, description } = fields

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

        if (!fieldCount) {
          ret.setError(true)
          ret.setCode(400)
          ret.addMessage(res.__('Nenhum campo foi informado.'))
          throw ret
        }

        if (!validator(res, ret, fields, updateValidates)) {
          ret.setError(true)
          ret.setCode(400)
          ret.addMessage(res.__('Verifique todos os campos.'))
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
            AND name = ?
            AND uuid != ?
            LIMIT 1;
          `, [
            next.fields.name,
            uuid
          ])

          if (roleExists) {
            ret.setCode(400)
            ret.setFieldError('name', true)
            ret.addFieldMessage('name', res.__('Já temos um perfil com este nome.'))
            ret.addMessage(res.__('Verifique todos os campos.'))
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
            WHERE uuid = :uuid
            LIMIT 1;
          `, Object.assign({}, next.fields, {
            uuid
          }))
        } catch (error) {
          ret.setCode(400)
          ret.addMessage(res.__('Erro ao atualizar perfil.'))
          ret.addMessage(error.message)
          throw ret
        }

        return this.findByUuid({
          req,
          res,
          ret,
          uuid,
          tenant
        })
      })
  }

  static async delete (args = {}) {
    const req = args.req
    const res = args.res
    const ret = args.ret
    const uuid = args.uuid
    const tenant = args.tenant

    return Promise.resolve()
      .then(async () => {
        // Verificamos se o perfil tem usuários vinculados
        const hasUsers = await conn.getOne(`
          SELECT COUNT(*) as total
          FROM users u
          INNER JOIN user_roles ur ON u.user_id = ur.user_id AND ur.deleted_at IS NULL
          INNER JOIN roles r ON ur.role_id = r.role_id AND r.deleted_at IS NULL
          WHERE u.deleted_at IS NULL
          AND r.uuid = ?
          LIMIT 1;
        `, [uuid])

        if (hasUsers && hasUsers.total > 0) {
          ret.setCode(400)
          ret.addMessage(res.__('Não é possível excluir um perfil que possui usuários vinculados.'))
          throw ret
        }

        // Vamos deletar o perfil
        try {
          await conn.update(`
            UPDATE roles
            SET deleted_at = NOW()
            WHERE uuid = :uuid
            LIMIT 1;
          `, {
            uuid
          })
        } catch (error) {
          ret.setCode(400)
          ret.addMessage(res.__('Erro ao deletar perfil.'))
          ret.addMessage(error.message)
          throw ret
        }

        const role = await this.findByUuid({
          req,
          res,
          ret,
          uuid,
          tenant
        })

        return role
      })
  }
}
