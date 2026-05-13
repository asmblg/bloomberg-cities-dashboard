const router = require('express').Router();

const dataRoutes = require('./data');
const configRoutes = require('./config');
const geoRoutes = require('./geo');

const allowedOrigins = new Set([
  'http://localhost:3001',
  'http://localhost:4173',
  'http://localhost:5173',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:4173',
  'http://127.0.0.1:5173',
  'https://bloomberg-cities-dashboard-eu-eb6aebd069f7.herokuapp.com'
]);

const restrictUiOrigin = (req, res, next) => {
  const origin = req.get('origin');

  if (!origin || allowedOrigins.has(origin)) {
    return next();
  }

  return res.status(403).json({
    error: 'Origin not allowed for UI routes'
  });
};

router.use(restrictUiOrigin);
router.use('/data', dataRoutes);
router.use('/config', configRoutes);
router.use('/geo', geoRoutes);

module.exports = router;