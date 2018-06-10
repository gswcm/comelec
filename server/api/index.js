const router = require('express').Router();

// API Routes
router.use('/user', require('./user'));
router.use('/service', require('./service'));
router.use('/email', require('./email'));
router.use('/directory', require('./directory'));

module.exports = router;
