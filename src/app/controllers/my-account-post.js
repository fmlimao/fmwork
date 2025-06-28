const bcrypt = require('bcryptjs')
const conn = require('../../database/conn-mysql')

module.exports = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword, confirmPassword } = req.body

    // Validações básicas
    const errors = []

    if (!name || !name.trim()) {
      errors.push('O nome é obrigatório')
    }

    if (!email || !email.trim()) {
      errors.push('O e-mail é obrigatório')
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push('E-mail inválido')
    }

    // Se informou alguma senha, valida todas
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        errors.push('A senha atual é obrigatória para alterar a senha')
      }
      if (!newPassword) {
        errors.push('A nova senha é obrigatória')
      }
      if (!confirmPassword) {
        errors.push('A confirmação da nova senha é obrigatória')
      }
      if (newPassword !== confirmPassword) {
        errors.push('A nova senha e a confirmação não conferem')
      }
      if (newPassword && newPassword.length < 6) {
        errors.push('A nova senha deve ter no mínimo 6 caracteres')
      }
    }

    if (errors.length) {
      return res.status(400).json({
        error: true,
        messages: errors
      })
    }

    // Verifica se o email já existe para outro usuário
    const [existingUsers] = await conn.execute(
      'SELECT user_id FROM users WHERE email = ? AND user_id != ? AND deleted_at IS NULL',
      [email, req.user.user_id]
    )

    if (existingUsers.length) {
      return res.status(400).json({
        error: true,
        messages: ['Este e-mail já está sendo usado por outro usuário']
      })
    }

    // Se informou senha, valida a senha atual
    if (currentPassword) {
      const passwordMatch = await bcrypt.compare(currentPassword, req.user.password)
      if (!passwordMatch) {
        return res.status(400).json({
          error: true,
          messages: ['Senha atual incorreta']
        })
      }
    }

    // Atualiza o usuário
    const updates = ['name = ?', 'email = ?']
    const params = [name, email]

    if (newPassword) {
      updates.push('password = ?')
      params.push(await bcrypt.hash(newPassword, 10))
    }

    params.push(req.user.user_id)

    await conn.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`,
      params
    )

    res.json({
      error: false,
      messages: ['Dados atualizados com sucesso']
    })
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    res.status(500).json({
      error: true,
      messages: ['Ocorreu um erro ao tentar atualizar os dados. Tente novamente mais tarde.']
    })
  }
}
