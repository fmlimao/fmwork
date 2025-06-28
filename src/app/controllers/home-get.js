module.exports = (req, res) => {
  res.render('app/home', {
    user: req.user,
    pageTitle: 'Projetos FM',
    pageShortTitle: 'PFM',
    layout: 'app/layout/index'
  })
}
