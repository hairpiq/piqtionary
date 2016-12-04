var config = require('../../../config/twilio');
var twilio = require('twilio');

module.exports = {
	creatReplyMessage: function (msg, mediaUrl) {
				
		var twiml = new twilio.TwimlResponse();
		return twiml.message(function() {
			this.body(msg);
			if (mediaUrl !== undefined)
				this.media(mediaUrl);
		});
		
	},
	send: function(to, msg, mediaUrl) {

		//require the Twilio module and create a REST client 
		var client = require('twilio')(config.account_sid, config.auth_token);

		var obj = { 
		    to: to, 
		    from: config.phone_number, 
		    body: msg
		}

		if (mediaUrl !== undefined)
			obj.mediaUrl = mediaUrl;

		client.messages.create(obj, function(err, message) {
			if (err)
				console.log(err);
			else
		    	console.log('message.sid: ' + message.sid); 
		});

	}
}