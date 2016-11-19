var express = require('express');
var app = express();

// identify static folder
var fs = require('fs');
var dir = __dirname + '/hairpiq/s3-queue';
if (!fs.existsSync(dir))
    fs.mkdirSync(dir);
app.use(express.static(dir));

// allow nodejs to access get and post variables
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

// allow nodejs to utilize session storage
var config = require('./config/hairpiq');
var session = require('express-session');
app.use(session({ secret: config.session.secret, resave: true, saveUninitialized: true}));
// instantiate hairpiq module
var hairpiq = require('./hairpiq/hairpiq')(app);

app.listen(3000, function() {
    //
});