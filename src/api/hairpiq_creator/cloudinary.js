require('dotenv').config();
var config = process.env;
var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: config.CLOUDINARY_CLOUD_NAME, 
  api_key: config.CLOUDINARY_API_KEY, 
  api_secret: config.CLOUDINARY_API_SECRET
});

module.exports = {
	create: function(photo_url, stylename, ig_username, options = null) {

		var settings = {
			width: 1080,
			aspect_ratio: "4:5",
			crop: "fill",
			gravity: "south"
		}

		var _options = {
			logo: {
					color: "white",
					opacity: 1
				},
			plate: {
				color: "black",
				opacity: 0.5
			}
		}

		if ( options !== null)
			_options = options;

		return new Promise(function(resolve, reject) {

			cloudinary.uploader.upload(photo_url, function(result) { 

				var public_id = result.public_id;

				var rendered_url = addTransformations({
					id: public_id,
					stylename: stylename,
					ig_username: ig_username,
					options: _options
				});

				var result = {
					rendered_url: rendered_url,
					orig_photo_url: result.secure_url
				}

				resolve(result);
			},
			settings);

		});

	},
	update: function(public_id, stylename, ig_username, options = null) {

		var _options = {
				logo: {
					color: "white",
					opacity: 1
				},
				plate: {
					color: "black",
					opacity: 0.5
				}
			};

		if (options !== null)
			_options = options;
		
		return new Promise(function(resolve, reject) {
			
			var rendered_url = addTransformations({
					id: public_id,
					stylename: stylename,
					ig_username: ig_username,
					options: _options
				});

			var result = {
				rendered_url: rendered_url
			}

			resolve(result);

		});
	},
	delete: function(public_id) {

		return new Promise(function(resolve, reject) {
			
			cloudinary.uploader.destroy(public_id, function(result) {
				
				resolve(result);

			});

		});

	}
};

function addTransformations(obj) {

	// Apply Meta info

	var transformations = [];

	// apply crop info if supplied

	if(obj.options.hasOwnProperty('crop_data')) {
		
		// crop out the identified portion of the image
		let crop_data = obj.options.crop_data;
		crop_data.crop = obj.options.crop_type;
		transformations.push(crop_data);

		// lastly, scale image to prefered hairpiq width of 1080
		// an aspect ratio of "4:5" will scale to the preferred height to 1350

		let hairpiq_width = 1080;
		transformations.push({
			width: hairpiq_width,
			aspect_ratio: '4:5',
			effect: 'sharpen'
		});
	};

	if(obj.options.hasOwnProperty('logo')) {

		// overlay logo

		transformations.push({
			overlay: "logo",
			x: 74,
			y: 77,
			gravity: "north_west",
			effect: "colorize",
			color: obj.options.logo.color,
			opacity: obj.options.logo.opacity * 100,
			width: 372
		});

		// overlay plate

		transformations.push({
			overlay: "plate",
			x: 360,
			y: 148,
			gravity: "south_west",
			effect: "colorize",
			color: obj.options.plate.color,
			opacity: obj.options.plate.opacity * 100
		});

		const stylename_font_size = 62;
		const ig_username_font_size = 50;

		// overlay Style Name

		transformations.push({
			overlay:"text:Montserrat_" + stylename_font_size + "_bold:" + obj.stylename,
			x: 390,
			y: 1068,
			gravity: "north_west",
			color: "white"
		});

		// overlay IG Username

		transformations.push({
			overlay:"text:Montserrat_" + ig_username_font_size + "_letter_spacing_1:" + obj.ig_username,
			x: 390,
			y: 1136,
			gravity: "north_west",
			color: "white"
		});
	}

	return cloudinary.url(obj.id, {
		transformation:transformations
	});
}
