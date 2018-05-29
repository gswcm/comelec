import mongoose from 'mongoose';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';


import bodyParser from 'body-parser';
import express from 'express'
import { Nuxt, Builder } from 'nuxt'
import api from './api'

//-- Express app
const app = express()
const isProd = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;
//-- Express Session Store
const mongoDB_URI = 'mongodb://127.0.0.1/comelec';
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
	uri: mongoDB_URI,
	databaseName: 'comelec',
	collection: 'sessions'
});
store.on('error', function(error) {
	assert.ifError(error);
	assert.ok(false);
});

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
		resave: true,
		saveUninitialized: false,
		cookie: {
			maxAge: 60 * 1000
		},
		store
	}),
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
	mongoose.connect(mongoDB_URI);
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
