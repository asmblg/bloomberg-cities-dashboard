const router = require('express').Router();

const dataRoutes = require('./data');
const geoRoutes = require('./geo');
const aboutRoutes = require('./about');

router.use('/v1/data', dataRoutes);
router.use('/v1/geo', geoRoutes);
router.use('/v1/about', aboutRoutes);

module.exports = router;