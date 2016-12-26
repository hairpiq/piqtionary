const config = process.env;

module.exports = {
	getList: function(params) {

		params.limit = 10;

		return execute('//' + config.HOSTNAME + '/api/piqtionary/list', params);

	},
	getKeywords: function() {

		return new Promise(function(resolve, reject) {

			$.ajax({
			  	type: "POST",
			  	url: '//' + process.env.HOSTNAME + '/api/piqtionary/keywords',
			  	success: function(result) {
					resolve(result);
				},
			 	dataType: 'json',
			 	beforeSend: function (xhr) {
				    xhr.setRequestHeader ("Authorization", config.API_BASIC_AUTH);
				}
			});

		});

	},
	getById: function(params) {

		return execute('//' + config.HOSTNAME + '/api/piqtionary/get_by_id', params);

	}
};

function execute(url, params) {

	return new Promise(function(resolve, reject) {

		$.ajax({
		  	type: "POST",
		  	url: url,
		  	data: params,
		  	success: function(result) {
				resolve(result);
			},
		 	dataType: 'json',
		 	beforeSend: function (xhr) {
			    xhr.setRequestHeader ("Authorization", config.API_BASIC_AUTH);
			}
		});

	})

}
