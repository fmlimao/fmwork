module.exports = (req, res) => {
  const selectedProject = req.selectedProject

  res.render('app/project/users', {
    page: 'project-users',
    selectedProject
  })
}
