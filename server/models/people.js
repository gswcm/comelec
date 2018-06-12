const mongoose = require('mongoose');

const peopleSchema = mongoose.Schema({
	f: String,
	query: String,
	firstName: String,
	lastName: String,
	email: String,
	dept: String,
	isAdmin: {
		type: Boolean,
		default: false
	}
})
.index(
	{
		email: 1
	},
	{
		name: 'people_email_index'
	}
)
.index(
	{
		firstName: 'text',
		lastName: 'text'
	},
	{
		weights: {
			lastName: 3,
			firstName: 1
		},
		name: 'people_name_index'
	}
);

module.exports = mongoose.model('people', peopleSchema, 'people');
