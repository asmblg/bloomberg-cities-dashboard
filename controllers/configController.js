require('dotenv').config();
const { getModelsForRequest } = require('../models');


module.exports = {
  findByProject: (req, res) => {
    const { project, lng } = req.query;
    // const localMode = process.env.CONFIG_MODE === 'local';
    const localConfigPath = process.env.LOCAL_CONFIG_PATH;
    if (localConfigPath) {
      const localConfig = require(localConfigPath);
      // console.log('localConfig', localConfig);
      const obj = localConfig.find(
        ({ project: p, lng: l }) => 
          p.toLowerCase() === project.toLowerCase() && 
        (!lng ? !l : l === lng)
      );
      // console.log('Local config obj:', obj);
      res.json([obj]);
      // const regexProject = new RegExp(project, 'i')
      // const obj = config.find(({ project }) => project.match(regexProject));
      // res.json(obj);
    } else {
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

        const regexProject = new RegExp(project, 'i')

        config
          .find({ 
            project: regexProject,
            lng: lng ? lng : { $exists: false}
          })
          .limit(1)
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err));
      }
    }
  },

  getLanguages: (req, res) => {
    const { project } = req.query;
    const localConfigPath = process.env.LOCAL_CONFIG_PATH;

    if (!project) {
      return res.status(400).json({
        error: 'Please provide a project'
      });
    }

    if (localConfigPath) {
      const localConfig = require(localConfigPath);
      const languages = localConfig
        .filter(({ project: p }) => p.toLowerCase() === project.toLowerCase())
        .map(({ lng }) => lng || null)
        .filter((lng, index, self) => self.indexOf(lng) === index) // unique
        .sort();
      
      res.json({ languages });
    } else {
      let config;

      try {
        ({ config } = getModelsForRequest(req));
      } catch (err) {
        return res.status(503).json({ message: err.message });
      }

      const regexProject = new RegExp(project, 'i');

      config
        .distinct('lng', { project: regexProject })
        .then(languages => {
          res.json({
            languages: languages.sort()
          });
        })
        .catch(err => res.status(422).json(err));
    }
  }
};
