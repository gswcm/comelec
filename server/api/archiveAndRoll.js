const router = require('express').Router();
const moment = require('moment');
const ObjectId = require('mongodb').ObjectId;
const YCF = require('../models/ycf');
const Assignment = require('../models/assignment');
const Service = require('../models/service');

router.patch('/history', async (req,res) => {
	try {
		if(!req.session.authenticated) {
			// Unauthorized
			throw new Error('Unauthorized access');
		}
		const thisYear = moment().format('YYYY');
		//-- Remove all records for this year
		await YCF.remove({y: thisYear});
		//-- Find all records in most recently published assignment
		const { submission } = await Assignment.findOne({published: true}).sort({createdAt: -1}).limit(1);
		//-- Extract YCF data and populate YCF collection
		const ycf = await Promise.all(submission.map(e => {
			return e.people.map(p =>
				new YCF({
					y: parseInt(thisYear),
					c: e.committee.title,
					f: ObjectId(p.id),
					x: p.x,
					name: p.name
				}).save()
			)
		}).reduce((a,i) => [...a,...i],[]));
		res.json({
			ycf, thisYear
		});
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

router.post('/roll', async (req,res) => {
	try {
		if(!req.session.authenticated) {
			// Unauthorized
			throw new Error('Unauthorized access');
		}
		res.json(await Service.remove());
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

module.exports = router;
