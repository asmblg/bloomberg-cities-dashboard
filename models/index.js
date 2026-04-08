const { getConnection } = require('../db/connections');
const { getDataModel } = require('./data');
const { getConfigModel } = require('./config');
const { getGeoModel } = require('./geo');

const parseStagingFlag = value => value === 'true';

const getModels = ({ staging = false } = {}) => {
  const connection = getConnection({ staging });

  return {
    data: getDataModel(connection),
    config: getConfigModel(connection),
    geo: getGeoModel(connection)
  };
};

const getModelsForRequest = req =>
  getModels({ staging: parseStagingFlag(req?.query?.staging) });

module.exports = {
  getModels,
  getModelsForRequest,
  parseStagingFlag
};