/* CHANGE THE REQUEST HOSTNAME TO BE AN ENVIRONMENTAL VARIABLE!! */

var result  = {
	hostname: 'hairpiq.ngrok.io'
}

module.exports = {
	getList: function(page_num, keyword) {

		var params = {
			limit: 10,
			page_num: page_num
		}

		if (keyword)
			params.keyword = keyword;

		return new Promise(function(resolve, reject) {

			$.post('http://' + result.hostname + '/piqtionary/list', params, function(result) {
				resolve(result);
			});

		});

	},
	getKeywords: function() {

		return new Promise(function(resolve, reject) {

			$.post('http://' + result.hostname + '/piqtionary/keywords', function(result) {
				resolve(result);
			});

		});

	}
};
