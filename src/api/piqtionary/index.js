var ObjectID = require("mongodb").ObjectID;
var assert = require('assert');
var config = process.env;
var request = require('request');
var validator = require('validator');

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
			stylename: validator.escape(req.body.stylename),
			ig_username: validator.escape(req.body.ig_username),
			auth0_user_id: req.body.auth0_user_id
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
			// - auth0_user_id : string

		var is_approved = req.body.is_approved;
		var pending_id = { _id: ObjectID(req.body.pending_id) };

		var item = {
			s3_url: req.body.s3_url,
			stylename: validator.escape(req.body.stylename),
			ig_username: validator.escape(req.body.ig_username),
			publish_status: "unpublished",
			trained_status: "untrained",
			auth0_user_id: req.body.auth0_user_id
		}

		if (is_approved === 'true') {

			console.log('Item is approved');
		
			db.collection('approved_hairpiqs').insertOne(item, function(err, result) {
							
				assert.equal(null, err);
				console.log('C.A - Item inserted into approved_hairpiqs: ' + result.insertedId);
				removePendingHairpiq();

			});

		} else {

			item.orig_photo_url =  req.body.orig_photo_url;
			item.rendered_url =  req.body.rendered_url;
			item.pending_id =  pending_id._id;

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
				query.$text = { $search: validator.escape(req.body.term) };
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
			stylename: validator.escape(req.body.updated_stylename),
			ig_username: validator.escape(req.body.updated_ig_username)
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
			item._id =approved_id._id;
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

	/*
		train hairpiq.com
	*/

	app.post('/api/piqtionary/untrained', function(req, res, next) {

		console.log('B - called: /api/piqtionary/untrained');

		// find a collection of untrained hairpiqs
		// limit - the amount of docs to return
		// page_num - the index of the set of docs to return

		var resultArray = [];
		var query = {'trained_status': 'untrained'};

		if (req.body.limit !== undefined && req.body.limit.length > 0) {
			var limit = Number(req.body.limit);

			var cursor = db.collection('approved_hairpiqs').find(query).sort({ _id : -1}).limit(limit);

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
		train hairpiq.com
	*/

	app.post('/api/piqtionary/trained_status', function(req, res, next) {

		console.log('B - called: /api/piqtionary/trained_status');

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
			trained_status: req.body.trained_status
		};
		
		db.collection('approved_hairpiqs').update(id, { $set: item }, function(err, result) {
					
			assert.equal(null, err);
			console.log('C - Updated document in approved_hairpiqs: ' + id._id);

			res.send(JSON.stringify('success'));
		
		});


	});

	/*
		train hairpiq.com
	*/

	app.post('/api/piqtionary/refresh_keywords', function(req, res, next) {

		console.log('B - called: /api/piqtionary/refresh_keywords');

		db.collection('word_count').drop(function(err, result) {

			assert.equal(null, err);

			var map = function() {
			
				if(this.publish_status === 'published') {
					var summary = this.stylename;
					if (summary) { 
						// quick lowercase to normalize per your requirements
						summary = summary.toLowerCase().split(" ");
						for (var i = summary.length - 1; i >= 0; i--) {
						// might want to remove punctuation, etc. here
						if (summary[i])  {
							// make sure there's something
							emit(summary[i], 1); // store a 1 for each word
							}
						}
					}

					summary = this.ig_username;
					if (summary) { 
						// quick lowercase to normalize per your requirements
						summary = summary.toLowerCase().split(" ");
						for (var i = summary.length - 1; i >= 0; i--) {
						// might want to remove punctuation, etc. here
						if (summary[i])  {
							// make sure there's something
							emit(summary[i], 1); // store a 1 for each word
							}
						}
					}
				
				}
			};

			var reduce = function( key, values ) {    
			    var count = 0;    
			    values.forEach(function(v) {            
			        count +=v;    
			    });
			    return count;
			}

			db.collection('approved_hairpiqs').mapReduce(map, reduce, {out: "word_count" }, function(err, result) {
						
				assert.equal(null, err);
				console.log('C - Updated word_count in approved_hairpiqs');

				res.send(JSON.stringify('success'));
			
			});
		
		});

	});

	/*
		update a user's data
	*/

	app.post('/api/piqtionary/set_user_data', function(req, res, next) {

		console.log('B - called: /api/piqtionary/set_user_data');

		// set a user's data
			// find user record in user_data collection
				// if exists
					// update record
				// else
					// create new record

			// data needed
			// - auth0_user_id
			// - username
			// - fullname

		var query = {
			auth0_user_id: req.body.auth0_user_id
		};

		var item = {};
		if (req.body.username !== undefined)
			item.username = req.body.username

		if (req.body.fullname !== undefined)
			item.fullname = req.body.fullname

		if (req.body.picture !== undefined)
			item.picture = req.body.picture

		var resultArray = []
		var cursor = db.collection('user_data').find(query)
		
		cursor.forEach(function(doc, err) {
					
			console.log('C.A - Retrieved document in user_data: ' + doc._id);
			//assert.equal(null, err);
			resultArray.push(doc);

		}, function() {

			if (resultArray.length > 0) {
				
				if (resultArray[0].username !== item.username ||
					resultArray[0].fullname !== item.fullname ||
					resultArray[0].picture !== item.picture ) {
					
					db.collection('user_data').update(query, { $set: item }, function(err, result) {
								
						assert.equal(null, err);
						console.log('C.B - Updated document in user_data: ' + query.auth0_user_id);

						res.send(JSON.stringify('success'));
					
					});
				} else {

					console.log('C.B - nothing to update: ' + query.auth0_user_id);

					res.send(JSON.stringify('nothing to update'));

				}

			} else {

				item.auth0_user_id = req.body.auth0_user_id

				db.collection('user_data').insertOne(item, function(err, result) {
							
					assert.equal(null, err);
					console.log('C.B - Item inserted into user_data: ' + result.insertedId);

					res.send(JSON.stringify('success'));
				
				});

			}

		});
		
	});

	/*
		get user's metadata
	*/

	app.post('/api/piqtionary/get_user_data', function(req, res, next) {

		console.log('B - called: /api/piqtionary/get_user_data');

		// get user data
			// find doc in user_data collection

			// data needed
			// - username

		var query = {};

		if (req.body.username !== undefined)
			query.username = req.body.username
		else if (req.body.auth0_user_id !== undefined)
			query.auth0_user_id = req.body.auth0_user_id

		var resultArray = [];

		var cursor = db.collection('user_data').find(query);

		cursor.forEach(function(doc, err) {
				
			console.log('C - Retrieved document in user_data: ' + doc._id);
			assert.equal(null, err);
			resultArray.push(doc);

		}, function() {
							
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(resultArray));

		});

	});

	/*
		remove user's metadata
	*/

	app.post('/api/piqtionary/delete_user_data', function(req, res, next) {

		console.log('B - called: /api/piqtionary/delete_user_data');

		// get user data
			// find doc in user_data collection

			// data needed
			// - username

		var query = {
			auth0_user_id: req.body.auth0_user_id
		};

		
		db.collection('user_data').remove(query, function(err, result) {
					
			assert.equal(null, err);
			console.log('C - Deleted document from user_data: ' + query.auth0_user_id);

			res.send(JSON.stringify('success'));
		
		});

	});

	/*
		get all user's metadata
	*/

	app.post('/api/piqtionary/get_all_user_data', function(req, res, next) {

		console.log('B - called: /api/piqtionary/get_all_user_data');

		// get user data
			// find docs in user_data collection

		var resultArray = [];

		var cursor = db.collection('user_data').find();

		cursor.forEach(function(doc, err) {
				
			console.log('C - Retrieved document in user_data: ' + doc._id);
			assert.equal(null, err);
			resultArray.push(doc);

		}, function() {
							
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(resultArray));

		});

	});

	/*
		add hairpiq to user favorites
	*/

	app.post('/api/piqtionary/add_to_favorites', function(req, res, next) {

		console.log('B - called: /api/piqtionary/add_to_favorites');

		// insert new data into user_favorites collection

		// data needed
		// - auth0_user_id : string
		// - hairpiq_id : string

		var item = {
			auth0_user_id: req.body.auth0_user_id,
			hairpiq_id: req.body.hairpiq_id,
		}

		db.collection('user_favorites').insertOne(item, function(err, result) {
							
			assert.equal(null, err);
			console.log('C.A - Item inserted into user_favorites: ' + result.insertedId);

			//res.send(JSON.stringify('success'));

			getFavorites()

		});

		function getFavorites() {

			var id = {
				auth0_user_id: req.body.auth0_user_id
			};

			var resultArray = [];

			var cursor = db.collection('user_favorites').find(id);

			cursor.forEach(function(doc, err) {
					
				console.log('C - Retrieved document in user_favorites: ' + doc._id);
				assert.equal(null, err);
				resultArray.push(doc);

			}, function() {
								
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(resultArray));

			});
			
		}

	});

	/*
		get user favorites
	*/

	app.post('/api/piqtionary/get_favorites', function(req, res, next) {

		console.log('B - called: /api/piqtionary/get_favorites');

		// insert new data into user_favorites collection

		// data needed
		// - auth0_user_id : string

		var id = {
			auth0_user_id: req.body.auth0_user_id
		};

		var resultArray = [];

		var	cursor = db.collection('user_favorites').find(id);

		cursor.forEach(function(doc, err) {
				
			console.log('C - Retrieved document in user_favorites: ' + doc._id);
			assert.equal(null, err);
			resultArray.push(doc);

		}, function() {
							
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(resultArray));

		});

	});

	/*
		remove hairpiq from user favorites
	*/

	app.post('/api/piqtionary/remove_from_favorites', function(req, res, next) {

		console.log('B - called: /api/piqtionary/remove_from_favorites');

		// insert new data into user_favorites collection

		// data needed
		// - auth0_user_id : string
		// - hairpiq_id : string

		var item = {
			auth0_user_id: req.body.auth0_user_id,
			hairpiq_id: req.body.hairpiq_id,
		}

		db.collection('user_favorites').remove(item, function(err, result) {
							
			assert.equal(null, err);
			console.log('C.A - Item removed from user_favorites for auth0_user_id: ' + item.auth0_user_id);

			//res.send(JSON.stringify('success'));

			getFavorites()

		});

		function getFavorites() {

			var id = {
				auth0_user_id: req.body.auth0_user_id
			};

			var resultArray = [];

			var cursor = db.collection('user_favorites').find(id);

			cursor.forEach(function(doc, err) {
					
				console.log('C - Retrieved document in user_favorites: ' + doc._id);
				assert.equal(null, err);
				resultArray.push(doc);

			}, function() {
								
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(resultArray));

			});
			
		}

	});

	/*
		get user favorites
	*/

	app.post('/api/piqtionary/list_by_favorites', function(req, res, next) {

		console.log('B - called: /api/piqtionary/list_by_favorites');

		// get the actual hairpiq docs that a user has favorited

		// data needed
		// - auth0_user_id : string
		// 

		var id = {
			auth0_user_id: req.body.auth0_user_id
		};

		var resultArray = [];

		if (req.body.limit !== undefined && req.body.limit.length > 0) {
			var limit = Number(req.body.limit);
			var skip = Number(req.body.page_num) * Number(req.body.limit);
			var sort = { _id : -1};

			var user_favorites_cursor = db.collection('user_favorites').find(id).skip(skip).sort(sort).limit(limit);

			user_favorites_cursor.forEach(function(doc, err) {
					
				console.log('C - Retrieved document in user_favorites: ' + doc._id);
				assert.equal(null, err);
				resultArray.push(ObjectID(doc.hairpiq_id));

			}, function() {
							
				var approved_hairpiqs_cursor = db.collection('approved_hairpiqs').find( { _id: { $in: resultArray }});

				resultArray = []

				approved_hairpiqs_cursor.forEach(function(doc, err) {
						
					console.log('C - Retrieved document in approved_hairpiqs: ' + doc._id);
					assert.equal(null, err);
					resultArray.push(doc);

				}, function() {
									
					res.setHeader('Content-Type', 'application/json');
					res.send(JSON.stringify(resultArray));

				});

			});

		} else {
			console.log('C.B - No limit supplied.');
			res.send('No limit supplied.');
		}

	});

	/*
		retrieve a list of user's hairpiqs
	*/

	app.post('/api/piqtionary/get_user_hairpiqs', function(req, res, next) {

		console.log('B - called: /api/piqtionary/get_user_hairpiqs');

		// find a collection of hairpiqs
		// limit - the amount of docs to return
		// page_num - the index of the set of docs to return

		var resultArray = [];
		var query = {
			'publish_status': 'published',
			'auth0_user_id': req.body.auth0_user_id};

		if (req.body.limit !== undefined && req.body.limit.length > 0) {
			var limit = Number(req.body.limit);
			var skip = Number(req.body.page_num) * Number(req.body.limit);
			var sort = { _id : -1};

			//db.messages.find({$text: {$search: "cook"}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}})

			// if a keyword is included, add it to the query
			if (req.body.term) {
				query.$text = { $search: validator.escape(req.body.term) };
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
		add hairtip
	*/

	app.post('/api/piqtionary/add_hairtip', function(req, res, next) {

		console.log('B - called: /api/piqtionary/add_hairtip');

		// insert a new hairtip into hairtips collection

		// data needed
		// - auth0_user_id : string
		// - hairpiq_id : string
		// - body_text : string

		var item = {
			auth0_user_id: req.body.auth0_user_id,
			hairpiq_id: req.body.hairpiq_id,
			body_text: validator.escape(req.body.body_text)
		}

		db.collection('hairtips').insertOne(item, function(err, result) {
							
			assert.equal(null, err);
			console.log('C.A - Item inserted into hairtips: ' + result.insertedId);

			res.send(JSON.stringify('success'));

		});

	});

	/*
		get hairtips by user
	*/

	app.post('/api/piqtionary/get_all_hairtips', function(req, res, next) {

		console.log('B - called: /api/piqtionary/get_all_hairtips');

		// get all hairtips

		var resultArray = []

		var cursor = db.collection('hairtips').find()

		cursor.forEach(function(doc, err) {
					
			console.log('C - Retrieved document in hairtips: ' + doc._id);
			assert.equal(null, err);
			resultArray.push(doc);

		}, function() {
							
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(resultArray));

		});

	});

	/*
		get hairtips by user
	*/

	app.post('/api/piqtionary/get_hairtips_by_user_id', function(req, res, next) {

		console.log('B - called: /api/piqtionary/get_hairtips_by_user_id');

		// insert a new hairtip into hairtips collection

		// data needed
		// - auth0_user_id : string
		// - body_text : string

		var item = {
			auth0_user_id: req.body.auth0_user_id
		}

		var resultArray = []

		var cursor = db.collection('hairtips').find(item)

		cursor.forEach(function(doc, err) {
					
			console.log('C - Retrieved document in hairtips: ' + doc._id);
			assert.equal(null, err);
			resultArray.push(doc);

		}, function() {
							
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(resultArray));

		});

	});

	/*
		get hairtips by user
	*/

	app.post('/api/piqtionary/get_hairtip_by_hairpiq_id', function(req, res, next) {

		console.log('B - called: /api/piqtionary/get_hairtip_by_hairpiq_id');

		// insert a new hairtip into hairtips collection

		// data needed
		// - auth0_user_id : string
		// - body_text : string

		var item = {
			hairpiq_id: req.body.hairpiq_id
		}

		var resultArray = []

		var cursor = db.collection('hairtips').find(item)

		cursor.forEach(function(doc, err) {
					
			console.log('C - Retrieved document in hairtips: ' + doc._id);
			assert.equal(null, err);

			doc.body_text = validator.unescape(doc.body_text)
			
			resultArray.push(doc);

		}, function() {
							
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(resultArray));

		});

	});

	/*
		edit hairtip
	*/

	app.post('/api/piqtionary/edit_hairtip', function(req, res, next) {

		console.log('B - called: /api/piqtionary/edit_hairtip');

		// insert a new hairtip into hairtips collection

		// data needed
		// - hairpiq_id : string

		var query = {
			hairpiq_id: req.body.hairpiq_id,
		}

		var item = {
			body_text: validator.escape(req.body.body_text)
		}

		db.collection('hairtips').update(query, { $set: item }, function(err, result) {
							
			assert.equal(null, err);
			console.log('C.A - Item edited in hairtips: ' + query.hairpiq_id);

			res.send(JSON.stringify('success'));

		});

	});

	/*
		delete hairtip
	*/

	app.post('/api/piqtionary/delete_hairtip', function(req, res, next) {

		console.log('B - called: /api/piqtionary/delete_hairtip');

		// delete a hairtip from the hairtips collection

		// data needed
		// - hairpiq_id : string

		var query = {
			hairpiq_id: req.body.hairpiq_id,
		}

		db.collection('hairtips').remove(query, function(err, result) {
					
			assert.equal(null, err);
			console.log('C - Deleted document from hairtips: ' + query.hairpiq_id);

			res.send(JSON.stringify('success'));
		
		});

	});

}