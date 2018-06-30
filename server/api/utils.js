const router = require('express').Router();

router.get('/', async (req,res) => {
	try {
		res.json({
			url: `${req.protocol}://${req.get('host')}`
		});
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

module.exports = router;
