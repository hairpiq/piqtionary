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

	// consume mms from Twilio

	app.post('/mms', function(req, res) {

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
				gravity: "south",
				theme: {
					logo: "dark",
					plate: "dark"
				}
			};

			// send quick message
			twilio.send(req.body.From, messages.b.one, config.TWILIO_LOGO);

			execute(photo_url, stylename, ig_username, options).then(function(result) {

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
		}

	});
}

function execute(photo_url, stylename, ig_username, options) {

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
			    } else {
			        console.log(response.statusCode, body);
			}
		});

}


