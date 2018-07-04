module.exports = {
	/**
	 * Application configuration section
	 * http://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
	apps: [
		// First application
		{
			name: "master branch",
			script: "build/main.js",
			env: {
				PORT: "3000",
				NODE_ENV: "production"
			}
		}
	]
};
