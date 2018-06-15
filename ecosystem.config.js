module.exports = {
	/**
	 * Application configuration section
	 * http://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
	apps: [
		// First application
		{
			name: "dev branch",
			script: "build/main.js",
			env: {
				PORT: "4000"
			}
		}
	]
};
