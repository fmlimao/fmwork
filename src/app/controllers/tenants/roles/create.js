module.exports = (req, res) => {
  res.render('app/tenants/roles/create', {
    page: 'roles-create',
    tenantUuid: req.params.tenantUuid
  })
}
