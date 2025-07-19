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
      't.uuid IN (:uuid)'
    )
  },
  filterName: (args, criterias, values) => {
    filters.stringFilter(
      args,
      criterias,
      values,
      'name',
      't.name LIKE :name'
    )
  },
  filterActive: (args, criterias, values) => {
    filters.activeFilter(
      args,
      criterias,
      values,
      'active',
      't.active IN (:active)'
    )
  },
  filterCreatedAt: (args, criterias, values) => {
    filters.dateFilter(
      args,
      criterias,
      values,
      'createdAtInitial',
      'DATE(t.created_at) >= :createdAtInitial'
    )

    filters.dateFilter(
      args,
      criterias,
      values,
      'createdAtFinal',
      'DATE(t.created_at) <= :createdAtFinal'
    )
  },
  filterUpdatedAt: (args, criterias, values) => {
    filters.dateFilter(
      args,
      criterias,
      values,
      'updatedAtInitial',
      'DATE(t.updated_at) >= :updatedAtInitial'
    )

    filters.dateFilter(
      args,
      criterias,
      values,
      'updatedAtFinal',
      'DATE(t.updated_at) <= :updatedAtFinal'
    )
  },
  orderColumns: {
    uuid: 't.uuid',
    name: 't.name',
    isRoot: 't.is_root',
    active: 't.active',
    createdAt: 't.created_at',
    updatedAt: 't.updated_at'
  },
  totalQuery: `
    SELECT COUNT(t.tenant_id) AS total
    FROM tenants t
    WHERE t.deleted_at IS NULL
  `,
  principalQuery: `
    SELECT
      t.uuid,
      t.name,
      t.description,
      t.app_title AS appTitle,
      t.app_short_title AS appShortTitle,
      t.is_root AS isRoot,
      t.active,
      t.created_at AS createdAt,
      t.updated_at AS updatedAt
    FROM tenants t
    WHERE t.deleted_at IS NULL
  `,
  principalQueryWithIds: `
    SELECT
      t.tenant_id AS tenantId,
      t.uuid,
      t.name,
      t.description,
      t.app_title AS appTitle,
      t.app_short_title AS appShortTitle,
      t.is_root AS isRoot,
      t.active,
      t.created_at AS createdAt,
      t.updated_at AS updatedAt
    FROM tenants t
    WHERE t.deleted_at IS NULL
  `
}

