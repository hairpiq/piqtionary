/* CHANGE THE REQUEST HOSTNAME TO BE AN ENVIRONMENTAL VARIABLE!! */

var result  = {
	hostname: 'hairpiq.ngrok.io'
}

var AppServices = {
	getList: function(limit, page_num) {

		var params = {
			limit: limit,
			page_num: page_num
		}

		return new Promise(function(resolve, reject) {

			$.post('http://' + result.hostname + '/piqtionary/list', params, function(result) {
				resolve(result);
			});

		});

	}
};

module.exports = AppServices;