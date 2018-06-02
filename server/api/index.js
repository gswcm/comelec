const router = require('express').Router();

// API Routes
router.use('/user', require('./user'));
router.use('/service', require('./service'));

module.exports = router;
