module.exports = (req, res) => {
  const selectedProject = req.selectedProject

  res.render('app/project/home', {
    page: 'project-home',
    selectedProject
  })
}
