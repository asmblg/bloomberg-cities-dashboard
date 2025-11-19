require('dotenv').config();
const { config } = require('../models');


module.exports = {
  findByProject: ({ query: { project, lng } }, res) => {
    // const localMode = process.env.CONFIG_MODE === 'local';
    const localConfigPath = process.env.LOCAL_CONFIG_PATH;
    if (localConfigPath) {
      const localConfig = require(localConfigPath);
      // console.log('localConfig', localConfig);
      const obj = localConfig.find(
        ({ project: p, lng: l }) => p.toLowerCase() === project.toLowerCase() && (!lng || l === lng)
      );
      // console.log('obj', obj);
      res.json([obj]);
      // const regexProject = new RegExp(project, 'i')
      // const obj = config.find(({ project }) => project.match(regexProject));
      // res.json(obj);
    } else {
      const regexProject = new RegExp(project, 'i')
      if (!project) {
        return res.status(400).json({
          error: 'Please provide a project'
        });
      } else {
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
  }
};
