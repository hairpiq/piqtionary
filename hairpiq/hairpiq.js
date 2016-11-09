var config = require('../config/hairpiq');
var cloudinary = require('./cloudinary');
var s3 = require('./s3');
var bitly = require('./bitly');
var twilio = require('./twilio');

module.exports = function(app) {
	
	console.log('hairpiq service started');

	app.get('/', function(req, res) {

		// send quick message

		var to = '+14433102161';
		var message = "test message";

		twilio.send(to, message);
		
	});

	// consume mms from Twilio

	app.post('/mms', function(req, res) {

		console.log('mms received from Twilio...');

		var photo_url = "";
		if (req.body.MediaUrl0 !== undefined)
			photo_url = req.body.MediaUrl0;

		//console.log(req.body);

		var stylename = "Style Name";

		if (req.body.Body.length > 0)
			stylename = req.body.Body;

		var ig_username = "@igusername";
		
		var options = {
			gravity: "south",
			theme: {
				logo: "dark",
				plate: "dark"
			}
		};

		// send quick message

		/*

		var to = req.body.From;
		var message = "we're working on it...";

		twilio.send(to, message);
		*/

		execute(photo_url, stylename, ig_username, options).then(function(result) {

			console.log('Replying to Twilio...');
			
			res.writeHead(200, {'Content-Type': 'text/xml'});
			res.end(result.reply);

			console.log('Replied. Sent mms to ' + req.body.From);

		});

	});

	// generate test mms

	app.get('/mms', function(req, res) {

		console.log('generate test mms...');

		var photo_url = "test/_DSC1654.jpg";
		var stylename = "Style Name";
		var ig_username = "@igusername";
		
		var options = {
			gravity: "south",
			theme: {
				logo: "dark",
				plate: "dark"
			}
		};

		execute(photo_url, stylename, ig_username, options);

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

				var shortened_url = result.url;

				console.log(shortened_url);
				
				// generate Twilio reply

				console.log('generating Twilio reply...');

				var reply = twilio.creatReplyMessage(shortened_url).toString();
				result.reply = reply;

				console.log('Twilio reply generated...');

				console.log(result.reply);

				resolve(result);
				
			});

		});

	});

	});

}