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
	},
	isSuperAdmin: {
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
		lastName: 'text',
		dept: 'text'
	},
	{
		weights: {
			lastName: 10,
			dept: 5,
			firstName: 1
		},
		name: 'people_name_dept_index'
	}
);

module.exports = mongoose.model('people', peopleSchema, 'people');
