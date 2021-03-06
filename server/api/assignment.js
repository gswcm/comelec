const router = require('express').Router();
const ObjectId = require('mongodb').ObjectId;
const Assignment = require('../models/assignment');

router.delete('/', async (req,res) => {
	try {
		if(!req.session.authenticated) {
			// Unauthorized
			throw new Error('Unauthorized access');
		}
		const { id } = req.query;
		const result = await Assignment.remove({_id: ObjectId(id)});
		res.json(result);
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

router.get('/', async (req,res) => {
	try {
		const result = await Assignment.findOne({published: true}).sort({createdAt: -1}).limit(1);
		res.json(result);
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

router.patch('/', async (req,res) => {
	try {
		if(!req.session.authenticated) {
			// Unauthorized
			throw new Error('Unauthorized access');
		}
		const { id, published } = req.body;
		const result = await Assignment.update({_id: ObjectId(id)},{ published });
		res.json(result);
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

router.get('/details', async (req,res) => {
	try {
		const records = await Assignment.find(
			{
				_id: ObjectId(req.query.id)
			},
			{
				_id: 0,
				'submission._id': 0,
				'submission.people._id': 0
			}
		);
		res.json((records && records.length) ? records[0] : null);
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

router.get('/group', async (req,res) => {
	try {
		const records = await Assignment.aggregate([
			{
				$group: {
					_id: '$createdBy',
					ids: {
						$push: {
							createdAt: '$createdAt',
							id: '$_id'
						}
					}
				},
			},
			{
				$project: {
					name: '$_id',
					_id: 0,
					ids: 1
				}
			}
		]);
		res.json(records);
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

router.post('/', async (req,res) => {
	try {
		if(!req.session.authenticated) {
			// Unauthorized
			throw new Error('Unauthorized access');
		}
		const { assignments, contributor } = req.body;
		const record = await new Assignment({
			createdBy: contributor,
			submission: assignments.map(({ committee, people }) => ({
				committee: {
					id: ObjectId(committee.id),
					title: committee.title
				},
				people: people.map(({id, email, name, x}) => ({
					id: ObjectId(id),
					email, name, x
				}))
			}))
		}).save();
		res.json(record._id);
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

module.exports = router;
