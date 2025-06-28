const gravatar = require('gravatar')
const md5 = require('md5')

module.exports = (req, res) => {
  // Gera a URL do Gravatar
  const gravatarUrl = gravatar.url(req.user.email, {
    s: '200', // tamanho
    r: 'g', // rating
    d: 'mp' // default image
  })

  res.render('app/my-account', {
    user: req.user,
    pageTitle: 'Projetos FM - Minha Conta',
    pageShortTitle: 'PFM',
    layout: 'app/layout/index',
    gravatarUrl,
    md5
  })
}
