const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
  project: {type: String, required: true},
  data: {type: Object, required: true}
}, {collection: 'data'});

const getDataModel = connection =>
  connection.models.data || connection.model('data', dataSchema);

module.exports = {
  getDataModel,
  dataSchema
};