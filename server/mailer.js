const nodemailer = require('nodemailer');

const smtpConfig = {
	host: 'smtp.gswcm.net',
	port: 25,
	logger: require('bunyan').createLogger({
		name: 'Mailer',
		streams: [
			{
				type: 'rotating-file',
				level: 'info',
				path: 'server/logs/mailer.log',
				period: '1w', // weekly rotation
				count: 10 // keep 10 back copies
			},
			{
				stream: process.stderr,
				level: 'warn'
			}
		]
	}),
	secure: false,
	ignoreTLS: true,
	connectionTimeout: 2000
};

const defaultMailingOptions = {
	from: 'GSW ComElec Mailing Robot <noreply@comelec.gswcm.net>',
	replyTo: 'noreply@comelec.gswcm.net'
};

const smtpTransport = nodemailer.createTransport(smtpConfig, defaultMailingOptions);

module.exports = smtpTransport;
