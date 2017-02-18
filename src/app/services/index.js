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
			  	url: '//' + config.HOSTNAME + '/api/piqtionary/keywords',
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
	setUserData: function(params) {

		return execute('//' + config.HOSTNAME + '/api/piqtionary/set_user_data', params);

	},
	getUserData: function(params) {

		return execute('//' + config.HOSTNAME + '/api/piqtionary/get_user_data', params);

	},
	deleteUserData: function(params) {

		return execute('//' + config.HOSTNAME + '/api/piqtionary/delete_user_data', params);		

	},
	getUserHairpiqs: function(params) {

		params.limit = 10;

		return execute('//' + config.HOSTNAME + '/api/piqtionary/get_user_hairpiqs', params);

	},
	addToFavorites: function (params) {
		
		return execute('//' + config.HOSTNAME + '/api/piqtionary/add_to_favorites', params);
		
	},
	getFavorites: function (params) {

		return execute('//' + config.HOSTNAME + '/api/piqtionary/get_favorites', params);

	},
	removeFromFavorites: function (params) {
		
		return execute('//' + config.HOSTNAME + '/api/piqtionary/remove_from_favorites', params);
		
	},
	getListByFavorites: function (params) {

		return execute('//' + config.HOSTNAME + '/api/piqtionary/list_by_favorites', params);

	},
	hairtips: {
		add: function(params) {

			return execute('//' + config.HOSTNAME + '/api/piqtionary/add_hairtip', params);

		},
		getAll: function(params = {}) {

			return execute('//' + config.HOSTNAME + '/api/piqtionary/get_all_hairtips', params);

		},
		getAllByUserId: function(params) {

			return execute('//' + config.HOSTNAME + '/api/piqtionary/get_hairtips_by_user_id', params);

		},
		edit: function(params) {

			return execute('//' + config.HOSTNAME + '/api/piqtionary/edit_hairtip', params);

		},
		getHairtipByHairpiqId: function(params) {

			return execute('//' + config.HOSTNAME + '/api/piqtionary/get_hairtip_by_hairpiq_id', params);

		},
		delete: function(params) {

			return execute('//' + config.HOSTNAME + '/api/piqtionary/delete_hairtip', params);

		},
	},
	auth0: {
		updateUser: function(params) {

			return execute('//' + config.HOSTNAME + '/api/auth0/update', params);

		},
		getUser: function(params) {

			return execute('//' + config.HOSTNAME + '/api/auth0/get', params);

		},
		deleteUser: function(params) {

			return execute('//' + config.HOSTNAME + '/api/auth0/get', params);

		},
		doesUsernameExist: function(params) {

			return execute('//' + config.HOSTNAME + '/api/auth0/does_username_exist', params);

		}
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

			return execute('//' + config.HOSTNAME + '/api/hairpiq_creator/get_tags', params);

		},
		shortenUrl: function(params) {

			return execute('//' + config.HOSTNAME + '/api/hairpiq_creator/shorten_url', params);

		},

	},
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
