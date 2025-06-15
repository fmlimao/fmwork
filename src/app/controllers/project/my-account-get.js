module.exports = (req, res) => {
  const selectedProject = req.selectedProject

  res.render('app/project/my-account', {
    page: 'project-my-account',
    selectedProject
  })
}
