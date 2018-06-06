const mongoose = require('mongoose');

const ycfSchema = mongoose.Schema({
	//-- year of service
	y: Number,
	//-- committee title
	c: String,
	//-- person binding to the "people" collection
	f: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'people'
	},
	//-- person's name
	name: String,
	//-- ex-officio flag
	x: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('ycf', ycfSchema, 'ycf');
