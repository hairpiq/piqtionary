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

	},
	hairpiqCreator: {

		validate: function(params) {

			return execute('//' + config.HOSTNAME + '/api/hairpiq_creator/validate', params);

		},
		delete: function(params) {

			return execute('//' + config.HOSTNAME + '/api/hairpiq_creator/delete', params);

		},
		render: function(params) {

			return execute('//' + config.HOSTNAME + '/api/hairpiq_creator/render', params);

		},
		getTags: function(params) {

			console.log('B');
			console.log(params);

			return execute('//' + config.HOSTNAME + '/api/hairpiq_creator/get_tags', params);

		}

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
