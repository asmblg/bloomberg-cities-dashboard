const {data} = require('../models');

module.exports = {
  findByProject: ({query: {project, select}}, res) => {
    console.log('\nGetting Data for', project )
    console.log('Selecting', select);
    const regexProject = new RegExp(project, 'i')
    if (!project) {
      return res.status(400).json({message: 'Project name is required'})
    }
    
    data.find({project: regexProject})
      .select(`project ${select || 'data'}`)
      .limit(1)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
}
