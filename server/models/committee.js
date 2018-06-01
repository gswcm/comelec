const mongoose = require('mongoose');

const committeeSchema = mongoose.Schema({
	title: String,
	active: Boolean,
	desc: String
});

module.exports = mongoose.model('committee', committeeSchema, 'committee');
