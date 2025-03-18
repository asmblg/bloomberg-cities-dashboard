const { geo } = require('../models');

module.exports = {
  findByProjectAndType: ({ query: { project, geoType } }, res) => {
    const regexProject = new RegExp(project, 'i');
    const regexGeoType = new RegExp(geoType, 'i');
    console.log(project, geoType);
    if (!project || !geoType) {
      return res.status(400).json({
        error: 'Please provide a project and geoType'
      });
    } else {
      geo
      .find({ 
        project: regexProject,
        geoType: regexGeoType
      })
      .limit(1)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
    }
  }
};