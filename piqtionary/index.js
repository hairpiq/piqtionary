var config = require('../config/piqtionary');
var mongo = require('mongodb');
var ObjectID = require("mongodb").ObjectID;
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

	// render objects
	app.get('/admin/review-queue', function(req, res, next) {

		console.log('A - called: /admin/review-queue');
	
		var resultArray = [];

		console.log(config);

		mongo.connect(config.mongo.url, function(err, db) {
			
			console.log('B - connected to db');

			assert.equal(null, err);
			var cursor = db.collection('pending_hairpiqs').find().sort({_id: -1});
			
			cursor.forEach(function(doc, err) {
			
				assert.equal(null, err);

				console.log('C - fetching doc: ' + doc._id);
				
				resultArray.push(doc);
			
			}, function() {
				
				db.close();

				console.log('D - disconnected from db');

				res.render('index', {
					title: 'Review Queue',
					items: resultArray
				});
			});

		});

	});

	app.post('/piqtionary/submit', function(req, res, next) {

		console.log('A - called: /piqtionary/submit');

		var item = {
			rendered_url: req.body.rendered_url,
			orig_photo_url: req.body.orig_photo_url,
			s3_url: req.body.s3_url,
			stylename: req.body.stylename,
			ig_username: req.body.ig_username
		};

		mongo.connect(config.mongo.url, function(err, db) {
			
			assert.equal(null, err);
			
			console.log('B - connected to db');
			
			db.collection('pending_hairpiqs').insertOne(item, function(err, result) {
						
				assert.equal(null, err);
				console.log('Item inserted into pending_hairpiqs');
				db.close();
				
				console.log('D - disconnected from db');
			
			});
		});

		res.end();
	});

	app.post('/piqtionary/approve', function(req, res, next) {

		console.log('A - called: /piqtionary/approve');

		// if hairpiq is approved
			// insert new into mongodb hairpiqs collection
			// delete hairpiq from pending_hairpiqs collection

			// data needed
			// - is_approved : boolean
			// - _id : string
			// - s3_url : string
			// - stylename : string
			// - ig_username : string
			// - status : string ("'unpublished' by default")

		var is_approved = req.body.is_approved;
		var pending_id = { _id: ObjectID(req.body._id) };

		var item = {
			s3_url: req.body.s3_url,
			stylename: req.body.stylename,
			ig_username: req.body.ig_username,
			publish_status: "unpublished"
		}

		mongo.connect(config.mongo.url, function(err, db) {
				
			assert.equal(null, err);
			
			console.log('B - connected to db');

			if (is_approved === 'true') {

				console.log('Item is approved');
			
				db.collection('approved_hairpiqs').insertOne(item, function(err, result) {
								
					assert.equal(null, err);
					console.log('C.A - Item inserted into approved_hairpiqs');
					removePendingHairpiq(pending_id);

				});

			} else {

				console.log('Item is rejected');

				db.collection('removed_hairpiqs').insertOne(item, function(err, result) {
								
					assert.equal(null, err);
					console.log('C.B - Item inserted into removed_hairpiqs');
					removePendingHairpiq(pending_id);

				});

			}

			function removePendingHairpiq() {

				db.collection('pending_hairpiqs').remove(pending_id, function(err, result) {
								
					assert.equal(null, err);
					console.log('Item removed from pending_hairpiqs');
					db.close();

					console.log('D - disconnected from db');
				
				});

			}

		});


		res.end();

	});

	app.post('/piqtionary/set_status', function(req, res, next) {

		console.log('A - called: /piqtionary/set_status');

		// set hairpiq status 
			// find hairpiq in approved_hairpiqs collection
			// set status "unpublished|published"

			// data needed
			// - _id
			// - publish_status

		var id = {
			_id: ObjectID(req.body._id)
		};

		var item = {
			publish_status: req.body.publish_status
		};


		mongo.connect(config.mongo.url, function(err, db) {
			
			assert.equal(null, err);
			
			console.log('B - connected to db');
			
			db.collection('approved_hairpiqs').update(id, { $set: item }, function(err, result) {
						
				assert.equal(null, err);
				console.log('Updated document in approved_hairpiqs');
				db.close();
				
				console.log('D - disconnected from db');
			
			});
		});

		res.end();

	});

	app.post('/piqtionary/delete', function(req, res, next) {

		console.log('A - called: /piqtionary/delete');

		// delete a hairpiq 
			// find hairpiq in removed_hairpiqs collection
			// delete

			// data needed
			// - _id

		var id = {
			_id: ObjectID(req.body._id)
		};

		mongo.connect(config.mongo.url, function(err, db) {
			
			assert.equal(null, err);
			
			console.log('B - connected to db');
			
			db.collection('pending_hairpiqs').remove(id, function(err, result) {
						
				assert.equal(null, err);
				console.log('Deleted document from removed_hairpiqs');
				db.close();
				
				console.log('D - disconnected from db');
			
			});
		});

		res.end();

	});

}
