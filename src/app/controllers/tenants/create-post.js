const conn = require('../../../database/conn-mysql')

module.exports = async (req, res) => {
  try {
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

    // Verifica se já existe um inquilino com o mesmo domínio
    const [existingTenant] = await conn.execute(
      'SELECT tenant_id FROM tenants WHERE domain = ? AND deleted_at IS NULL',
      [domain]
    )

    if (existingTenant.length > 0) {
      return res.status(400).json({
        error: true,
        messages: ['Já existe um inquilino com este domínio']
      })
    }

    // Insere o novo inquilino
    const [result] = await conn.execute(
      'INSERT INTO tenants (name, domain, active, created_at) VALUES (?, ?, ?, NOW())',
      [name, domain, active ? 1 : 0]
    )

    res.json({
      error: false,
      tenant_id: result.insertId
    })
  } catch (error) {
    console.error('Erro ao criar inquilino:', error)
    res.status(500).json({
      error: true,
      messages: ['Erro ao criar inquilino. Tente novamente mais tarde.']
    })
  }
}
