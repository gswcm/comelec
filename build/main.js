require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_express_session__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_express_session___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_express_session__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_body_parser__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_body_parser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_body_parser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_express__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_nuxt__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_nuxt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_nuxt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__api__ = __webpack_require__(6);







const app = __WEBPACK_IMPORTED_MODULE_3_express___default()();
const isProd = "development" === "production";
const port = process.env.PORT || 3000;

// We instantiate nuxt.js with the options
const config = __webpack_require__(10);
config.dev = !isProd;
const nuxt = new __WEBPACK_IMPORTED_MODULE_4_nuxt__["Nuxt"](config);

// Body parser, to access `req.body`
app.use(__WEBPACK_IMPORTED_MODULE_2_body_parser___default.a.json());

// Sessions to create `req.session`
app.use(__WEBPACK_IMPORTED_MODULE_1_express_session___default()({
	secret: "A mne segodnya po kaifu",
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 60 * 1000
	}
}));
// Run every request through API
app.use("/api", __WEBPACK_IMPORTED_MODULE_5__api__["a" /* default */]);
// Render every route with Nuxt.js
app.use(nuxt.render);

// Build only in dev mode with hot-reloading
if (config.dev) {
	new __WEBPACK_IMPORTED_MODULE_4_nuxt__["Builder"](nuxt).build().then(listen).catch(error => {
		console.error(error);
		process.exit(1);
	});
} else {
	listen();
}

function listen() {
	__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Promise = global.Promise;
	__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.connect('mongodb://127.0.0.1/comelec');
	__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.connection.on('error', err => {
		console.error('MongoDB:', err.message);
		process.exit(200);
	}).once('open', () => {
		app.listen(port, "0.0.0.0");
		console.log("Server listening on `localhost:" + port + "`.");
	});
}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("nuxt");

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__users__ = __webpack_require__(7);




const router = Object(__WEBPACK_IMPORTED_MODULE_0_express__["Router"])();

// Add USERS Routes
router.use(__WEBPACK_IMPORTED_MODULE_1__users__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (router);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const router = __webpack_require__(0).Router();
const restler = __webpack_require__(8);
const People = __webpack_require__(9);
// const mongoose = require('mongoose');

String.prototype.capitalize = function () {
	const shortWords = ['of', 'the', 'and', 'or', 'to', 'a', 'for'];
	let parts = this.trim().split(/\s+/gi);
	return parts.map(e => {
		return shortWords.indexOf(e.toLowerCase()) === -1 ? e[0].toUpperCase() + e.substr(1).toLowerCase() : e;
	}).join(' ');
};

router.post("/user", function (req, res, next) {
	let { email } = req.body;
	People.findOne({ email }).then(person => {
		if (!person) {
			let query = email.split(/@/)[0].split(/[.]/)[1];
			return new Promise(resolve => {
				restler.get(`https://apps.gsw.edu/search/employee/searchxml.php?q=${query}`, {
					parser: restler.parsers.xml
				}).on('complete', function (result) {
					if (!result || result instanceof Error) {
						return resolve(null);
					}
					let temp = result.root.result.find(e => e.email[0] === email);
					resolve(temp ? {
						f: query,
						query,
						firstName: temp.fname[0],
						lastName: temp.lname[0],
						email: temp.email[0],
						dept: temp.depart[0].capitalize()
					} : null);
				});
			});
		} else {
			return person;
		}
	}).then(person => {
		req.session.authUser = person;
		res.json(person);
	}).catch(error => {
		res.status(500).json({
			message: error.message
		});
	});
});

/* harmony default export */ __webpack_exports__["a"] = (router);

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("restler");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const mongoose = __webpack_require__(1);

const peopleSchema = mongoose.Schema({
	f: String,
	query: String,
	firstName: String,
	lastName: String,
	email: String,
	dept: String
}).index({ email: 1 });

module.exports = mongoose.model('people', peopleSchema, 'people');

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = {
	//--
	head: {
		title: "GSW ComElec",
		meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { hid: "description", name: "description", content: "GSW Committee Election Helper" }],
		link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
	},
	//--
	loading: { color: "#3B8070" },
	//--
	css: ["bootswatch/dist/yeti/bootstrap.min.css"],
	//--
	modules: [["bootstrap-vue/nuxt", {
		css: false
	}]],
	plugins: [{ src: '~/plugins/font-awesome' }],
	//--
	build: {
		vendor: ["axios"],
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

/***/ })
/******/ ]);
//# sourceMappingURL=main.map