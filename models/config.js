const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const configSchema = new Schema(
  {
    project: { type: String, required: true },
    logoURL: { type: String, required: false },
    style: { type: Object, required: false },
    manifest: { type: Object, required: true },
    map: { type: Object, required: false }
  },
  { collection: 'configs' }
);

const config = mongoose.model('configs', configSchema);

module.exports = config;
