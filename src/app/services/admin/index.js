if (typeof window !== 'object')
	require('dotenv').config();

var config = process.env;

module.exports = {
	getPendingList: function(params) {

		params.limit = 10;

		return execute('//' + config.HOSTNAME + '/api/piqtionary/pending', params);
		
	},
	reject: function(params) {

		params.is_approved = false;
		params.pending_id = params._id;
		delete params._id;

		return execute('//' + config.HOSTNAME + '/api/piqtionary/approve', params);
		
	},
	approve: function(params) {

		params.is_approved = true;
		params.pending_id = params._id;
		delete params._id;

		return execute('//' + config.HOSTNAME + '/api/piqtionary/approve', params);
		
	},
	update: function(params) {

		return execute('//' + config.HOSTNAME + '/api/piqtionary/update', params);

	},
	getList: function(params) {

		params.limit = 10;

		return execute('//' + config.HOSTNAME + '/api/piqtionary/list', params);

	},
	getUnpublished: function(params) {

		params.limit = 10;

		return execute('//' + config.HOSTNAME + '/api/piqtionary/unpublished', params);

	},
	publish: function(params) {

		params.publish_status = 'published';

		return execute('//' + config.HOSTNAME + '/api/piqtionary/set_status', params);

	},
	unpublish: function(params) {

		params.publish_status = 'unpublished';

		return execute('//' + config.HOSTNAME + '/api/piqtionary/set_status', params);

	},
	moveToTrash: function(params) {

		return execute('//' + config.HOSTNAME + '/api/piqtionary/move_to_trash', params);
		
	},
	getTrashedList: function(params) {

		params.limit = 10;

		return execute('//' + config.HOSTNAME + '/api/piqtionary/trashed', params);

	},
	restore: function(params) {
		return execute('//' + config.HOSTNAME + '/api/piqtionary/restore', params);
	},
	delete: function(params) {

		return execute('//' + config.HOSTNAME + '/api/piqtionary/delete', params);
		
	},
	getUntrained: function(params) {

		params.limit = 10;

		return execute('//' + config.HOSTNAME + '/api/piqtionary/untrained', params);
		
	},
	refreshKeywords: function() {

		return execute('//' + config.HOSTNAME + '/api/piqtionary/refresh_keywords', {});

	},
	getAllUserData: function(params = null) {

		return execute('//' + config.HOSTNAME + '/api/piqtionary/get_all_user_data', params);

	},
	hairpiqCreator: {
		validate: function(params) {

			return execute('//' + config.HOSTNAME + '/api/hairpiq_creator/validate', params);

		},
		delete: function(params) {

			return execute('//' + config.HOSTNAME + '/api/hairpiq_creator/delete', params);

		},
		addPreRendered: function(params) {
			
			return execute('//' + config.HOSTNAME + '/api/hairpiq_creator/add_prerendered', params);

		},
		render: function(params) {

			return execute('//' + config.HOSTNAME + '/api/hairpiq_creator/render', params);

		},
		train: function(params) {

			return execute('//' + config.HOSTNAME + '/api/hairpiq_creator/train', params);
			
		},
	}
}

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
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
		        console.log("Status: " + textStatus);
		        console.log("Error: " + errorThrown); 
		        reject(errorThrown);
		    }  
		});

	});
}