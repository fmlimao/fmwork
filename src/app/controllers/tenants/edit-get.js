const conn = require('../../../database/conn-mysql')

module.exports = async (req, res) => {
  try {
    const tenantId = req.params.id

    // Busca o inquilino
    const [tenants] = await conn.execute(
      'SELECT * FROM tenants WHERE tenant_id = ? AND deleted_at IS NULL',
      [tenantId]
    )

    if (tenants.length === 0) {
      return res.status(404).render('app/errors/error-404', {
        error: 'Inquilino não encontrado'
      })
    }

    res.render('app/tenants/form', {
      page: 'tenants-edit',
      tenant: tenants[0],
      user: req.user,
      pageTitle: 'Projetos FM - Editar Inquilino',
      pageShortTitle: 'PFM',
      layout: 'app/layout/index'
    })
  } catch (error) {
    console.error('Erro ao buscar inquilino:', error)
    res.status(500).render('app/errors/error-500', {
      error: 'Erro ao buscar inquilino'
    })
  }
}
