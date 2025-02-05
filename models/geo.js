const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const geoSchema = new Schema({
  project: {type: String, required: true},
  geoType: {type: String, required: true},
  type: {type: String, required: true},
  features: {type: Array, required: true}
}, {collection: 'geos'});

const geo = mongoose.model('geos', geoSchema);

module.exports = geo;