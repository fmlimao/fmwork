module.exports = (req, res) => {
  res.render('app/project/my-projects', {
    page: 'project-my-projects',
    selectedProject: null
  })
}
