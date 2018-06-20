const router = require('express').Router();
const axios = require('axios');
const path = require('path');
const emailTemplates = require('email-templates');
const ObjectId = require('mongodb').ObjectId;
const Committee = require('../models/committee');
const Service = require('../models/service');
const Token = require('../models/token');
const smtpTransport = require('../mailer');


router.get('/preferences', async (req,res) => {
	try {
		const items = await Service.aggregate([
			{
				$match: {
					confirmed: true
				}
			},
			{
				$group: {
					_id: {
						person: '$person'
					},
					data: {
						$push: {
							createdAt: '$createdAt',
							committees: '$committees'
						}
					},
					latest: {
						$max: '$createdAt'
					}
				}
			},
			{
				$unwind: '$data'
			},
			{
				$project: {
					person: '$_id.person',
					createdAt: '$data.createdAt',
					committees: '$data.committees',
					latest: 1,
					_id: 0
				}
			},
			{
				$redact: {
					$cond: [
						{
							$eq: ['$latest', '$createdAt']
						},
						'$$KEEP',
						'$$PRUNE'
					]
				}
			},
			{
				$unwind: {
					path: '$committees',
					includeArrayIndex: 'index'
				}
			},
			{
				$project: {
					person: 1,
					committee: {
						id: '$committees.id',
						title: '$committees.title',
						preference: {
							$add: ['$index', 1]
						}
					}
				}
			},
			{
				$group: {
					_id: '$committee',
					people: {
						$push: '$person'
					}
				}
			},
			{
				$project: {
					committee: '$_id',
					people: 1,
					_id: 0
				}
			}

		]);
		res.json(items);
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

router.get('/list', async (req,res) => {
	try {
		const committees = await Committee.find({
			active:true,
			exclude: false
		})
		.sort({title:1});
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
			confirmed: true
		})
		.sort({createdAt: -1})
		.limit(1);
		const latestConfirmedService = (service && service.length) ? service[0] : null;
		res.json(latestConfirmedService);
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})
router.post('/', async (req,res) => {
	const { reCaptchaResponse, user, storedService, uuid } = req.body;
	try {
		// validate reCAPTCHA response
		const { data } = await axios({
			method: 'get',
			url: 'https://www.google.com/recaptcha/api/siteverify',
			params: {
				secret: process.env.reCAPTCHA_SECRET,
				response: reCaptchaResponse
			}
		})
		if(data.success) {
			//-- name
			const name = user.email.split(/[.]/)[0].split('').map((letter,index) => index ? letter : letter.toUpperCase()).join('') || user.firstName;
			//-- Create and save new service record
			const record = await new Service({
				person: {
					id: user._id,
					name: `${user.firstName} ${user.lastName}`,
					email: user.email
				},
				committees: storedService.map(e => ({
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
				const url = `${host}/email?action=confirm&uuid=${token.uuid}`;
				const message = await new emailTemplates({
					message: {
						from: 'GSW ComElec <no-reply@comelec.gswcm.net>'
					},
					// send: true,
					transport: smtpTransport,
					juice: true,
					juiceResources: {
						preserveImportant: true,
						webResources: {
							relativeTo: path.join(__dirname, '..','..', 'static'),
						}
					}
				})
				.send({
					template: 'confirm',
					message: {
						to: `${record.person.name} <${record.person.email}>`
					},
					locals: {
						host, url, name
					},
				});
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
