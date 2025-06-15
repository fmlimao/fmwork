module.exports = (req, res) => {
  const selectedProject = req.selectedProject

  res.render('app/project/profiles', {
    page: 'project-profiles',
    selectedProject
  })
}
