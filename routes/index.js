// const path = require('path');
const router = require('express').Router();
const dataRoutes = require('./data');
const configRoutes = require('./config');
const geoRoutes = require('./geo')

router.use('/data', dataRoutes);
router.use('/config', configRoutes);
router.use('/geo', geoRoutes);

router.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  let msg = err.message;
  // If we are in production, override the message we
  // expose to the client (for security reasons)
  if (process.env.NODE_ENV === 'production') {
    msg = 'Internal server error';
  }
  if (err.statusCode === 500) {
    console.error(err);
  }
  res.status(err.statusCode).json({
    error: msg
  });
});

module.exports = router;
