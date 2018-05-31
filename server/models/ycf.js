const mongoose = require('mongoose');

const ycfSchema = mongoose.Schema({
	y: Number,
	c: String,
	f: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'people'
	},
	name: String
});

module.exports = mongoose.model('ycf', ycfSchema, 'ycf');
