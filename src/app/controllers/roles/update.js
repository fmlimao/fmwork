module.exports = (req, res) => {
  res.render('app/roles/update', {
    page: 'roles-update',
    tenantUuid: req.params.tenantUuid,
    roleUuid: req.params.roleUuid
  })
}
