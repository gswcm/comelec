const mongoose = require('mongoose');

const peopleSchema = mongoose.Schema({
	f: String,
	query: String,
	firstName: String,
	lastName: String,
	email: String,
	dept: String
})
.index(
	{
		email: 1,
		firstName: 'text',
		lastName: 'text'
	},
	{
		weights: {
			lastName: 3,
			firstName: 1
		},
		name: 'people_email_name_index'
	}
);

module.exports = mongoose.model('people', peopleSchema, 'people');
