const router = require('express').Router();
const ObjectId = require('mongodb').ObjectId;
const Service = require('../models/service');
const Token = require('../models/token');

router.get('/', async (req,res) => {
	try {
		const { action, uuid } = req.query;
		//-- Validate query params
		if(action !== 'confirm') {
			throw new Error('Invalid action parameter');
		}
		const token = await Token.findOne({uuid});
		if(!token) {
			throw new Error('Invalid UUID parameter');
		}
		//-- Update all records referenced in Target array
		await Service.update({
			_id: {
				$in: token.target.map(e => ObjectId(e))
			}
		},{
			$set: {
				confirmed: true
			}
		},{
			multi: true
		});
		//-- Remove token
		// await token.remove();
		res.json({ok:1});
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

module.exports = router;
