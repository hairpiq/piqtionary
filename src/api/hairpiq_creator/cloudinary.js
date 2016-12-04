var config = require('../../../config/cloudinary');

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: config.cloud_name, 
  api_key: config.api_key, 
  api_secret: config.api_secret
});

module.exports = {
	create: function(photo_url, stylename, ig_username, options) {

		var settings = {
			width: 1080,
			aspect_ratio: "4:5",
			crop: "fill",
			colors: true
		}

		var _options = {
			gravity: "south",
			theme: {
				logo: "white",
				plate: "dark",
				color: ""
			}
		}

		for (var k in settings)
			_options[k] = settings[k];

		for (k in options)
			_options[k] = options[k];

		return new Promise(function(resolve, reject) {

			cloudinary.uploader.upload(photo_url, function(result) { 

				var public_id = result.public_id;

				_options.theme.color = result.predominant.google[1][0];

				var rendered_url = addMeta({
					id: public_id,
					stylename: stylename,
					ig_username: ig_username,
					theme: _options.theme
				});

				var result = {
					rendered_url: rendered_url,
					orig_photo_url: result.secure_url
				}

				resolve(result);
			},
			_options);

		});

	}
};

function addMeta(obj) {

	config.meta = {};

	// Apply Logo Customizations

	config.meta.logo = {
		color: "",  
		opacity: 0
	}

	switch (obj.theme.logo) {

		case "light":

			config.meta.logo.color = "white";
			config.meta.logo.opacity = 100

		break;
		
		case "dark":

			config.meta.logo.color = "black";
			config.meta.logo.opacity = 40

		break;

		case "color":

			config.meta.logo.color = obj.theme.color;
			config.meta.logo.opacity = 80;

		break;
	}

	// Apply Plate Customizations

	config.meta.plate = {
		color: "",
		opacity: 0,
		stylename_font_size : 62,
		ig_username_font_size : 50
	}

	switch (obj.theme.plate) {

		case "light":

			config.meta.plate.color = "white";
			config.meta.plate.opacity = 25;

		break;

		case "dark":

			config.meta.plate.color = "black";
			config.meta.plate.opacity = 25;

		break;

		case "color":

			config.meta.plate.color = obj.theme.color;
			config.meta.plate.opacity = 25;

		break;

	}

	// Apply Meta info

	return cloudinary.url(obj.id, {
		transformation:[
		{
			overlay: "logo",
			x: 74,
			y: 77,
			gravity: "north_west",
			effect: "colorize",
			color: config.meta.logo.color,
			opacity: config.meta.logo.opacity,
			width: 372
		},
		{
			overlay: "plate",
			x: 360,
			y: 148,
			gravity: "south_west",
			effect: "colorize",
			color: config.meta.plate.color,
			opacity: config.meta.plate.opacity
		},
		{
			overlay:"text:Montserrat_" + config.meta.plate.stylename_font_size + "_bold:" + obj.stylename,
			x: 390,
			y: 234,
			gravity: "south_west",
			color: "white"
		},
		{
			overlay:"text:Montserrat_" + config.meta.plate.ig_username_font_size + "_letter_spacing_1:" + obj.ig_username,
			x: 390,
			y: 168,
			gravity: "south_west",
			color: "white"
		}]
	});
}
