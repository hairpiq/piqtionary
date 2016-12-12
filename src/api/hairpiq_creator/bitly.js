require('dotenv').config();
var config = process.env;
var BitlyAPI = require("node-bitlyapi");
var bitly = new BitlyAPI({
	client_id: config.BITLY_CLIENT_ID,
	client_secret: config.BITLY_CLIENT_SECRET
});
bitly.setAccessToken(config.BITLY_ACCESS_TOKEN);

module.exports = {
	shortenLink: function(url) {

		return new Promise(function(resolve, reject) {

			bitly.shortenLink(url, function(err, results) {

				var result = {
					url: JSON.parse(results).data.url
				}

				resolve(result);

			});

		});
	}
}
