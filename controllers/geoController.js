const { geo } = require('../models');

module.exports = {
  findByProjectAndType: ({ query: { project, geoType } }, res) => {
    const regexProject = new RegExp(project, 'i');
    const regexGeoType = new RegExp(geoType, 'i');
    console.log(project, geoType);
    geo
      .find({ 
        project: regexProject,
        geoType: regexGeoType
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};