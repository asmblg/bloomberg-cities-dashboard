const { getModelsForRequest } = require('../models');

module.exports = {
  findByProjectAndType: (req, res) => {
    const { project, geoType } = req.query;
    console.log(project, geoType);

    if (!project || !geoType) {
      return res.status(400).json({
        error: 'Please provide a project and geoType'
      });
    } else {
      let geo;

      try {
        ({ geo } = getModelsForRequest(req));
      } catch (err) {
        return res.status(503).json({ message: err.message });
      }

      const regexProject = new RegExp(project, 'i');
      const regexGeoType = new RegExp(geoType, 'i');

      geo
      .find({ 
        project: regexProject,
        geoType: regexGeoType
      })
      .limit(1)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
    }
  },

  getGeoTypes: (req, res) => {
    const { project } = req.query;

    if (!project) {
      return res.status(400).json({
        error: 'Please provide a project'
      });
    }

    let geo;

    try {
      ({ geo } = getModelsForRequest(req));
    } catch (err) {
      return res.status(503).json({ message: err.message });
    }

    const regexProject = new RegExp(project, 'i');

    geo
      .distinct('geoType', { project: regexProject })
      .then(geoTypes => {
        res.json({
          geoTypes: geoTypes.sort() || []
        });
      })
      .catch(err => res.status(422).json(err));
  }
};