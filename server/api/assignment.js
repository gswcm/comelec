const router = require('express').Router();
const ObjectId = require('mongodb').ObjectId;
const Assignment = require('../models/assignment');

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
		let warning = assignments.reduce((a,i) => a || !i.people.length, false);
		res.json({warning});
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

module.exports = router;
