const router = require('express').Router();
const { aboutController } = require('../controllers');

router.route('/').get(aboutController.getVariables);

module.exports = router;
