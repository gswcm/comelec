const router = require('express').Router();
const ObjectId = require('mongodb').ObjectId;
const Committee = require('../models/committee');
const Service = require('../models/service');
const Token = require('../models/token');

router.get('/', async (req,res) => {
	try {
		const { action, uuid } = req.query;
		if(action !== 'confirm') {
			throw new Error('Invalid action parameter');
		}
		const token = await Token.findOne({uuid});
		if(!token) {
			throw new Error('Invalid UUID parameter');
		}
		//await Service.update({''})

		res.json(committees);
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

module.exports = router;
