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
		
	}
}