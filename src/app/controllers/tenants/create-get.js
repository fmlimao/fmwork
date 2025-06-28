module.exports = (req, res) => {
  res.render('app/tenants/form', {
    page: 'tenants-create',
    tenant: null,
    user: req.user,
    pageTitle: 'Projetos FM - Novo Inquilino',
    pageShortTitle: 'PFM',
    layout: 'app/layout/index'
  })
}
