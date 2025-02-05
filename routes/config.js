const router = require('express').Router();
const { configController } = require('../controllers');

router.route('/').get(configController.findByProject);

module.exports = router;
