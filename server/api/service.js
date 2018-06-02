const router = require('express').Router();
const axios = require('axios');
const Committee = require('../models/committee');
const Service = require('../models/service');

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
	const { token, user, preference } = req.body;
	try {
		// validate reCAPTCHA response
		const { data } = await axios({
			method: 'get',
			url: 'https://www.google.com/recaptcha/api/siteverify',
			params: {
				secret: process.env.reCAPTCHA_SECRET,
				response: token
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
			//-- Return response
			res.json({
				record
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
