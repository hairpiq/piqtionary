var express = require('express');
var app = express();

// identify static folder
app.use(express.static( __dirname + '/hairpiq/s3-queue'));

// allow nodejs to access get and post variables
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

// instantiate hairpiq module
var hairpiq = require('./hairpiq/hairpiq')(app);

app.listen(3000, function() {
	//
});