const router = require('express').Router();
const axios = require('axios');
const emailTemplates = require('email-templates');
const ObjectId = require('mongodb').ObjectId;
const Committee = require('../models/committee');
const Service = require('../models/service');
const Token = require('../models/token');
const smtpTransport = require('../mailer');

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
router.get('/', async (req,res) => {
	try {
		const { person_id } = req.query;
		const service = await Service.find({
			"person.id": person_id,
			confirmed: false
		})
		.sort({createdAt: -1})
		.limit(1);
		const latestConfirmedService = (service && service.length) ? service[0] : null;
		req.session.service = latestConfirmedService;
		res.json(latestConfirmedService);
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})
router.post('/', async (req,res) => {
	const { response, user, service, uuid } = req.body;
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
				committees: service.map(e => ({
					id: e.id,
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
				//-- Create new confirmation email
				const host = `${req.protocol}://${req.get('host')}`;
				const url = `${host}/email?action=confirm&token=${token.uuid}`;
				await new emailTemplates({
					transport: smtpTransport
				})
				.send({
					views: {
						root: '..'
					},
					template: 'confirm',
					message: {
						to: user.email
					},
					locals: {
						host, url
					},
				})
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
