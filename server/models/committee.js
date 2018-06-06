const mongoose = require('mongoose');

const committeeSchema = mongoose.Schema({
	title: String,
	active: Boolean,
	desc: String,
	exclude: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('committee', committeeSchema, 'committee');
