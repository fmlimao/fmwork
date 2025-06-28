const conn = require('../../../database/conn-mysql')

module.exports = async (req, res) => {
  try {
    const tenantId = req.params.id

    // Verifica se o inquilino existe
    const [tenants] = await conn.execute(
      'SELECT tenant_id FROM tenants WHERE tenant_id = ? AND deleted_at IS NULL',
      [tenantId]
    )

    if (tenants.length === 0) {
      return res.status(404).json({
        error: true,
        messages: ['Inquilino não encontrado']
      })
    }

    // Soft delete do inquilino
    await conn.execute(
      'UPDATE tenants SET deleted_at = NOW() WHERE tenant_id = ?',
      [tenantId]
    )

    res.json({
      error: false
    })
  } catch (error) {
    console.error('Erro ao excluir inquilino:', error)
    res.status(500).json({
      error: true,
      messages: ['Erro ao excluir inquilino. Tente novamente mais tarde.']
    })
  }
}
