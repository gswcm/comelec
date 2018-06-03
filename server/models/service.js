const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
	person: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'people'
		},
		name: String,
		email: String
	},
	committees: [{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'committee'
		},
		title: String
	}],
	createdAt: {
		type: Date,
		default: Date.now,
	},
	confirmed: {
		type: Boolean,
		default: false
	},
})

module.exports = mongoose.model('service', serviceSchema, 'service');
