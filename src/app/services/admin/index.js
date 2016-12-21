var config = process.env;

module.exports = {
	getPendingList: function(params) {

		params.limit = 10;

		return get('//' + config.HOSTNAME + '/piqtionary/pending', params);
		
	},
	reject: function(params) {

		params.is_approved = false;
		params.pending_id = params._id;
		delete params._id;

		console.log(params);

		return get('//' + config.HOSTNAME + '/piqtionary/approve', params);
		
	},
	approve: function(params) {

		params.is_approved = true;
		params.pending_id = params._id;
		delete params._id;

		return get('//' + config.HOSTNAME + '/piqtionary/approve', params);
		
	},
	update: function(params) {

		return get('//' + config.HOSTNAME + '/piqtionary/update', params);

	},
	getList: function(params) {

		params.limit = 10;

		return get('//' + config.HOSTNAME + '/piqtionary/list', params);

	},
	getUnpublished: function(params) {

		params.limit = 10;

		return get('//' + config.HOSTNAME + '/piqtionary/unpublished', params);

	},
	publish: function(params) {

		params.publish_status = 'published';

		return get('//' + config.HOSTNAME + '/piqtionary/set_status', params);

	},
	unpublish: function(params) {

		params.publish_status = 'unpublished';

		return get('//' + config.HOSTNAME + '/piqtionary/set_status', params);

	},
	moveToTrash: function(params) {

		return get('//' + config.HOSTNAME + '/piqtionary/move_to_trash', params);
		
	},
	getTrashedList: function(params) {

		params.limit = 10;

		return get('//' + config.HOSTNAME + '/piqtionary/trashed', params);

	},
	delete: function(params) {

		return get('//' + config.HOSTNAME + '/piqtionary/delete', params);
		
	}
}

function get(url, params) {

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

	});
}