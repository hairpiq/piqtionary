require('dotenv').config();
var config = process.env;
var cloudinary = require('./cloudinary');
var s3 = require('./s3');
var bitly = require('./bitly');
var twilio = require('./twilio');
require('es6-promise').polyfill();
var messages = require('./messages');
var fs = require('fs');
var express = require('express');
var session = require('express-session');
var request = require('request');

module.exports = function(app) {
	
	console.log('hairpiq creator api started');

	// identify static folder
	var dir = __dirname + '/s3-queue';
	if (!fs.existsSync(dir))
	    fs.mkdirSync(dir);
	app.use(express.static(dir));

	// allow nodejs to utilize session storage
	app.use(session({ secret: config.SESSION_SECRET, resave: true, saveUninitialized: true}));

	/*
		consume mms from Twilio
	*/

	app.post('/api/hairpiq_creator/mms', function(req, res) {

		console.log('B - called: /api/hairpiq_creator/mms');

		console.log('mms received from Twilio...');

		// if rendered url is NOT set
			// create hairpiq
				// send url
				// ask feature question
		// else does the user want their hairpiq featured?
				// if yes
					// add rendered url to piqtionary review queue
					// send message about consideration
				// if no
					// send message of declination acceptance
							

		if (req.session.rendered_url === undefined) {

			var msg = "";
			var photo_url = req.body.MediaUrl0;
			var pieces = req.body.Body.split(" @");
			var stylename = pieces[0];
			var ig_username = pieces[1];

			// if media supplied AND the body has text
				// if media validates
					// if body text has stylename AND ig_username
						// is valid
				// else
					// sorry, we only accept photos of hairstyles
					// send instructions
					// return false
			// else
				// send instructions
				// return false

			var isValid;

			if (photo_url !== undefined && stylename.length > 0) {
				// add if passes clarifai validation when module is ready...
				if (ig_username !== undefined && ig_username.length > 0) {
					isValid = true;
					ig_username = "@" + ig_username;
				}
				else {

					console.log("ig username not provided")
					msg = messages.a.two;
				}
			}
			else {

				console.log("no selfie attached and/or no description provided");
				msg = messages.a.one;

			}

			if (!isValid) {
				
				console.log(msg);
	 
				//twilio.send(req.body.From, msg, config.TWILIO_LOGO);

				console.log('generating Twilio reply...');

				var reply = twilio.creatReplyMessage(msg, config.TWILIO_LOGO).toString();

				console.log(reply);

				console.log('Replying to Twilio...');
				
				res.writeHead(200, {'Content-Type': 'text/xml'});
				res.end(reply);

				console.log('Replied. Sent mms to ' + req.body.From);

				return false;

			}
			
			var options = {
				logo: {
						color: "white",
						opacity: 1
					},
				plate: {
					color: "black",
					opacity: 0.5
				}
			}

			// send quick message
			twilio.send(req.body.From, messages.b.one, config.TWILIO_LOGO);

			create(photo_url, stylename, ig_username, options).then(function(result) {

				// store values in session
				req.session.rendered_url = result.rendered_url;
				req.session.orig_photo_url = result.orig_photo_url;
				req.session.s3_url = result.s3_url;
				req.session.stylename = stylename;
				req.session.ig_username = ig_username;

				console.log(req.session);

				// generate Twilio reply

				console.log('generating Twilio reply...');

				var reply = twilio.creatReplyMessage(messages.b.two, result.shortened_url).toString();
				result.reply = reply;

				console.log('Twilio reply generated...');

				console.log(result.reply);

				console.log('Replying to Twilio...');
				
				res.writeHead(200, {'Content-Type': 'text/xml'});
				res.end(result.reply);

				console.log('Replied. Sent mms to ' + req.body.From);

			});
		} else {

			var answer = req.body.Body.toUpperCase();
			var msg = '';
			
			if (answer === "YES") {
				
				// save to piqtionary-review-queue
				msg = messages.c.one;

				submitForReview(req.session);

			} else if (answer === "NO")
				msg = messages.c.two;
			else
				msg = messages.c.three;
			
			var reply = twilio.creatReplyMessage(msg).toString();
			res.writeHead(200, {'Content-Type': 'text/xml'});
			res.end(reply);

			req.session.destroy();

			// delete image off of cloudinary
			if (answer !== "YES") {
				var pieces = req.session.orig_photo_url.split('/');
				params.cloudinary_id = pieces[ pieces.length - 1].split('.jpg')[0];
				deleteAssets(params);
			}

		}

	});

	/*
		update hairpiq data
	*/

	app.post('/api/hairpiq_creator/update', function(req, res) {

		console.log('B - called: /api/hairpiq_creator/update');

		var pieces = req.body.orig_photo_url.split('/');
		var cloudinary_id = pieces[ pieces.length - 1].split('.jpg')[0];
		var stylename = req.body.stylename;
		var ig_username = req.body.ig_username;

		var options = null;
		if (req.body.options !== undefined)
			options = JSON.parse(req.body.options);

		update(cloudinary_id, stylename, ig_username, options).then(function(result) {
			res.send(result);
		});

	});

	/*
		delete hairpiq assets
	*/

	app.post('/api/hairpiq_creator/delete', function(req, res) {

		console.log('B - called: /api/hairpiq_creator/delete');

		deleteAssets(req.body).then(function(result) {
			res.send(JSON.stringify(result));
		});

	});

	/*
		add pre-rendered hairpiq to piqtionary review process
	*/

	app.post('/api/hairpiq_creator/add_prerendered', function(req, res) {

		console.log('B - called: /api/hairpiq_creator/add_prerendered');

		var params = {
			rendered_url: '',
			orig_photo_url: req.body.orig_photo_url,
			s3_url: '',
			stylename: req.body.stylename,
			ig_username: req.body.ig_username
		}

		addPreRendered(params).then(function(result){

			submitForReview(params).then(function(resolve, reject) {
				res.send(params);
			});

		});

	});

	/*
		Render a new hairpiq, different than Create.
		/create consumes a photo texted in by MMS.
		/render takes a photo already on cloudinary. The photo was
		submitted by a user of the Hairpiq Creator Web App
	*/

	app.post('/api/hairpiq_creator/render', function(req, res) {

		console.log('B - called: /api/hairpiq_creator/render');

		var pieces = req.body.orig_photo_url.split('/');
		var cloudinary_id = pieces[ pieces.length - 1].split('.jpg')[0];
		var stylename = req.body.stylename;
		var ig_username = req.body.ig_username;
		var options = JSON.parse(req.body.options);

		render(cloudinary_id, stylename, ig_username, options).then(function(result) {

			var params = {
				rendered_url: result.rendered_url,
				orig_photo_url: req.body.orig_photo_url,
				s3_url: result.s3_url,
				stylename: req.body.stylename,
				ig_username: req.body.ig_username,
				options: req.body.options
			}

			submitForReview(params).then(function(resolve, reject) {
				res.send(params);
			});

		});

	});
}

