const conn = require('../../../database/conn-mysql')

module.exports = async (req, res) => {
  try {
    const tenantId = req.params.id
    const { name, domain, active } = req.body

    // Validações
    const errors = []
    if (!name) errors.push('O nome é obrigatório')
    if (!domain) errors.push('O domínio é obrigatório')

    if (errors.length > 0) {
      return res.status(400).json({
        error: true,
        messages: errors
      })
    }

    // Verifica se já existe outro inquilino com o mesmo domínio
    const [existingTenant] = await conn.execute(
      'SELECT tenant_id FROM tenants WHERE domain = ? AND tenant_id != ? AND deleted_at IS NULL',
      [domain, tenantId]
    )

    if (existingTenant.length > 0) {
      return res.status(400).json({
        error: true,
        messages: ['Já existe outro inquilino com este domínio']
      })
    }

    // Atualiza o inquilino
    await conn.execute(
      'UPDATE tenants SET name = ?, domain = ?, active = ?, updated_at = NOW() WHERE tenant_id = ?',
      [name, domain, active ? 1 : 0, tenantId]
    )

    res.json({
      error: false
    })
  } catch (error) {
    console.error('Erro ao atualizar inquilino:', error)
    res.status(500).json({
      error: true,
      messages: ['Erro ao atualizar inquilino. Tente novamente mais tarde.']
    })
  }
}
