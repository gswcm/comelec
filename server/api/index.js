const router = require('express').Router();

// API Routes
router.use('/user', require('./user'));
router.use('/committee', require('./committee'));

module.exports = router;
