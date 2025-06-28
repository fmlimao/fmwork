const conn = require('../../../database/conn-mysql')
const filters = require('../../../helpers/filters')
const generateOptions = require('../../../helpers/generate-options')
// const validator = require('../helpers/validator')

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
  `
}

module.exports = class TenantRepository {
  static async listAll (args = {}) {
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

  // static async findByUuid (args = {}) {
  //   const res = args.res
  //   const ret = args.ret
  //   const uuid = args.uuid

  //   return Promise.resolve()
  //     .then(() => {
  //       if (!validator(res, null, {
  //         uuid
  //       }, {
  //         uuid: 'required|uuid'
  //       })) {
  //         ret.setError(true)
  //         ret.setCode(400)
  //         ret.addMessage(res.__('Id inválido.'))
  //         throw ret
  //       }

  //       const query = `
  //         ${localFilters.principalQuery}
  //         AND u.uuid = :uuid;
  //       `

  //       const values = {
  //         uuid
  //       }

  //       return conn.getOne(query, values)
  //     })
  // }

  // static async create (args = {}) {
  //   const req = args.req
  //   const res = args.res
  //   const ret = args.ret
  //   const fields = args.fields

  //   return Promise.resolve()
  //     .then(async () => {
  //       // Recebemos as variáveis
  //       const { name, phoneNumber, email, password } = fields

  //       if (!validator(res, ret, {
  //         name,
  //         phoneNumber,
  //         email,
  //         password
  //       }, {
  //         name: 'required|string|min:3|max:255',
  //         phoneNumber: 'string|min:10|max:11',
  //         email: 'required|email|min:3|max:255',
  //         password: 'string|min:6|max:255'
  //       })) {
  //         ret.setError(true)
  //         ret.setCode(400)
  //         ret.addMessage(res.__('Verifique todos os campos.'))
  //         throw ret
  //       }

  //       return {
  //         fields: {
  //           name,
  //           phoneNumber,
  //           email,
  //           password
  //         }
  //       }
  //     })
  //     // Verificamos se o usuário já existe
  //     .then(async next => {
  //       const user = await conn.getOne(`
  //         SELECT uuid, name, email
  //         FROM users
  //         WHERE deleted_at IS NULL
  //         AND email = ?
  //         LIMIT 1;
  //       `, [
  //         next.fields.email
  //       ])

  //       if (user) {
  //         ret.setCode(400)
  //         ret.setFieldError('email', true)
  //         ret.addFieldMessage('email', res.__('Já temos um usuário com este e-mail.'))
  //         ret.addMessage(res.__('Verifique todos os campos.'))
  //         throw ret
  //       }

  //       return next
  //     })
  //     // Vamos criar o usuário
  //     .then(async next => {
  //       const uuid = await conn.uuid()

  //       if (next.fields.password) {
  //         const salt = bcrypt.genSaltSync(10)
  //         next.fields.password = bcrypt.hashSync(next.fields.password, salt)
  //       }

  //       const userId = await conn.insert(`
  //         INSERT INTO users (uuid, name, phone_number, email, password)
  //         VALUES (?, ?, ?, ?, ?);
  //       `, [
  //         uuid,
  //         next.fields.name,
  //         next.fields.phoneNumber || null,
  //         next.fields.email,
  //         next.fields.password || null
  //       ])

  //       if (!userId) {
  //         ret.setCode(400)
  //         ret.addMessage(res.__('Erro ao cadastrar usuário.'))
  //         throw ret
  //       }

  //       return this.findByUuid({
  //         req,
  //         res,
  //         ret,
  //         uuid
  //       })
  //     })
  // }

  // static async update (args = {}) {
  //   const req = args.req
  //   const res = args.res
  //   const ret = args.ret
  //   const uuid = args.uuid
  //   const fields = args.fields

  //   return Promise.resolve()
  //     .then(async () => {
  //       // Recebemos as variáveis
  //       const { name, phoneNumber, email, password, active } = fields

  //       let fieldCount = 0
  //       const updateFields = {}
  //       const updateValidates = {}

  //       if (name !== undefined) {
  //         fieldCount++
  //         updateFields.name = name
  //         updateValidates.name = 'required|string|min:3|max:255'
  //       }

  //       if (phoneNumber !== undefined) {
  //         fieldCount++
  //         updateFields.phoneNumber = phoneNumber
  //         updateValidates.phoneNumber = 'string|min:10|max:11'
  //       }

  //       if (email !== undefined) {
  //         fieldCount++
  //         updateFields.email = email
  //         updateValidates.email = 'required|email|min:3|max:255'
  //       }

  //       if (password !== undefined) {
  //         fieldCount++
  //         updateFields.password = password
  //         updateValidates.password = 'required|string|min:6|max:255'
  //       }

  //       if (active !== undefined) {
  //         fieldCount++
  //         updateFields.active = active
  //         updateValidates.active = 'required|integer|between:0,1'
  //       }

  //       if (!fieldCount) {
  //         ret.setError(true)
  //         ret.setCode(400)
  //         ret.addMessage(res.__('Nenhum campo foi informado.'))
  //         throw ret
  //       }

  //       if (!validator(res, ret, updateFields, updateValidates)) {
  //         ret.setError(true)
  //         ret.setCode(400)
  //         ret.addMessage(res.__('Verifique todos os campos.'))
  //         throw ret
  //       }

  //       updateFields.phone_number = updateFields.phoneNumber
  //       delete updateFields.phoneNumber

  //       return {
  //         fields: updateFields
  //       }
  //     })
  //     // Verificamos se o usuário já existe
  //     .then(async next => {
  //       if (next.fields.email) {
  //         const userExists = await conn.getOne(`
  //           SELECT uuid, name, email
  //           FROM users
  //           WHERE deleted_at IS NULL
  //           AND email = ?
  //           AND uuid != ?
  //           LIMIT 1;
  //         `, [
  //           next.fields.email,
  //           uuid
  //         ])

  //         if (userExists) {
  //           ret.setCode(400)
  //           ret.setFieldError('email', true)
  //           ret.addFieldMessage('email', res.__('Já temos um usuário com este e-mail.'))
  //           ret.addMessage(res.__('Verifique todos os campos.'))
  //           throw ret
  //         }
  //       }

  //       return next
  //     })
  //     // Se o password foi informado, vamos criptografar
  //     .then(async next => {
  //       if (next.fields.password) {
  //         const salt = bcrypt.genSaltSync(10)
  //         next.fields.password = bcrypt.hashSync(next.fields.password, salt)
  //       }

  //       return next
  //     })
  //     // Vamos atualizar o usuário
  //     .then(async next => {
  //       try {
  //         await conn.update(`
  //           UPDATE users
  //           SET ${Object.keys(next.fields).map(key => `${key} = :${key}`).join(', ')},
  //           updated_at = NOW()
  //           WHERE uuid = :uuid
  //           LIMIT 1;
  //         `, Object.assign({}, next.fields, {
  //           uuid
  //         }))
  //       } catch (error) {
  //         ret.setCode(400)
  //         ret.addMessage(res.__('Erro ao atualizar usuário.'))
  //         ret.addMessage(error.message)
  //         throw ret
  //       }

  //       return this.findByUuid({
  //         req,
  //         res,
  //         ret,
  //         uuid
  //       })
  //     })
  // }

  // static async delete (args = {}) {
  //   const req = args.req
  //   const res = args.res
  //   const ret = args.ret
  //   const uuid = args.uuid

  //   return Promise.resolve()
  //     .then(async () => {
  //       // Vamos deletar o usuário
  //       try {
  //         await conn.update(`
  //           UPDATE users
  //           SET deleted_at = NOW()
  //           WHERE uuid = :uuid
  //           LIMIT 1;
  //         `, {
  //           uuid
  //         })
  //       } catch (error) {
  //         ret.setCode(400)
  //         ret.addMessage(res.__('Erro ao deletar usuário.'))
  //         ret.addMessage(error.message)
  //         throw ret
  //       }

  //       const user = await this.findByUuid({
  //         req,
  //         res,
  //         ret,
  //         uuid
  //       })

  //       return user
  //     })
  // }
}
