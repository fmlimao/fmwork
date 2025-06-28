const bcrypt = require('bcryptjs')
const conn = require('../../database/conn-mysql')

const loginGet = (req, res) => {
  res.render('app/auth/login', {
    layout: false,
    pageTitle: 'Projetos FM - Login',
    pageShortTitle: 'PFM'
  })
}

const loginPost = async (req, res) => {
  try {
    const { email, password } = req.body

    // Busca o usuário pelo email
    const [users] = await conn.execute(
      'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL',
      [email]
    )

    if (!users.length) {
      return res.status(401).json({
        error: true,
        messages: ['E-mail ou senha inválidos.']
      })
    }

    const user = users[0]

    // Verifica a senha
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({
        error: true,
        messages: ['E-mail ou senha inválidos.']
      })
    }

    // Define o cookie de autenticação
    res.cookie('userId', user.user_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    })

    res.json({
      error: false,
      messages: ['Login realizado com sucesso!']
    })
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    res.status(500).json({
      error: true,
      messages: ['Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.']
    })
  }
}

const logoutGet = (req, res) => {
  res.clearCookie('userId')
  res.redirect('/app/login')
}

const forgotPasswordGet = (req, res) => {
  res.render('app/auth/forgot-password', {
    layout: false,
    pageTitle: 'Projetos FM - Recuperar Senha',
    pageShortTitle: 'PFM'
  })
}

const projectSelectGet = (req, res) => {
  res.render('app/auth/project-select', {
    layout: false,
    pageTitle: 'Projetos FM - Selecionar Projeto',
    pageShortTitle: 'PFM'
  })
}

module.exports = {
  loginGet,
  loginPost,
  logoutGet,
  forgotPasswordGet,
  projectSelectGet
}
