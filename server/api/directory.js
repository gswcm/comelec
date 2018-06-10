const mongoose = require('mongoose');
const router = require('express').Router();
const restler = require('restler');
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectId;
const People = require('../models/people');

function range(from = 'a', to = 'z') {
	from = from.charCodeAt();
	to = to.charCodeAt();
	return (to >= from) ? [...Array(to - from + 1)].map((_, i) => String.fromCharCode(from + i)) : [];
}


router.get('/find', async (req,res) => {
	/**
	 * Searches by lastName field in the 'people' collection
	 */
	try {
		let { query } = req.query;
		if(!query) {
			throw new Error('Requires "query" parameter with a list of CSV of name queries');
		}
		query = query.split(/,\s*/);
		const records = (await Promise.all(query.map(e => People.find({lastName: e})))).reduce((a,e) => a.concat(e), []);
		res.json({ records });
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

router.get('/refresh', async (req,res) => {
	/**
	 * Route requires 'session.authUser' to be set and allows 'query' parameter to list query prefixes separated by comma.
	 */
	try {
		if(!req.session.authUser) {
			// Unauthorized
			throw new Error('Unauthorized access');
		}
		const alpha = range();
		//-- Construct the list of all pairs of letters {a..z}{a..z} to be used for querying
		let pairs = [];
		for(let i of alpha) {
			for(let j of alpha) {
				pairs.push(`${i}${j}`);
			}
		}
		pairs = req.query.query ? req.query.query.split(/,\s*/) : pairs;
		let records = await Promise.all(pairs.map(query => {
			return new Promise(resolve => {
				restler.get(`https://apps.gsw.edu/search/employee/searchxml.php?q=${query}`, {
					parser: restler.parsers.xml
				})
				.on('complete', function(result) {
					if(result instanceof Error) {
						return resolve({
							status: 404,
						});
					}
					resolve(result.root.result.map(temp => {
						const firstName = (temp.fname && temp.fname.length) ? temp.fname[0] : 'N/A';
						const lastName = (temp.lname && temp.lname.length) ? temp.lname[0] : 'N/A';
						const email = (temp.email && temp.email.length) ? temp.email[0] : 'N/A';
						const dept = (temp.depart && temp.depart.length) ? temp.depart[0].capitalize() : 'N/A';
						return {
							status: 0,
							person: {
								f: `${firstName} ${lastName}`,
								query,
								firstName,
								lastName,
								email,
								dept
							}
						}
					}));
				})
			})
		}));
		//-- Group, unique, and filter
		records = _.uniqBy(records.reduce((a,e) => a.concat(e), []).filter(e => !e.status).map(e => e.person), 'email');
		//-- Store in the DB
		const stat = (await Promise.all(
			records.map(
				person => People.update(
					{
						email: person.email
					},
					person,
					{
						upsert: true
					}
				)
			)
		))
		.reduce(
			(a,e) => ({
				all: a.all + e.ok,
				upd: a.upd + e.nModified,
				new: a.new + (e.upserted ? e.upserted.length : 0)
			}),
			{
				upd: 0,
				new: 0,
				all: 0
			}
		);
		//-- return stat with response
		res.json({ stat });
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

module.exports = router;
