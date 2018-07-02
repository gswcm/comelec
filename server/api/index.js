const router = require('express').Router();

// API Routes
router.use('/user', require('./user'));
router.use('/service', require('./service'));
router.use('/email', require('./email'));
router.use('/directory', require('./directory'));
router.use('/auth', require('./auth'));
router.use('/assignment', require('./assignment'));
router.use('/utils', require('./utils'));
router.use('/anr', require('./archiveAndRoll'));

module.exports = router;
