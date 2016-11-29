var express = require('express');
var app = express();

// allow nodejs to access get and post variables
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// instantiate hairpiq module
var hairpiq = require('./hairpiq')(app);

//instantiate piqtionary web app module
var piqtionary = require('./piqtionary')(app);

// bind this app to this port
// (on the server, make sure Nginx listens to a different port than
// what is specified here and Passenger will take care of the rest)
app.listen(3000, function() {
    //
});