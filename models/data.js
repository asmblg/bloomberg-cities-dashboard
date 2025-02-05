const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
  project: {type: String, required: true},
  data: {type: Object, required: true}
}, {collection: 'data'});

const data = mongoose.model('data', dataSchema);

module.exports = data;