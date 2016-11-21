var config = require('../config/hairpiq');
var cloudinary = require('./cloudinary');
var s3 = require('./s3');
var bitly = require('./bitly');
var twilio = require('./twilio');
require('es6-promise').polyfill();
var messages = require('./messages');

module.exports = function(app) {
	
	console.log('hairpiq service started');

	app.get('/', function(req, res) {
		res.send('hairpiq service started');
	});

	// consume mms from Twilio

	app.post('/mms', function(req, res) {

		console.log('mms received from Twilio...');

		console.log("req.session.hairpiqUrl: " + req.session.hairpiqUrl);

		// if hairpiq url is NOT set
			// create hairpiq
				// send url
				// ask feature question
		// else does the user want their hairpiq featured?
				// if yes
					// add hairpiq url to piqtionary queue
					// send message about consideration
				// if no
					// send message of declination acceptance
							

		if (req.session.hairpiqUrl === undefined) {

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
	 
				//twilio.send(req.body.From, msg, config.twilio.logo);

				console.log('generating Twilio reply...');

				var reply = twilio.creatReplyMessage(msg, config.twilio.logo).toString();

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
			twilio.send(req.body.From, messages.b.one, config.twilio.logo);

			execute(photo_url, stylename, ig_username, options).then(function(result) {

				req.session.hairpiqUrl = result.url;

				// generate Twilio reply

				console.log('generating Twilio reply...');

				var reply = twilio.creatReplyMessage(messages.b.two, result.url).toString();
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

			var long_url = result.url;

			console.log(long_url);

			// save to S3

			console.log('requesting S3...');

			s3.save(long_url).then(function(result) {
				
				console.log("S3 responded...");

				var s3_url = result.url
				
				console.log(s3_url);

				// shorten the S3 url

				console.log('requesting Bitly...');

				bitly.shortenLink(s3_url).then(function(result) {
					
					console.log("Bitly responded...");

					console.log(result.url);

					resolve(result);
					
				});

			});

		});

	});

}