module.exports = (req, res) => {
  res.render('app/tenants/update', {
    page: 'tenants-update',
    tenantUuid: req.params.uuid
  })
}
