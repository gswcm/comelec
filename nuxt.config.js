module.exports = {
	//--
	env: {
		reCAPTCHA_KEY: process.env.reCAPTCHA_KEY,
		reCAPTCHA_SECRET: process.env.reCAPTCHA_SECRET,
		baseUrl: process.env.BASE_UR || 'localhost:3000',
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
		'vuejs-noty/dist/vuejs-noty.css',
		'animate.css/animate.min.css',
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
		{ src: '~/plugins/font-awesome' },
		{ src: '~/plugins/notifications.js', ssr: false }
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
