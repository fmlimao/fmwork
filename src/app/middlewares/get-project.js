module.exports = (req, res, next) => {
  req.selectedProject = {
    uuid: '1dfb7cc4-7a73-4dec-a0ee-1f876d457a4d',
    name: 'Projetos FM',
    description: 'Este é um projeto de exemplo para demonstração.',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  next()
}
