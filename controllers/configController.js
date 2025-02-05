const { config } = require('../models');

module.exports = {
  findByProject: ({ query: { project } }, res) => {
    const regexProject = new RegExp(project, 'i')
    config
      .find({ project: regexProject})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
