var ObjectID = require("mongodb").ObjectID;
var assert = require('assert');

module.exports = function(app, db) {

	console.log('piqtionary api started');

	/*
		submit a hairpiq to the review queue
	*/

	app.post('/piqtionary/submit', function(req, res, next) {

		console.log('B - called: /piqtionary/submit');

		var item = {
			rendered_url: req.body.rendered_url,
			orig_photo_url: req.body.orig_photo_url,
			s3_url: req.body.s3_url,
			stylename: req.body.stylename,
			ig_username: req.body.ig_username
		};

		db.collection('pending_hairpiqs').insertOne(item, function(err, result) {
						
			assert.equal(null, err);
			console.log('C - Item inserted into pending_hairpiqs: ' + result.insertedId);

			res.end();
		
		});
	});

	/*
		approve or reject a hairpiq in the review queue
	*/

	app.post('/piqtionary/approve', function(req, res, next) {

		console.log('B - called: /piqtionary/approve');

		// if hairpiq is approved
			// insert new into mongodb hairpiqs collection
			// delete hairpiq from pending_hairpiqs collection

			// data needed
			// - is_approved : boolean
			// - pending_id : string
			// - s3_url : string
			// - stylename : string
			// - ig_username : string
			// - status : string ("'unpublished' by default")

		var is_approved = req.body.is_approved;
		var pending_id = { _id: ObjectID(req.body.pending_id) };

		var item = {
			s3_url: req.body.s3_url,
			stylename: req.body.stylename,
			ig_username: req.body.ig_username,
			publish_status: "unpublished"
		}

		if (is_approved === 'true') {

			console.log('Item is approved');
		
			db.collection('approved_hairpiqs').insertOne(item, function(err, result) {
							
				assert.equal(null, err);
				console.log('C.A - Item inserted into approved_hairpiqs: ' + result.insertedId);
				removePendingHairpiq(pending_id);

			});

		} else {

			console.log('Item is rejected');

			db.collection('removed_hairpiqs').insertOne(item, function(err, result) {
							
				assert.equal(null, err);
				console.log('C.B - Item inserted into removed_hairpiqs: ' + result.insertedId);
				removePendingHairpiq(pending_id);

			});

		}

		function removePendingHairpiq() {

			db.collection('pending_hairpiqs').remove(pending_id, function(err, result) {
							
				assert.equal(null, err);
				console.log('D - Item removed from pending_hairpiqs: ' + pending_id._id);

				res.end();
			
			});

		}

	});

	/*
		update a hairpiq published status
	*/

	app.post('/piqtionary/set_status', function(req, res, next) {

		console.log('B - called: /piqtionary/set_status');

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
				
		db.collection('approved_hairpiqs').update(id, { $set: item }, function(err, result) {
					
			assert.equal(null, err);
			console.log('C - Updated document in approved_hairpiqs: ' + id._id);

			res.end();
		
		});

	});

	/*
		delete a hairpiq
	*/

	app.post('/piqtionary/delete', function(req, res, next) {

		console.log('B - called: /piqtionary/delete');

		// delete a hairpiq 
			// find hairpiq in removed_hairpiqs collection
			// delete

			// data needed
			// - _id

		var id = {
			_id: ObjectID(req.body._id)
		};
					
		db.collection('pending_hairpiqs').remove(id, function(err, result) {
					
			assert.equal(null, err);
			console.log('C - Deleted document from removed_hairpiqs: ' + id._id);

			res.end();
		
		});

	});

	/*
		retrieve a list of hairpiqs
	*/

	app.post('/piqtionary/list', function(req, res, next) {

		console.log('B - called: /piqtionary/list');

		// find a collection of hairpiqs
		// limit - the amount of docs to return
		// page_num - the index of the set of docs to return

		var resultArray = [];
		var query = {'publish_status': 'published'};

		if (req.body.limit !== undefined && req.body.limit.length > 0) {
			var limit = Number(req.body.limit);
			var skip = Number(req.body.page_num) * Number(req.body.limit);

			// if a keyword is included, add it to the query
			if (req.body.term)
				query.stylename = new RegExp('^'+ req.body.term + '$', "i");

			var cursor = db.collection('approved_hairpiqs').find(query).skip(skip).sort({ _id : -1}).limit(limit);

			cursor.forEach(function(doc, err) {
					
				console.log('C.A - Retrieved document in approved_hairpiqs: ' + doc._id);
				assert.equal(null, err);
				resultArray.push(doc);

			}, function() {
								
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(resultArray));

			});

		} else {
			console.log('C.B - No limit supplied.');
			res.send('No limit supplied.');
		}

	});

	/*
		create database keyword json for AutoComplete module
	*/

	app.post('/piqtionary/keywords', function(req, res, next) {

		console.log('B - called: /piqtionary/keywords');

		var resultArray = [];

		var cursor = db.collection('word_count').find().sort({ value: -1 });
		cursor.forEach(function(doc, err) {
					
			console.log('C - Retrieved document in word_count: ' + doc._id);
			assert.equal(null, err);
			resultArray.push(doc._id);

		}, function() {
							
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(resultArray));

		});

	});

	/*
		get a hairpiq document by id
	*/

	app.post('/piqtionary/get_by_id', function(req, res, next) {

		console.log('B - called: /piqtionary/get_by_id');

		// get a hairpiq by id
			// find hairpiq in approved_hairpiqs collection

			// data needed
			// - _id

		var id = {
			_id: ObjectID(req.body._id)
		};

		var resultArray = [];

		var cursor = db.collection('approved_hairpiqs').find(id);

		cursor.forEach(function(doc, err) {
				
			console.log('C - Retrieved document in approved_hairpiqs: ' + doc._id);
			assert.equal(null, err);
			resultArray.push(doc);

		}, function() {
							
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(resultArray));

		});

	});


}