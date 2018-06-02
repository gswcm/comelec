module.exports = {
	//--
	nuxt: {
		host: "0.0.0.0",
		port: "4000"
	},
	env: {
		reCAPTCHA_KEY: process.env.reCAPTCHA_KEY,
		reCAPTCHA_SECRET: process.env.reCAPTCHA_SECRET
	},
	head: {
		title: "GSW ComElec",
		meta: [
			{ charset: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ hid: "description", name: "description", content: "GSW Committee Election Helper" }
		],
		link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
	},
	//--
	loading: { color: "#3B8070" },
	//--
	css: [
		'bootswatch/dist/yeti/bootstrap.min.css',
		'@/assets/css/main.css'
	],
	//--
	modules: [
		[
			"bootstrap-vue/nuxt",
			{
				css: false
			}
		],
	],
	plugins: [
		{ src: '~/plugins/font-awesome' }
	],
	//--
	build: {
		vendor: ["axios", "moment"],
		extend(config, { isDev, isClient }) {
			if (isDev && isClient) {
				config.module.rules.push({
					enforce: "pre",
					test: /\.(js|vue)$/,
					loader: "eslint-loader",
					exclude: /(node_modules)/
				});
			}
		}
		// postcss: [
		// 	require('precss')()
		// ]
	}
};
