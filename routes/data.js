const router = require('express').Router();
const {dataController} = require('../controllers');

router.route('/')
  .get(dataController.findByProject)

module.exports = router;