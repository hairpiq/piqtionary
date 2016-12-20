module.exports = {
	getPendingList: function(params) {

		params.limit = 10;

		return new Promise(function(resolve, reject) {

			$.ajax({
			  	type: "POST",
			  	url: '//' + process.env.HOSTNAME + '/piqtionary/pending_list',
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
	moveToTrash: function(params) {

		params.is_approved = false;
		params.pending_id = params._id;
		delete params._id;

		return new Promise(function(resolve, reject) {

			$.ajax({
			  	type: "POST",
			  	url: '//' + process.env.HOSTNAME + '/piqtionary/approve',
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
	approve: function(params) {

		params.is_approved = true;
		params.pending_id = params._id;
		delete params._id;

		return new Promise(function(resolve, reject) {

			$.ajax({
			  	type: "POST",
			  	url: '//' + process.env.HOSTNAME + '/piqtionary/approve',
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
	update: function(params) {

		return new Promise(function(resolve, reject) {

			$.ajax({
			  	type: "POST",
			  	url: '//' + process.env.HOSTNAME + '/piqtionary/update',
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
}