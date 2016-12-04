var config = require('../../../config/bitly');
var BitlyAPI = require("node-bitlyapi");
var bitly = new BitlyAPI({
	client_id: config.client_id,
	client_secret: config.client_secret
});
bitly.setAccessToken(config.access_token);

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
