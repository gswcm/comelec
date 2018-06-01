const router = require('express').Router();
const restler = require('restler');
const ObjectId = require('mongodb').ObjectId;
const People = require('../models/people');
const Committee = require('../models/committee');
const YCF = require('../models/ycf');

router.get('/list', async (req,res) => {
	try {
		const committees = await Committee.find({active:true}).sort({title:1});
		res.json(committees);
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

module.exports = router;
