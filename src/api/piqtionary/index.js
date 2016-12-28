var ObjectID = require("mongodb").ObjectID;
var assert = require('assert');
var config = process.env;
var request = require('request');

module.exports = function(app, db) {

	console.log('piqtionary api started');

	/*
		submit a hairpiq to the review queue
	*/

	app.post('/api/piqtionary/submit', function(req, res, next) {

		console.log('B - called: /api/piqtionary/submit');

		var item = {
			rendered_url: req.body.rendered_url,
			orig_photo_url: req.body.orig_photo_url,
			s3_url: req.body.s3_url,
			stylename: req.body.stylename,
			ig_username: req.body.ig_username
		};

		if (req.body.options !== undefined)
			item.options = req.body.options;


		db.collection('pending_hairpiqs').insertOne(item, function(err, result) {
						
			assert.equal(null, err);
			console.log('C - Item inserted into pending_hairpiqs: ' + result.insertedId);

			res.send(JSON.stringify('success'));
		
		});
	});

	/*
		approve or reject a hairpiq in the review queue
	*/

	app.post('/api/piqtionary/approve', function(req, res, next) {

		console.log('B - called: /api/piqtionary/approve');

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

			request({
			    url: 'http://' + config.HOSTNAME + '/api/hairpiq_creator/educate', //URL to hit
			    qs: {time: +new Date()}, //Query string data
			    method: 'POST',
			    headers : {
			        "Authorization" : config.API_BASIC_AUTH
				},
			    //Lets post the following key/values as form
			    json: item
				},
				function(error, response, body) {
				    if(error) {
				        console.log(error);
				    } else {
				    	console.log(body);
					}
				}
			)
		
			db.collection('approved_hairpiqs').insertOne(item, function(err, result) {
							
				assert.equal(null, err);
				console.log('C.A - Item inserted into approved_hairpiqs: ' + result.insertedId);
				removePendingHairpiq();

			});

		} else {

			item.orig_photo_url = req.body.orig_photo_url;
			item.rendered_url = req.body.rendered_url;
			item.pending_id = pending_id._id;

			console.log('Item is rejected');

			db.collection('removed_hairpiqs').insertOne(item, function(err, result) {
							
				assert.equal(null, err);
				console.log('C.B - Item inserted into removed_hairpiqs: ' + result.insertedId);
				removePendingHairpiq();

			});

		}

		function removePendingHairpiq() {

			db.collection('pending_hairpiqs').remove(pending_id, function(err, result) {
							
				assert.equal(null, err);
				console.log('D - Item removed from pending_hairpiqs: ' + pending_id._id);

				// if hairpiq is approved, delete original photo asset
				if (is_approved === 'true')
					deleteAsset();
				
				res.send(JSON.stringify('success'));
			
			});

		}

		function deleteAsset() {

			var params = {};
			var pieces = req.body.orig_photo_url.split('/');
			params.cloudinary_id = pieces[pieces.length - 1];

			request({
			    url: 'http://' + config.HOSTNAME + '/api/hairpiq_creator/delete', //URL to hit
			    qs: {time: +new Date()}, //Query string data
			    method: 'POST',
			    headers : {
			        "Authorization" : config.API_BASIC_AUTH
				},
			    //Lets post the following key/values as form
			    json: params
				},
				function(error, response, body) {
				    if(error) {
				        console.log(error);
				    } else {
				    	console.log(body);
					}
				}
			)

		}

	});

	/*
		update a hairpiq published status
	*/

	app.post('/api/piqtionary/set_status', function(req, res, next) {

		console.log('B - called: /api/piqtionary/set_status');

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

			res.send(JSON.stringify('success'));
		
		});

	});

	/*
		move hairpiq to trash
	*/

	app.post('/api/piqtionary/move_to_trash', function(req, res, next) {

		console.log('B - called: /api/piqtionary/move_to_trash');

		// delete a hairpiq 
			// insert hairpiq in removed_hairpiqs collection
			// find hairpiq in approved_hairpiqs collection
				// delete

		var id = {
			_id: ObjectID(req.body._id)
		};

		var item = {
			s3_url: req.body.s3_url,
			stylename: req.body.stylename,
			ig_username: req.body.ig_username,
			publish_status: req.body.publish_status,
			approved_id: id._id
		}

		db.collection('removed_hairpiqs').insertOne(item, function(err, result) {
							
			assert.equal(null, err);
			console.log('C.A - Item inserted into removed_hairpiqs: ' + result.insertedId);
			removeApprovedHairpiq();

		});

		function removeApprovedHairpiq() {
					
			db.collection('approved_hairpiqs').remove(id, function(err, result) {
						
				assert.equal(null, err);
				console.log('C - Deleted document from approved_hairpiqs: ' + id._id);

				res.send(JSON.stringify('success'));
			
			});
		}

	});

	/*
		delete a hairpiq
	*/

	app.post('/api/piqtionary/delete', function(req, res, next) {

		console.log('B - called: /api/piqtionary/delete');

		// delete a hairpiq 
			// find hairpiq in removed_hairpiqs collection
			// delete

			// data needed
			// - _id

		var id = {
			_id: ObjectID(req.body._id)
		};
					
		db.collection('removed_hairpiqs').remove(id, function(err, result) {
					
			assert.equal(null, err);
			console.log('C - Deleted document from removed_hairpiqs: ' + id._id);

			// delete images via hairpiq creator api

			deleteAssets();
		
		});

		function deleteAssets() {

			var params = {};
		
			if (req.body.s3_url !== undefined)
				params.s3_url = req.body.s3_url;
			if (req.body.orig_photo_url !== undefined && req.body.orig_photo_url.length > 0) {
				var pieces = req.body.orig_photo_url.split('/');
				params.cloudinary_id = pieces[ pieces.length - 1].split('.jpg')[0];
			}

			request({
			    url: 'http://' + config.HOSTNAME + '/api/hairpiq_creator/delete', //URL to hit
			    qs: {time: +new Date()}, //Query string data
			    method: 'POST',
			    headers : {
			        "Authorization" : config.API_BASIC_AUTH
				},
			    //Lets post the following key/values as form
			    json: params
				}, function(error, response, body){
				    if(error) {
				        console.log(error);
				    } else {
				    	res.send(JSON.stringify('success'));
				}
			});

		}

	});

	/*
		retrieve a list of hairpiqs
	*/

	app.post('/api/piqtionary/list', function(req, res, next) {

		console.log('B - called: /api/piqtionary/list');

		// find a collection of hairpiqs
		// limit - the amount of docs to return
		// page_num - the index of the set of docs to return

		var resultArray = [];
		var query = {'publish_status': 'published'};

		if (req.body.limit !== undefined && req.body.limit.length > 0) {
			var limit = Number(req.body.limit);
			var skip = Number(req.body.page_num) * Number(req.body.limit);
			var sort = { _id : -1};

			//db.messages.find({$text: {$search: "cook"}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}})

			// if a keyword is included, add it to the query
			if (req.body.term) {
				query.$text = { $search: req.body.term };
				//query.score = { $meta: "textScore" };
				//sort = { score: { $meta:"textScore" } };
			}

			var cursor = db.collection('approved_hairpiqs').find(query).skip(skip).sort(sort).limit(limit);

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

	app.post('/api/piqtionary/keywords', function(req, res, next) {

		console.log('B - called: /api/piqtionary/keywords');

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

	app.post('/api/piqtionary/get_by_id', function(req, res, next) {

		console.log('B - called: /api/piqtionary/get_by_id');

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

	/*
		retrieve a list of pending hairpiqs
	*/

	app.post('/api/piqtionary/pending', function(req, res, next) {

		console.log('B - called: /api/piqtionary/pending');

		// find a collection of pending hairpiqs
		// limit - the amount of docs to return
		// page_num - the index of the set of docs to return

		var resultArray = [];

		if (req.body.limit !== undefined && req.body.limit.length > 0) {
			var limit = Number(req.body.limit);
			var skip = Number(req.body.page_num) * Number(req.body.limit);

			var cursor = db.collection('pending_hairpiqs').find().skip(skip).sort({ _id : -1}).limit(limit);

			cursor.forEach(function(doc, err) {
					
				console.log('C.A - Retrieved document in pending_hairpiqs: ' + doc._id);
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
		update a hairpiq
	*/

	app.post('/api/piqtionary/update', function(req, res, next) {

		// re-render hairpiq via hairpiq creator api
		// update the hairpiq document
		// - s3_url
		// - stylename
		// - ig_username
		// return as success

		console.log('B - called: /api/piqtionary/update');

		var params = {
			orig_photo_url: req.body.orig_photo_url,
			stylename: req.body.updated_stylename,
			ig_username: req.body.updated_ig_username
		}

		if (req.body.options !== undefined)
			params.options = req.body.options;

		// recomposite hairpiq

		request({
		    url: 'http://' + config.HOSTNAME + '/api/hairpiq_creator/update', //URL to hit
		    qs: {time: +new Date()}, //Query string data
		    method: 'POST',
		    headers : {
		        "Authorization" : config.API_BASIC_AUTH
			},
		    //Lets post the following key/values as form
		    json: params
			}, function(error, response, body){
			    if(error) {
			        console.log(error);
			    } else {
			        updateDoc();
			}
		});

		// update hairpiq in database
		function updateDoc() {

			var id = {
				_id: ObjectID(req.body._id)
			};
					
			db.collection('pending_hairpiqs').update(id, { $set: params }, function(err, result) {
						
				assert.equal(null, err);
				console.log('C - Updated document in approved_hairpiqs: ' + id._id);
				res.send(JSON.stringify('success'));
			
			});
		}

	});

	/*
		retrieve a list of hairpiqs by publish status
	*/

	app.post('/api/piqtionary/unpublished', function(req, res, next) {

		console.log('B - called: /api/piqtionary/unpublished');

		// find a collection of hairpiqs that are unpublished
		// limit - the amount of docs to return
		// page_num - the index of the set of docs to return

		var resultArray = [];
		var query = {'publish_status': 'unpublished'};

		if (req.body.limit !== undefined && req.body.limit.length > 0) {
			var limit = Number(req.body.limit);
			var skip = Number(req.body.page_num) * Number(req.body.limit);

			var cursor = db.collection('approved_hairpiqs').find(query).skip(skip).sort({ _id : -1}).limit(limit);

			cursor.forEach(function(doc, err) {
					
				console.log('C.A - Retrieved unpublished document in approved_hairpiqs: ' + doc._id);
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
		retrieve a list of hairpiqs by publish status
	*/

	app.post('/api/piqtionary/trashed', function(req, res, next) {

		console.log('B - called: /api/piqtionary/trashed');

		// find a collection of hairpiqs that are in trash
		// limit - the amount of docs to return
		// page_num - the index of the set of docs to return

		var resultArray = [];

		if (req.body.limit !== undefined && req.body.limit.length > 0) {
			var limit = Number(req.body.limit);
			var skip = Number(req.body.page_num) * Number(req.body.limit);

			var cursor = db.collection('removed_hairpiqs').find().skip(skip).sort({ _id : -1}).limit(limit);

			cursor.forEach(function(doc, err) {
					
				console.log('C.A - Retrieved trashed document in removed_hairpiqs: ' + doc._id);
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
		restore hairpiq from trash
	*/

	app.post('/api/piqtionary/restore', function(req, res, next) {

		console.log('B - called: /api/piqtionary/restore');

		// restore a hairpiq 
			// if hairpiq has approved_id property
				// insert into approved_hairpiqs collection
			// else if hairpiq has pending_id property
				// insert into pending_hairpiqs collection
			// then find hairpiq in removed_hairpiqs collection
				// delete

		var id = {
			_id: ObjectID(req.body._id)
		};
		var item = req.body;
		var restored_collection = '[restored_collection_name_here]';

		if (req.body.approved_id !== undefined) {
			
			var approved_id = { _id: ObjectID(req.body.approved_id) };
			item._id = approved_id._id;
			restored_collection = 'approved_hairpiqs';

		} else if (req.body.pending_id !== undefined) {

			var pending_id = { _id: ObjectID(req.body.pending_id) };
			item._id = pending_id._id;
			restored_collection = 'pending_hairpiqs';

		}

		db.collection(restored_collection).save(item, {w:1}, function(err, result) {
							
			assert.equal(null, err);
			console.log('C.A - Item inserted into ' + restored_collection + ': ' + result.insertedId);
			removeTrashedHairpiq();

		});

		function removeTrashedHairpiq() {
					
			db.collection('removed_hairpiqs').remove(id, function(err, result) {
						
				assert.equal(null, err);
				console.log('C - Deleted document from removed_hairpiqs: ' + id._id);

				res.send(JSON.stringify('success'));
			
			});
		}

	});

}