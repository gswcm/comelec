const router = require('express').Router();
const fs = require('fs');
const AD = require('activedirectory2').promiseWrapper;
const domain = 'gswcm.local';
const ad = new AD({
	url: 'ldaps://dc.gswcm.local',
	baseDN: 'dc=gswcm,dc=local',
	username: `${process.env.AD_USER}@${domain}`,
	password: process.env.AD_PASS,
	tlsOptions: {
		ca: [
			fs.readFileSync('./server/gswcm-ca.cer')
		]
	}
});

router.post('/login', async (req,res) => {
	try {
		const { username, password } = req.body;
		await ad.authenticate(`${username}@${domain}`, password);
		req.session.admin = true;
		res.json({
			ok: true
		});
	}
	catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
})

router.post('/logout', (req,res) => {
	delete req.session.admin;
	res.json({
		ok: true
	})
})

module.exports = router;
