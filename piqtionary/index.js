var config = require('../config/piqtionary');
var mongo = require('mongodb');
var assert = require('assert');
var hbs = require('express-handlebars');

module.exports = function(app) {

	console.log('piqtionary app started');

	// bind handlebars views to express
	var viewsPath = __dirname + '/views';
	app.set('views', viewsPath);
	app.engine('hbs', hbs.create({
		defaultLayout: 'main',  
	 	layoutsDir: viewsPath + '/layouts',  
	 	partialsDir: viewsPath + '/partials',
	 	extname: 'hbs'
	}).engine);
	app.set('view engine', 'hbs');

	var url = 'mongodb://138.197.6.46/test';

	// render objects
	app.get('/admin/review-queue', function(req, res, next) {
	
		var resultArray = [];

		console.log(config);

		mongo.connect(url, function(err, db) {
			console.log('A')
			assert.equal(null, err);
			var cursor = db.collection('user-data').find().sort({_id: -1});
			cursor.forEach(function(doc, err) {
				console.log('AA')
				assert.equal(null, err);
				console.log('B')
				resultArray.push(doc);
			}, function() {
				db.close();
				console.log('C')
				console.log(resultArray);
				res.render('index', {
					title: 'Review Queue',
					items: resultArray
				});
			});

		});

	});

	app.post('/piqtionary/submit', function(req, res, next) {

		var item = {
			rendered_url: req.body.rendered_url,
			orig_photo_url: req.body.orig_photo_url,
			s3_url: req.body.s3_url,
			stylename: req.body.stylename,
			ig_username: req.body.ig_username
		};

		mongo.connect(url, function(err, db) {
			assert.equal(null, err);
			db.collection('user-data').insertOne(item, function(err, result) {
				assert.equal(null, err);
				console.log('Item inserted');
				db.close();
			});
		});

		res.end();
	});


}
