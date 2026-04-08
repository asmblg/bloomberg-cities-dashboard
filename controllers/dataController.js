const { getModelsForRequest } = require('../models');

module.exports = {
  findByProject: (req, res) => {
    const { project, select } = req.query;
    // console.log('\nGetting Data for', project )
    // console.log('Selecting', select);

    if (!project) {
      return res.status(400).json({message: 'Project name is required'})
    }

    let data;

    try {
      ({ data } = getModelsForRequest(req));
    } catch (err) {
      return res.status(503).json({ message: err.message });
    }

    const regexProject = new RegExp(project, 'i')
    
    data.find({project: regexProject})
      .select(`project ${select || 'data'}`)
      .limit(1)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
}
