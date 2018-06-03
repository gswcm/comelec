const mongoose = require('mongoose');
const uuid = require('uuid');

const tokenSchema = mongoose.Schema({
	uuid: String,
	cteatedAt: {
		type: Date,
		default: Date.now,
		expires: '1d'
	},
	target: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'service'
	}]
})
.pre('save', function(next){
	if(!this.uuid) {
		this.uuid = uuid.v4();
	}
	next();
})
.index({
	uuid: 1
});

module.exports = mongoose.model('Token', tokenSchema, 'token');
