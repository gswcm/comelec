const router = require('express').Router();
const fs = require('fs');
const People = require('../models/people');
const AD = require('activedirectory2').promiseWrapper;
const domain = process.env.NODE_ENV === 'production' ? 'gsw.local' : 'gswcm.local';
const options =
	process.env.NODE_ENV === 'production'
	?
	{
		url: 'ldaps://trapper.gsw.edu',
		baseDN: 'DC=gsw,DC=local',
		username: process.env.AD_USER_PROD,
		password: process.env.AD_PASS_PROD,
	}
	:
	{
		url: 'ldaps://dc.gswcm.local',
		baseDN: 'dc=gswcm,dc=local',
		username: process.env.AD_USER_DEV,
		password: process.env.AD_PASS_DEV,
		tlsOptions: {
			ca: [
				fs.readFileSync('./server/gswcm-ca.cer')
			]
		}
	}
const ad = new AD(options);

router.post('/login', async (req,res) => {
	try {
		let { username, password } = req.body;
		username = `${username}@${domain}`;
		await ad.authenticate(username, password);
		const user = await ad.findUser(username);
		const person = await People.findOne({
			// email: `${username}@gsw.edu`,
			email: user.mail,
			$or: [
				{
					isAdmin: true
				},
				{
					isSuperAdmin: true
				}
			]
		});
		if(!person) {
			throw new Error('Not a member of the Faculty Senate');
		}
		req.session.authenticated = person._id;
		res.json(person._id);
	}
	catch (error) {
		console.log(error.message);
		res.status(500).json({
			message: error.message
		})
	}
})

router.post('/logout', (req,res) => {
	delete req.session.authenticated;
	res.json({
		ok: true
	})
})

module.exports = router;