module.exports = class TenantRepository {
  static async listAll (args = {}) {
    const withIds = args.withIds || false

    return Promise.resolve()
      .then(async () => {
        const queryOptions = generateOptions(args.filter)

        const fixedWhereCriteria = []
        const fixedWhereValues = {}

        const dynamicWhereCriteria = []
        const dynamicWhereValues = {}

        localFilters.filterUuid(args, dynamicWhereCriteria, dynamicWhereValues)
        localFilters.filterName(args, dynamicWhereCriteria, dynamicWhereValues)
        localFilters.filterActive(args, dynamicWhereCriteria, dynamicWhereValues)
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
          AND t.uuid = :uuid;
        `

        const values = {
          uuid
        }

        return conn.getOne(query, values)
      })
  }

  static async create (args = {}) {
    const req = args.req
    const res = args.res
    const ret = req.ret()
    const fields = args.fields

    return Promise.resolve()
      .then(async () => {
        // Recebemos as variáveis
        const { name, description, appTitle, appShortTitle } = fields

        if (!validator(res, ret, {
          name,
          description,
          appTitle,
          appShortTitle
        }, {
          name: 'required|string|min:3|max:255',
          description: 'string|min:3|max:255',
          appTitle: 'required|string|min:3|max:10',
          appShortTitle: 'required|string|min:3|max:5'
        })) {
          ret.setError(true)
          ret.setCode(400)
          ret.addMessage('Verifique todos os campos.')
          throw ret
        }

        return {
          fields: {
            name,
            description,
            appTitle,
            appShortTitle
          }
        }
      })
      // Verificamos se o registro já existe
      .then(async next => {
        const tenant = await conn.getOne(`
          SELECT uuid, name
          FROM tenants
          WHERE deleted_at IS NULL
          AND name = ?
          LIMIT 1;
        `, [
          next.fields.name
        ])

        if (tenant) {
          ret.setCode(400)
          ret.setFieldError('name', true)
          ret.addFieldMessage('name', 'Já temos um inquilino com este nome.')
          ret.addMessage('Verifique todos os campos.')
          throw ret
        }

        return next
      })
      // Vamos criar o registro
      .then(async next => {
        const uuid = await conn.uuid()

        try {
          await conn.insert(`
            INSERT INTO tenants (uuid, name, description, app_title, app_short_title)
            VALUES (?, ?, ?, ?, ?);
          `, [
            uuid,
            next.fields.name,
            next.fields.description || null,
            next.fields.appTitle || null,
            next.fields.appShortTitle || null
          ])
        } catch (error) {
          ret.setCode(400)
          ret.addMessage('Erro ao cadastrar inquilino.')
          throw ret
        }

        return this.findByUuid({
          req,
          res,
          uuid
        })
      })
  }

  static async update (args = {}) {
    const req = args.req
    const res = args.res
    const ret = req.ret()
    const fields = args.fields
    const tenant = args.tenant

    return Promise.resolve()
      .then(async () => {
        // Recebemos as variáveis
        const { name, description, appTitle, appShortTitle, active } = fields

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

        if (appTitle !== undefined) {
          fieldCount++
          updateFields.app_title = appTitle
          updateValidates.appTitle = 'string|min:3|max:255'
        }

        if (appShortTitle !== undefined) {
          fieldCount++
          updateFields.app_short_title = appShortTitle
          updateValidates.appShortTitle = 'string|min:3|max:255'
        }

        if (active !== undefined) {
          fieldCount++
          updateFields.active = active
          updateValidates.active = 'required|integer|between:0,1'
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
      // Verificamos se o inquilino já existe
      .then(async next => {
        if (next.fields.name) {
          const tenantExists = await conn.getOne(`
            SELECT uuid, name
            FROM tenants
            WHERE deleted_at IS NULL
            AND name = ?
            AND tenant_id != ?
            LIMIT 1;
          `, [
            next.fields.name,
            tenant.tenantId
          ])

          if (tenantExists) {
            ret.setCode(400)
            ret.setFieldError('name', true)
            ret.addFieldMessage('name', 'Já temos um inquilino com este nome.')
            ret.addMessage('Verifique todos os campos.')
            throw ret
          }
        }

        return next
      })
      // Vamos atualizar o inquilino
      .then(async next => {
        try {
          await conn.update(`
            UPDATE tenants
            SET ${Object.keys(next.fields).map(key => `${key} = :${key}`).join(', ')},
            updated_at = NOW()
            WHERE tenant_id = :tenantId
            LIMIT 1;
          `, Object.assign({}, next.fields, {
            tenantId: tenant.tenantId
          }))
        } catch (error) {
          ret.setCode(400)
          ret.addMessage('Erro ao atualizar inquilino.')
          ret.addMessage(error.message)
          throw ret
        }

        return await this.findByUuid({
          req,
          res,
          uuid: tenant.uuid
        })
      })
  }

  static async delete (args = {}) {
    const req = args.req
    // const res = args.res
    const ret = req.ret()
    const tenant = args.tenant

    return Promise.resolve()
      .then(async () => {
        // Verificamos se o inquilino é root
        const tenantIsRoot = await conn.getOne(`
          SELECT is_root
          FROM tenants
          WHERE deleted_at IS NULL
          AND tenant_id = ?
          AND is_root = 1
          LIMIT 1;
        `, [
          tenant.tenantId
        ])

        if (tenantIsRoot) {
          ret.setError(true)
          ret.setCode(400)
          ret.addMessage('Não é possível excluir um inquilino que é root.')
          throw ret
        }

        // Vamos deletar o inquilino
        try {
          await conn.update(`
            UPDATE tenants
            SET deleted_at = NOW()
            WHERE tenant_id = :tenantId
            LIMIT 1;
          `, {
            tenantId: tenant.tenantId
          })
        } catch (error) {
          ret.setCode(400)
          ret.addMessage('Erro ao deletar inquilino.')
          ret.addMessage(error.message)
          throw ret
        }

        return null
      })
  }
}
