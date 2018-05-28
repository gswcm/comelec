const router = require('express').Router();
const restler = require('restler');
const People = require('../models/people');
// const mongoose = require('mongoose');

String.prototype.capitalize = function() {
	const shortWords = ['of','the','and','or','to','a','for'];
	let parts = this.trim().split(/\s+/gi);
	return parts.map(e => {
		return shortWords.indexOf(e.toLowerCase()) === -1 ? e[0].toUpperCase() + e.substr(1).toLowerCase() : e;
	}).join(' ');
};

router.post("/user", function(req, res, next) {
	let { email } = req.body;
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
							firstName: temp.fname,
							lastName: temp.lname,
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
		res.json(person)
	})
	.catch(error => {
		res.status(500).json({
			message: error.message
		})
	})
});

export default router;
