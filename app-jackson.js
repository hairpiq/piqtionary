var express = require('express');
var app = express();

var config = require('./config/hairpiq');
var clarifai = require('./src/api/hairpiq_creator/clarifai');

// allow nodejs to access get and post variables
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.listen(3000, function() {
    //
});

//clarifai.predict('http://www.outfittrends.com/wp-content/uploads/2014/10/cute-black-girls-hairstyles.jpg');

app.get('/', function(req, res) {
    res.send('Clarifai test.')
});

app.post('/test', function(req, res) {
    console.log("C");
    console.log(req.body.MediaUrl0);

    // predict name of hairstyle
    clarifai.predict(req.body.MediaUrl0).then(function(result) {
        console.log(result);
        res.send(result.name);
    });

});

app.post('/insert', function(req, res) {
    
	console.log(req.body.s3_url);
	console.log(req.body.stylename);
	console.log(req.body.ig_username);

    // predict name of hairstyle
    console.log('AA');
    clarifai.insert(req.body.s3_url, req.body.stylename, req.body.ig_username).then(function(result) {
    	console.log('BB');
        res.send(result);
        console.log('CC');
    });

});
