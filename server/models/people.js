const mongoose = require('mongoose');

const peopleSchema = mongoose.Schema({
	f: String,
	query: String,
	firstName: String,
	lastName: String,
	email: String,
	dept: String
})
.index({ email: 1 });

module.exports = mongoose.model('people', peopleSchema, 'people');
