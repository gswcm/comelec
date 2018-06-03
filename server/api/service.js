const router = require('express').Router();
const axios = require('axios');
const emailTemplates = require('email-templates');
const ObjectId = require('mongodb').ObjectId;
const Committee = require('../models/committee');
const Service = require('../models/service');
const Token = require('../models/token');

router.get('/list', async (req,res) => {
	try {
		const committees = await Committee.find({active:true}).sort({title:1});
		res.json(committees);
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})
router.post('/update', async (req,res) => {
	const { response, user, preference, uuid } = req.body;
	try {
		// validate reCAPTCHA response
		const { data } = await axios({
			method: 'get',
			url: 'https://www.google.com/recaptcha/api/siteverify',
			params: {
				secret: process.env.reCAPTCHA_SECRET,
				response
			}
		})
		if(data.success) {
			//-- Create and save new service record
			const record = await new Service({
				person: {
					id: user._id,
					name: `${user.firstName} ${user.lastName}`,
					email: user.email
				},
				preference: preference.map(e => ({
					id: e._id,
					title: e.title
				})),
			}).save()
			//-- Create token for e-mail confirmation
			let token = await Token.findOne({uuid});
			if(!token) {
				token = await new Token({
					target: [
						ObjectId(record._id)
					]
				}).save();
			}
			else {
				token.target.push(ObjectId(record._id));
				await token.save();
			}
			//-- Return response
			res.json({
				record,
				uuid: token.uuid
			});
		}
		else {
			throw new Error("Invalid reCAPTCHA token");
		}
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

module.exports = router;
