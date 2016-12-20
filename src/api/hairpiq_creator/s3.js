require('dotenv').config();
var config = process.env;
var request = require('request');
var fs = require('fs');
var S3FS = require('s3fs');
var s3fsImpl = new S3FS(config.S3_BUCKET_NAME, {
	accessKeyId: config.S3_ACCESS_KEY_ID,
	secretAccessKey: config.S3_SECRET_ACCESS_KEY
});
var endpoint_url = 'https://' + config.S3_BUCKET_NAME + '.s3.amazonaws.com/';

module.exports = {
	save: function(long_url){
		
		console.log('adding file to s3-queue...');

		// temporarily add file from long url into s3-queue

		var pieces = long_url.split('/');
		var filename = pieces[pieces.length - 1] + '.jpg';
		var filepath = __dirname + '/s3-queue/' + filename;

		return new Promise(function(resolve, reject) {

			request(long_url).pipe(fs.createWriteStream(filepath)).on("finish", function() {
		
				// when file is added to queue
					// save it to s3
					// then return the url

				var stream = fs.createReadStream(filepath);

				s3fsImpl.writeFile(filename, stream, {ContentType: 'image/jpeg'}).then(function() {
					fs.unlink(filepath, function(err) {
						if(err)
						{
							console.log(err);
							reject(new Error(err));
						}

						var result = {
							url: endpoint_url + filename
						}

						resolve(result);
						
					});
				});

			});

		});
		
	},
	update: function(long_url) {

		var pieces = long_url.split('/');
		var filename = pieces[pieces.length - 1];
		var filepath = __dirname + '/s3-queue/' + filename;

		return new Promise(function(resolve, reject) {

			// add updated version to queue
			request(long_url).pipe(fs.createWriteStream(filepath)).on("finish", function() {
		
				// when file is added to queue
					// save it to s3
					// then return the url

				var stream = fs.createReadStream(filepath);

				s3fsImpl.writeFile(filename, stream, {ContentType: 'image/jpeg'}).then(function() {
					fs.unlink(filepath, function(err) {
						if(err)
						{
							console.log(err);
							reject(new Error(err));
						}

						var result = {
							url: endpoint_url + filename
						}

						resolve(result);
						
					});
				});

			});

		});

	}

}