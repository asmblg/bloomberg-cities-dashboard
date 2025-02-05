const {data} = require('../models');

module.exports = {
  findByProject: ({query: {project, select}}, res) => {
    console.log('\nGetting Data for', project )
    console.log('Selecting', select);
    const regexProject = new RegExp(project, 'i')
    data.find({project: regexProject})
      .select(`project ${select || 'data'}`)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
}
