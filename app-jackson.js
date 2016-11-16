var express = require('express');
var app = express();

var config = require('./config/hairpiq');
var clarifai = require('./hairpiq/clarifai');

// allow nodejs to access get and post variables
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.listen(3000, function() {
    //
});

clarifai.predict('http://www.outfittrends.com/wp-content/uploads/2014/10/cute-black-girls-hairstyles.jpg');

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
