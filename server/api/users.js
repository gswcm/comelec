const router = require('express').Router();
const restler = require('restler');
const moment = require('moment');
const ObjectId = require('mongodb').ObjectId;
const People = require('../models/people');
const YCF = require('../models/ycf');
// const mongoose = require('mongoose');

String.prototype.capitalize = function() {
	const shortWords = ['of','the','and','or','to','a','for'];
	let parts = this.trim().split(/\s+/gi);
	return parts.map(e => {
		return shortWords.indexOf(e.toLowerCase()) === -1 ? e[0].toUpperCase() + e.substr(1).toLowerCase() : e;
	}).join(' ');
};

router.get('/user/last', async (req,res) => {
	let { id } = req.query;
	let thisYear = moment().format('YYYY');
	try {
		const last = await YCF.aggregate([
			{
				$match: {
					f: ObjectId(id),
					y: {
						$gte: (thisYear - 3)
					}
				}
			},
			{
				$group: {
					_id: {
						f: '$f',
						name: '$name'
					},
					c: {
						$addToSet: '$c'
					}
				}
			},
			{
				$project: {
					_id: new ObjectId(),
					f: '$_id.f',
					name: '$_id.name',
					c: 1,
				}
			}
		]);
		res.json(last.length ? last[0] : null);
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

router.get('/user/iec', async (req,res) => {
	let { id } = req.query;
	let thisYear = moment().format('YYYY');
	try {
		const iec = await YCF.aggregate([
			{
				$match: {
					f: ObjectId(id),
					y: {
						$gte: (thisYear - 3)
					},
					c: "Institutional Effectiveness"
				}
			},
			{
				$group: {
					_id: {
						f: '$f',
						name: '$name'
					},
					y: {
						$push: '$y'
					}
				}
			},
			{
				$project: {
					_id: new ObjectId(),
					f: '$_id.f',
					name: '$_id.name',
					y: 1
				}
			}
		]);
		res.json(iec.length ? iec[0].y : []);
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

router.get('/user/details', function(req, res, next) {
	let { email } = req.query;
	People.findOne({email})
	.then(person => {
		if(!person) {
			let query = email.split(/@/)[0].split(/[.]/)[1];
			return new Promise(resolve => {
				restler
				.get(`https://apps.gsw.edu/search/employee/searchxml.php?q=${query}`, {
					parser: restler.parsers.xml
				})
				.on('complete', function(result) {
					if (!result || result instanceof Error) {
						return resolve(null);
					}
					let temp = result.root.result.find(e => e.email[0] === email);
					resolve(
						temp ? {
							f: query,
							query,
							firstName: temp.fname[0],
							lastName: temp.lname[0],
							email: temp.email[0],
							dept: temp.depart[0].capitalize()
						} : null
					);
				});
			})
		}
		else {
			return person;
		}
	})
	.then(person => {
		req.session.authUser = person;
		res.json(person)
	})
	.catch(error => {
		res.status(500).json({
			message: error.message
		})
	})
});

export default router;
