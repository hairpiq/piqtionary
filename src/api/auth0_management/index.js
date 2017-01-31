var request = require('request');

module.exports = function(app) {

	console.log('auth0 management api started');
	
	app.post('/api/auth0_management/update', function(req, res) {

		console.log('B - called: /api/auth0_management/update');

		let options = JSON.parse(req.body.options);

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log('C - auth0 user record updated: ' + body.user_id);

			//console.log(response.statusCode, body);

			res.send(JSON.stringify(body));

		});

	});

	app.post('/api/auth0_management/get', function(req, res) {

		console.log('B - called: /api/auth0_management/get');

		let options = JSON.parse(req.body.options);

		request(options, function (error, response, body) {

			if (error) throw new Error(error);

			//console.log(response.statusCode, body);

			res.send(JSON.stringify(body));

		});

	});
}