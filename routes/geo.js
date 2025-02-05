const router = require('express').Router();
const {geoController} = require('../controllers');

router.route('/')
  .get(geoController.findByProjectAndType)

module.exports = router;