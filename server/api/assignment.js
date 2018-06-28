const router = require('express').Router();
const ObjectId = require('mongodb').ObjectId;
const Assignment = require('../models/assignment');

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
		if(!req.session.admin) {
			// Unauthorized
			throw new Error('Unauthorized access');
		}
		const { assignments, contributor } = req.body;
		const record = await new Assignment({
			createdBy: `${contributor.firstName} ${contributor.lastName}`,
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
		res.json(record);
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

module.exports = router;
