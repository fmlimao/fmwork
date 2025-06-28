const conn = require('../../database/conn-mysql')

const authMiddleware = async (req, res, next) => {
  // Se já estiver na página de login, não precisa verificar
  if (req.path === '/login' || req.path === '/forgot-password') {
    // Se já estiver logado, redireciona para a home
    const userId = req.cookies.userId
    if (userId) {
      return res.redirect('/app')
    }
    return next()
  }

  // Verifica se existe o cookie de autenticação
  const userId = req.cookies.userId
  if (!userId) {
    return res.redirect('/app/login')
  }

  try {
    // Busca o usuário no banco
    const [users] = await conn.execute(
      'SELECT u.*, t.name as tenant_name FROM users u INNER JOIN tenants t ON t.tenant_id = u.tenant_id WHERE u.user_id = ? AND u.deleted_at IS NULL',
      [userId]
    )

    if (!users.length) {
      res.clearCookie('userId')
      return res.redirect('/app/login')
    }

    // Adiciona o usuário no request para uso posterior
    req.user = users[0]
    next()
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error)
    res.clearCookie('userId')
    return res.redirect('/app/login')
  }
}

module.exports = authMiddleware
