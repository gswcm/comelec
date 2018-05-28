import mongoose from 'mongoose';
import session from 'express-session';
import bodyParser from 'body-parser';
import express from 'express'
import { Nuxt, Builder } from 'nuxt'
import api from './api'

const app = express()
const isProd = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;

// We instantiate nuxt.js with the options
const config = require("../nuxt.config.js");
config.dev = !isProd;
const nuxt = new Nuxt(config);

// Body parser, to access `req.body`
app.use(bodyParser.json());

// Sessions to create `req.session`
app.use(
	session({
		secret: "A mne segodnya po kaifu",
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 60 * 1000
		}
	})
);
// Run every request through API
app.use("/api", api);
// Render every route with Nuxt.js
app.use(nuxt.render);

// Build only in dev mode with hot-reloading
if (config.dev) {
	new Builder(nuxt)
	.build()
	.then(listen)
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
}
else {
	listen();
}

function listen() {
	mongoose.Promise = global.Promise;
	mongoose.connect('mongodb://127.0.0.1/comelec');
	mongoose.connection
	.on('error', err => {
		console.error('MongoDB:', err.message);
		process.exit(200);
	})
	.once('open', () => {
		app.listen(port, "0.0.0.0");
		console.log("Server listening on `localhost:" + port + "`.");
	});
}
