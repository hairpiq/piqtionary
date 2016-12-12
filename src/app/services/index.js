module.exports = {
	getList: function(params) {

		params.limit = 10;

		return new Promise(function(resolve, reject) {

			$.post('//' + process.env.HOSTNAME + '/piqtionary/list', params, function(result) {
				resolve(result);
			}).fail(function(error) {
				console.log(error);
				reject(new Error(error));
			});

		});

	},
	getKeywords: function() {

		return new Promise(function(resolve, reject) {

			$.post('//' + process.env.HOSTNAME + '/piqtionary/keywords', function(result) {
				resolve(result);
			}).fail(function(error) {
				console.log(error);
				reject(new Error(error));
			});

		});

	}
};
