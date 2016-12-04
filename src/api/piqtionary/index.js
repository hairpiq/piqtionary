var ObjectID = require("mongodb").ObjectID;
var assert = require('assert');

module.exports = function(app, db) {

	/*
		submit a hairpiq to the review queue
	*/

	console.log('piqtionary api started');

	app.post('/piqtionary/submit', function(req, res, next) {

		console.log('A - called: /piqtionary/submit');

		var item = {
			rendered_url: req.body.rendered_url,
			orig_photo_url: req.body.orig_photo_url,
			s3_url: req.body.s3_url,
			stylename: req.body.stylename,
			ig_username: req.body.ig_username
		};

		db.collection('pending_hairpiqs').insertOne(item, function(err, result) {
						
			assert.equal(null, err);
			console.log('B - Item inserted into pending_hairpiqs: ' + result.insertedId);

			res.end();
		
		});
	});

	/*
		approve or reject a hairpiq in the review queue
	*/

	app.post('/piqtionary/approve', function(req, res, next) {

		console.log('A - called: /piqtionary/approve');

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
				console.log('B.A - Item inserted into approved_hairpiqs: ' + result.insertedId);
				removePendingHairpiq(pending_id);

			});

		} else {

			console.log('Item is rejected');

			db.collection('removed_hairpiqs').insertOne(item, function(err, result) {
							
				assert.equal(null, err);
				console.log('B.B - Item inserted into removed_hairpiqs: ' + result.insertedId);
				removePendingHairpiq(pending_id);

			});

		}

		function removePendingHairpiq() {

			db.collection('pending_hairpiqs').remove(pending_id, function(err, result) {
							
				assert.equal(null, err);
				console.log('C - Item removed from pending_hairpiqs: ' + pending_id._id);

				res.end();
			
			});

		}

	});

	/*
		update a hairpiq published status
	*/

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
				
		db.collection('approved_hairpiqs').update(id, { $set: item }, function(err, result) {
					
			assert.equal(null, err);
			console.log('B - Updated document in approved_hairpiqs: ' + id._id);

			res.end();
		
		});

	});

	/*
		delete a hairpiq
	*/

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
					
		db.collection('pending_hairpiqs').remove(id, function(err, result) {
					
			assert.equal(null, err);
			console.log('B - Deleted document from removed_hairpiqs: ' + id._id);

			res.end();
		
		});

		

	});
}