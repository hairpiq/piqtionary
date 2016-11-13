var config = require('../config/hairpiq');
var twilio = require('twilio');

module.exports = {
	creatReplyMessage: function (url) {
				
		var twiml = new twilio.TwimlResponse();
		return twiml.message(function() {
			this.body('your hairpiq');
			this.media(url);
		});
		
	},
	send: function(to, msg) {

		//require the Twilio module and create a REST client 
		var client = require('twilio')(config.twilio.account_sid, config.twilio.auth_token);

		client.messages.create({ 
		    to: to, 
		    from: config.twilio.phone_number, 
		    body: msg,
		    mediaUrl: config.twilio.logo,
		}, function(err, message) { 
		    console.log('message.sid: ' + message.sid); 
		});

	}
}