function create(photo_url, stylename, ig_username, options) {

	// composite hairpiq in Cloudinary

	console.log('requesting Cloudinary...');

	return new Promise(function(resolve, reject) {

		cloudinary.create(photo_url, stylename, ig_username, options).then(function(result) {

			console.log("Cloudinary responded...");

			var _result = result;

			console.log(_result.rendered_url);

			// save to S3

			console.log('requesting S3...');

			s3.save(_result.rendered_url).then(function(result) {
				
				console.log("S3 responded...");

				_result.s3_url = result.url;
				
				console.log(_result.s3_url);

				// shorten the S3 url

				console.log('requesting Bitly...');

				bitly.shortenLink(_result.s3_url).then(function(result) {

					console.log("Bitly responded...");

					_result.shortened_url = result.url;

					console.log(result.shortened_url);

					resolve(_result);
					
				});

			});

		});

	});

}

function update(cloudinary_id, stylename, ig_username, options) {

	return new Promise(function(resolve, reject) {

		cloudinary.update(cloudinary_id, stylename, ig_username, options).then(function(result){
			
			console.log("Cloudinary responded...");

			var _result = result;

			console.log(_result.rendered_url);

			// save to S3

			console.log('requesting S3...');

			s3.update(_result.rendered_url).then(function(result) {
				
				console.log("S3 responded...");

				_result.s3_url = result.url;
				
				console.log(_result.s3_url);

				resolve(_result);
			});

		});

	});

}

