const router = require('express').Router();
const apiRoutes = require('./api');
const uiRoutes = require('./ui');

router.use('/api', apiRoutes);
router.use('/ui', uiRoutes);

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
