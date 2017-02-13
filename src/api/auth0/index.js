var request = require('request');

module.exports = function(app) {

	console.log('auth0 api started');
	
	app.post('/api/auth0/update', function(req, res) {

		console.log('B - called: /api/auth0/update');

		let options = JSON.parse(req.body.options);

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log('C - auth0 user record updated: ' + body.user_id);

			//console.log(response.statusCode, body);

			res.send(JSON.stringify(body));

		});

	});

	app.post('/api/auth0/get', function(req, res) {

		console.log('B - called: /api/auth0/get');

		let options = JSON.parse(req.body.options);

		request(options, function (error, response, body) {

			if (error) throw new Error(error);

			//console.log(response.statusCode, body);

			res.send(JSON.stringify(body));

		});

	});

	app.post('/api/auth0/does_username_exist', function(req, res) {

		console.log('B - called: /api/auth0/does_username_exist');

		let submitted_username = req.body.username
		let options = JSON.parse(req.body.options);

		request(options, function (error, response, body) {

			if (error) throw new Error(error);

			let does_username_exist = false
			
			let result = JSON.parse(body)
			for(let i in result) {
				if (result[i].app_metadata !== undefined) {
					if (submitted_username === result[i].app_metadata.username) {
						does_username_exist = true
						break
					}
				}
			}

			//console.log(response.statusCode, body);

			res.send(JSON.stringify(does_username_exist));

		});

	});
}