function deleteAssets(params) {

	var arr = [];

	if (params.s3_url) {
		
		// delete from S3

		console.log('requesting S3...');

		arr.push(
			new Promise(function(resolve, reject) {

				s3.delete(params.s3_url).then(function(result) {
						
					console.log("S3 responded...");
					console.log(result);

					resolve(result);
				});
			})
		);

	}

	if (params.cloudinary_id) {
		
		// delete from Cloudinary

		console.log('requesting Cloudinary...');

		arr.push(
			new Promise(function(resolve, reject) {

				cloudinary.delete(params.cloudinary_id).then(function(result) {
						
					console.log("Cloudinary responded...");
					console.log(result);

					resolve(result);
				});
			})
		);

	}

	return Promise.all(arr);
}

function addPreRendered(params) {

	return new Promise(function(resolve, reject) {

		// save to S3

		console.log('requesting S3...');

		var orig_photo_url = params.orig_photo_url.split('.jpg')[0];

		s3.save(orig_photo_url).then(function(result) {

			console.log("S3 responded...");

			params.s3_url = result.url;
			
			console.log(params.s3_url);

			resolve(params);

		});

	});
}

function render(cloudinary_id, stylename, ig_username, options) {

	return new Promise(function(resolve, reject) {

		cloudinary.update(cloudinary_id, stylename, ig_username, options).then(function(result){
			
			console.log("Cloudinary responded...");

			var _result = result;

			console.log(_result.rendered_url);

			// save to S3

			console.log('requesting S3...');

			s3.save(_result.rendered_url).then(function(result) {
				
				console.log("S3 responded...");

				_result.s3_url = result.url;
				
				console.log(_result.s3_url);

				resolve(_result);

			});

		});

	});

}

function submitForReview(obj) {

	/* test data
	var params = {
		rendered_url: 'http://res.cloudinary.com/hairpiq/image/upload/co_black,e_colorize,g_north_west,l_logo,o_40,w_372,x_74,y_77/co_black,e_colorize,g_south_west,l_plate,o_25,x_360,y_148/co_white,g_south_west,l_text:Montserrat_62_bold:Test,x_390,y_234/co_white,g_south_west,l_text:Montserrat_50_letter_spacing_1:@averygoodidea,x_390,y_168/x5v2vimxvdejiqizhd69',
		orig_photo_url: 'https://res.cloudinary.com/hairpiq/image/upload/v1480200843/x5v2vimxvdejiqizhd69.jpg',
		s3_url: 'https://dev-piqtionary.s3.amazonaws.com/x5v2vimxvdejiqizhd69.jpg',
		stylename: 'Test',
		ig_username: '@averygoodidea'
	}
	*/

	var params = {
		rendered_url: obj.rendered_url,
		orig_photo_url: obj.orig_photo_url,
		s3_url: obj.s3_url,
		stylename: obj.stylename,
		ig_username: obj.ig_username
	}

	if (obj.options !== undefined)
		params.options = obj.options

	return new Promise(function(resolve, reject) {

		//submit object into piqtionary pending queue

		request({
		    url: 'http://' + config.HOSTNAME + '/piqtionary/submit', //URL to hit
		    qs: {time: +new Date()}, //Query string data
		    method: 'POST',
		    headers : {
		        "Authorization" : config.API_BASIC_AUTH
			},
		    //Lets post the following key/values as form
		    json: params
			}, function(error, response, body){
			    if(error) {
			        console.log(error);
			        reject(new Error(error));
			    } else {
			        console.log(response.statusCode, body);
			        resolve(body);
			}
		});

	});

}


