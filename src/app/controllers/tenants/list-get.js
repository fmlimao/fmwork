const conn = require('../../../database/conn-mysql')

module.exports = async (req, res) => {
  try {
    // Busca todos os inquilinos não deletados
    const [tenants] = await conn.execute(
      'SELECT * FROM tenants WHERE deleted_at IS NULL ORDER BY name ASC'
    )

    res.render('app/tenants/list', {
      page: 'tenants',
      tenants,
      user: req.user,
      pageTitle: 'Projetos FM - Inquilinos',
      pageShortTitle: 'PFM',
      layout: 'app/layout/index'
    })
  } catch (error) {
    console.error('Erro ao buscar inquilinos:', error)
    res.status(500).render('app/errors/error-500', {
      error: 'Erro ao buscar inquilinos'
    })
  }
}
