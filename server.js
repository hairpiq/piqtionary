require('dotenv').config();
const config = process.env;

// connect to db

var mongo = require('mongodb');
var assert = require('assert');

mongo.connect(config.DB_URL, function(err, db) {
		
	assert.equal(null, err);

	console.log('A - connected to db');

	// start app

	require('babel-register')({
		presets:['react']
	});

	const express = require('express');
	const app = express();

	// allow nodejs to access get and post variables of various sizes
	var bodyParser = require('body-parser');
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


	// create static folder to serve static assets
	app.use(express.static('public'));
	
	// proxy for s3 hairpiq files
	var proxy = require('./customized_node_modules/express-http-proxy');
	app.use('/h', proxy(config.S3_BUCKET_NAME + '.s3.amazonaws.com/'));

	// require routes for REACT routing
	app.use(require('./src/app/routes/index.js'));

	// instantiate api
	require('./src/api/')(app, db);

	// bind this app to this port
	// (on the server, make sure Nginx listens to a different port than
	// what is specified here and Passenger will take care of the rest)
	app.listen(3000, function() {
	   //
	});

});
