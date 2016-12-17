module.exports = {
	getList: function(params) {

		params.limit = 10;

		return new Promise(function(resolve, reject) {

			$.ajax({
			  	type: "POST",
			  	url: '//' + process.env.HOSTNAME + '/piqtionary/list',
			  	data: params,
			  	success: function(result) {
					resolve(result);
				},
			 	dataType: 'json',
			 	beforeSend: function (xhr) {
				    xhr.setRequestHeader ("Authorization", process.env.API_BASIC_AUTH);
				}
			});

		});

	},
	getKeywords: function() {

		return new Promise(function(resolve, reject) {

			$.ajax({
			  	type: "POST",
			  	url: '//' + process.env.HOSTNAME + '/piqtionary/keywords',
			  	success: function(result) {
					resolve(result);
				},
			 	dataType: 'json',
			 	beforeSend: function (xhr) {
				    xhr.setRequestHeader ("Authorization", process.env.API_BASIC_AUTH);
				}
			});

		});

	},
	getById: function(params) {

		return new Promise(function(resolve, reject) {

			$.ajax({
			  	type: "POST",
			  	url: '//' + process.env.HOSTNAME + '/piqtionary/get_by_id',
			  	data: params,
			  	success: function(result) {
					resolve(result);
				},
			 	dataType: 'json',
			 	beforeSend: function (xhr) {
				    xhr.setRequestHeader ("Authorization", process.env.API_BASIC_AUTH);
				}
			});

		});

	}
};
