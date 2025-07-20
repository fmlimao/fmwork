module.exports = (req, res) => {
  res.render('app/roles/create', {
    page: 'roles-create',
    tenantUuid: req.params.tenantUuid
  })
}
