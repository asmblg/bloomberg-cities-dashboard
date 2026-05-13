const router = require('express').Router();
const { configController } = require('../controllers');

router.route('/').get(configController.findByProject);
router.route('/languages').get(configController.getLanguages);

module.exports = router;
