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
      'p.uuid IN (:uuid)'
    )
  },
  filterName: (args, criterias, values) => {
    filters.stringFilter(
      args,
      criterias,
      values,
      'name',
      'p.name LIKE :name'
    )
  },
  filterCreatedAt: (args, criterias, values) => {
    filters.dateFilter(
      args,
      criterias,
      values,
      'createdAtInitial',
      'DATE(p.created_at) >= :createdAtInitial'
    )

    filters.dateFilter(
      args,
      criterias,
      values,
      'createdAtFinal',
      'DATE(p.created_at) <= :createdAtFinal'
    )
  },
  filterUpdatedAt: (args, criterias, values) => {
    filters.dateFilter(
      args,
      criterias,
      values,
      'updatedAtInitial',
      'DATE(p.updated_at) >= :updatedAtInitial'
    )

    filters.dateFilter(
      args,
      criterias,
      values,
      'updatedAtFinal',
      'DATE(p.updated_at) <= :updatedAtFinal'
    )
  },
  orderColumns: {
    uuid: 'p.uuid',
    name: 'p.name',
    createdAt: 'p.created_at',
    updatedAt: 'p.updated_at'
  },
  totalQuery: `
    SELECT COUNT(p.permission_id) AS total
    FROM permissions p
    INNER JOIN role_permissions rp ON p.permission_id = rp.permission_id AND rp.deleted_at IS NULL
    WHERE p.deleted_at IS NULL
  `,
  principalQuery: `
    SELECT
      p.uuid AS permissionUuid,
      p.name AS permissionName,
      p.slug AS permissionSlug,
      p.description AS permissionDescription,
      p.created_at AS permissionCreatedAt,
      p.updated_at AS permissionUpdatedAt
    FROM permissions p
    INNER JOIN role_permissions rp ON p.permission_id = rp.permission_id AND rp.deleted_at IS NULL
    WHERE p.deleted_at IS NULL
  `,
  principalQueryWithIds: `
    SELECT
      p.permission_id AS permissionId,
      p.uuid AS permissionUuid,
      p.name AS permissionName,
      p.slug AS permissionSlug,
      p.description AS permissionDescription,
      p.created_at AS permissionCreatedAt,
      p.updated_at AS permissionUpdatedAt
    FROM permissions p
    INNER JOIN role_permissions rp ON p.permission_id = rp.permission_id AND rp.deleted_at IS NULL
    WHERE p.deleted_at IS NULL
  `
}

module.exports = class RoleRepository {
  static async listAll (args = {}) {
    const tenant = args.tenant
    const role = args.role
    const withIds = args.withIds || false

    return Promise.resolve()
      .then(async () => {
        const queryOptions = generateOptions(args.filter)

        const fixedWhereCriteria = []
        const fixedWhereValues = {}

        fixedWhereCriteria.push('rp.tenant_id = :tenantId')
        fixedWhereValues.tenantId = tenant.tenantId

        fixedWhereCriteria.push('rp.role_id = :roleId')
        fixedWhereValues.roleId = role.roleId

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
    const role = args.role
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
          ret.addMessage(res.__('Id inválido.'))
          throw ret
        }

        const query = `
          ${withIds ? localFilters.principalQueryWithIds : localFilters.principalQuery}
          AND rp.tenant_id = :tenantId
          AND rp.role_id = :roleId
          AND p.uuid = :permissionUuid;
        `

        const values = {
          roleId: role.roleId,
          tenantId: tenant.tenantId,
          permissionUuid: uuid
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
    const role = args.role

    return Promise.resolve({})
      .then(async () => {
        // Recebemos as variáveis
        const { permissionUuid } = fields

        if (!validator(res, ret, {
          permissionUuid
        }, {
          permissionUuid: 'required|uuid'
        })) {
          ret.setError(true)
          ret.setCode(400)
          ret.addMessage(res.__('Verifique todos os campos.'))
          throw ret
        }

        return {
          fields: {
            permissionUuid
          }
        }
      })
      // Verificamos se o registro existe
      .then(async next => {
        const permission = await conn.getOne(`
          SELECT permission_id AS permissionId
          FROM permissions
          WHERE deleted_at IS NULL
          AND uuid = ?
          LIMIT 1;
        `, [
          next.fields.permissionUuid
        ])

        if (!permission) {
          ret.setCode(400)
          ret.setFieldError('permissionUuid', true)
          ret.addFieldMessage('permissionUuid', res.__('Permissão não encontrada.'))
          ret.addMessage(res.__('Verifique todos os campos.'))
          throw ret
        }

        next.fields.permissionId = permission.permissionId

        return next
      })
      // Verificamos se o registro já esta associado ao perfil
      .then(async next => {
        const rolePermission = await conn.getOne(`
          SELECT p.permission_id AS permissionId
          FROM permissions p
          INNER JOIN role_permissions rp ON p.permission_id = rp.permission_id AND rp.deleted_at IS NULL
          WHERE p.deleted_at IS NULL
          AND rp.role_id = :roleId
          AND rp.tenant_id = :tenantId
          AND p.uuid = :permissionUuid
          LIMIT 1;
        `, {
          roleId: role.roleId,
          tenantId: tenant.tenantId,
          permissionUuid: next.fields.permissionUuid
        })

        if (rolePermission) {
          ret.setCode(400)
          ret.setFieldError('permissionUuid', true)
          ret.addFieldMessage('permissionUuid', res.__('Esta permissão já está associada a este perfil.'))
          ret.addMessage(res.__('Verifique todos os campos.'))
          throw ret
        }

        return next
      })
      // Vamos associar a permissão ao perfil
      .then(async next => {
        const rolePermissionId = await conn.insert(`
          INSERT INTO role_permissions (tenant_id, role_id, permission_id)
          VALUES (?, ?, ?);
        `, [
          tenant.tenantId,
          role.roleId,
          next.fields.permissionId
        ])

        if (!rolePermissionId) {
          ret.setCode(400)
          ret.addMessage(res.__('Erro ao associar permissão ao perfil.'))
          throw ret
        }

        return await this.findByUuid({
          req,
          res,
          uuid: next.fields.permissionUuid,
          role,
          tenant
        })
      })
  }

  static async delete (args = {}) {
    const req = args.req
    const res = args.res
    const ret = req.ret()
    const tenant = args.tenant
    const role = args.role
    const rolePermission = args.rolePermission

    return Promise.resolve()
      .then(async () => {
        // Vamos deletar o registro
        try {
          await conn.update(`
            UPDATE role_permissions
            SET deleted_at = NOW()
            WHERE tenant_id = :tenantId
            AND role_id = :roleId
            AND permission_id = :permissionId
            LIMIT 1;
          `, {
            roleId: role.roleId,
            tenantId: tenant.tenantId,
            permissionId: rolePermission.permissionId
          })
        } catch (error) {
          ret.setCode(400)
          ret.addMessage(res.__('Erro ao remover permissão do perfil.'))
          ret.addMessage(error.message)
          throw ret
        }

        return await this.findByUuid({
          req,
          res,
          uuid: rolePermission.permissionUuid,
          role,
          tenant
        })
      })
  }
}
