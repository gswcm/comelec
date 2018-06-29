const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema({

	createdAt: {
		type: Date,
		default: Date.now,
	},
	createdBy: {
		type: String,
		default: ''
	},
	published: {
		type: Boolean,
		default: false
	},
	submission: [{
		committee: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'committee'
			},
			title: String
		},
		people: [{
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'people'
			},
			email: String,
			name: String,
			x: {
				type: Boolean,
				default: false
			}
		}]
	}]
})

module.exports = mongoose.model('assignment', assignmentSchema, 'assignment');
