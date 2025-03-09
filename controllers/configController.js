require('dotenv').config();
const { config } = require('../models');


module.exports = {
  findByProject: ({ query: { project } }, res) => {
    const localMode = process.env.CONFIG_MODE === 'local';
    if (localMode) {
      const localConfig = require(`../dev/dev-configs.json`);
      // console.log('localConfig', localConfig);
      const obj = localConfig.find(
        ({ project }) => project.toLowerCase() === project.toLowerCase()
      );
      // console.log('obj', obj);
      res.json([obj]);
      // const regexProject = new RegExp(project, 'i')
      // const obj = config.find(({ project }) => project.match(regexProject));
      // res.json(obj);
    } else {
    const regexProject = new RegExp(project, 'i')
    config
      .find({ project: regexProject})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
    }
  }
};
