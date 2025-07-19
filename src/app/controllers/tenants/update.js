module.exports = (req, res) => {
  res.render('app/tenants/update', {
    page: 'tenants-update',
    uuid: req.params.uuid
  })
}
