const loginGet = (req, res) => {
  res.render('app/auth/login', {
    layout: false
  })
}

const logoutGet = (req, res) => {
  res.redirect('/app/login')
}

const forgotPasswordGet = (req, res) => {
  res.render('app/auth/forgot-password', {
    layout: false
  })
}

const projectSelectGet = (req, res) => {
  res.render('app/auth/project-select', {
    layout: false
  })
}

module.exports = {
  loginGet,
  logoutGet,
  forgotPasswordGet,
  projectSelectGet
}
