require('dotenv').config();

module.exports = {
  getVariables: (req, res) => {
    const { project, lng } = req.query;
    const localConfigPath = process.env.LOCAL_CONFIG_PATH;
    if (localConfigPath) {
      const localConfig = require(localConfigPath);
      const obj = localConfig.find(
        ({ project: p, lng: l }) => 
          p.toLowerCase() === project.toLowerCase() && 
        (!lng ? !l : l === lng)
      );
      res.json(obj ? { variables: obj.variables } : { variables: [] });
    } else {
      const { getModelsForRequest } = require('../models');
      if (!project) {
        return res.status(400).json({
          error: 'Please provide a project'
        });
      } else {
        let config;
        try {
          ({ config } = getModelsForRequest(req));
        } catch (err) {
          return res.status(503).json({ message: err.message });
        }
        const regexProject = new RegExp(project, 'i');
        config
          .findOne({ project: regexProject, lng: lng ? lng : { $exists: false } })
          .then(dbModel => {
            res.json(dbModel ? { variables: dbModel.variables } : { variables: [] });
          })
          .catch(err => res.status(422).json(err));
      }
    }
  }
};
