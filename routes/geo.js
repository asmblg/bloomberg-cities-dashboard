const router = require('express').Router();
const {geoController} = require('../controllers');

router.route('/')
  .get(geoController.findByProjectAndType)

router.route('/types')
  .get(geoController.getGeoTypes)

module.exports = router;